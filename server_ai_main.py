# server_ai_main.py

import os
import json
import time
import logging
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from dotenv import load_dotenv
from contextlib import asynccontextmanager

# Import your class modules
from modules.llm_client import GeminiLLMClient
from modules.generate_topic import TopicGenerator
from modules.query_writing import QueryWriting
from modules.smart_search import SmartSearch
from modules.spoke_executor import SpokeExecutor
from modules.generate_answer import AnswerGenerator

# Configure logging for easy debugging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("ai_server.log", encoding="utf-8"),  # Ghi ra file
        logging.StreamHandler()              # Ghi ra console
    ]
)

# --- 1. INITIALIZE MODULES ON SERVER STARTUP ---

# We will use global variables to hold the module instances
# This ensures they are initialized only once
topic_module: TopicGenerator = None
query_writing: QueryWriting = None
search_module: SmartSearch = None
executor: SpokeExecutor = None
answer_module: AnswerGenerator = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    This function will run once when the server starts.
    It loads the API key and initializes all necessary modules.
    """
    global topic_module, query_writing, search_module, executor, answer_module
    
    logging.info("Server is starting up...")
    
    load_dotenv()
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        logging.error("FATAL: GEMINI_API_KEY not found in .env file. Server cannot start.")
        raise ValueError("GEMINI_API_KEY is not set.")

    try:
        # Initialize the shared LLM client
        main_llm_client = GeminiLLMClient(api_key=gemini_key)
        
        topic_module = TopicGenerator(
            llm_client=main_llm_client
        )
        query_writing = QueryWriting(
            llm_client=main_llm_client
        )
        # Module 1: Planner (SmartSearch)
        search_module = SmartSearch(
            llm_client=main_llm_client,
            schema_path="modules/spoke_types.json",
            planner_template_path="modules/planner_prompt_v3.txt"
        )
        
        # Module 2: Executor (SpokeExecutor)
        executor = SpokeExecutor(
            llm_client=main_llm_client, # Enable pruning to optimize data
            pruning_threshold=15
        )

        # Module 3: Answer Generator
        answer_module = AnswerGenerator(llm_client=main_llm_client)
        
        logging.info("="*20 + " ALL AI MODULES INITIALIZED SUCCESSFULLY " + "="*20)
    
    except Exception as e:
        logging.error(f"Failed to initialize AI modules: {e}")
        # If initialization fails, the server cannot function correctly
        raise e
    yield
    
    # --- This is the SHUTDOWN code (runs when server stops) ---
    logging.info("Server is shutting down...")

# Initialize the FastAPI application
app = FastAPI(
    title="Intelligent Q&A AI Server",
    description="AI server for processing tasks in an intelligent Q&A system using SPOKE and LLM.",
    lifespan=lifespan
)
# --- 2. DEFINE THE COMPLETE PROCESSING PIPELINE ---

async def run_full_pipeline(question: str, history: list, is_first: bool) -> str:
    """
    This function executes the entire pipeline from question to final answer.
    Note: For best performance, the methods in your classes should be `async def`.
    Otherwise, FastAPI will automatically run them in a separate thread pool.
    """
    try:
        start_time = time.time()
        logging.info(f"Start time: {start_time}")
        logging.info(f"Pipeline started for question: '{question}'")
        logging.info(f"Is fisrt: {is_first}")

        async def generate_main_answer():
            # Step 0: Rewrite query based on query and history
            standalone_question = await query_writing.get_standalone_question(question, history)

            # Step 1: PLAN - Create execution plan
            plan = await search_module.get_execution_plan(standalone_question)
            if plan.get("error"):
                logging.error(f"Planning failed: {plan.get('error')}")
                return f"Sorry, I encountered an error during planning: {plan.get('error')}"
            
            logging.info(f"Plan created: {json.dumps(plan, indent=2)}")

            # Step 2: EXECUTE - Execute the plan and fetch data
            context_store = await executor.execute_plan(plan, standalone_question)
            
            logging.info(f"Context store: {json.dumps(context_store, indent=2)}")
            logging.info("Execution completed. Final Context Store is ready.")

            # Step 3: GENERATE (RAG) - Generate answer from data
            final_answer = await answer_module.generate_final_answer(
                original_question=question,
                nlq=standalone_question,
                context_store=context_store,
                # history=history # Pass history as well so the LLM has context
            )
            logging.info("Final answer generated.")
            return final_answer
        
        async def generate_topic_title():
            if is_first:
                try:
                    logging.info("Final topic generated.")
                    return await topic_module.generate_topic(question)
                except Exception as e:
                    logging.error(f"Error generating topic: {e}")
                    return "New Chat" # Fallback title nếu lỗi
            return None
        
        logging.info("Running tasks in parallel...")
        answer_result, title_result = await asyncio.gather(
            generate_main_answer(), 
            generate_topic_title()
        )
        logging.info(f"Final answer: {answer_result}")
        logging.info(f"Final title: {title_result}")
        
        end_time = time.time()
        logging.info(f"End time: {end_time}")
        logging.info(f"Total time for entire processing: {end_time - start_time}")

        return answer_result, title_result

    except Exception as e:
        logging.error(f"An error occurred in the AI pipeline: {e}", exc_info=True)
        return "Sorry, an unexpected error occurred during processing. Please try again."

# --- 3. DEFINE WEBSOCKET ENDPOINT ---

@app.websocket("/ws/query")
async def websocket_endpoint(websocket: WebSocket):
    """
    This endpoint will listen for WebSocket connections from the Normal Server.
    - Receives: JSON containing `question` and `history`.
    - Sends: JSON containing `answer` or `error`.
    """
    await websocket.accept()
    logging.info("WebSocket connection established.")
    try:
        while True:
            # 1. Receive data from Normal Server
            data = await websocket.receive_json()
            question = data.get("question")
            history = data.get("history", [])
            is_first = data.get("is_first", False)

            if not question:
                await websocket.send_json({"error": "No question provided"})
                continue

            # 2. Call the AI processing pipeline
            answer, title = await run_full_pipeline(question, history, is_first)
        
            # 3. Send the result back to the Normal Server
            await websocket.send_json({"answer": answer, "title": title})
            
    except WebSocketDisconnect:
        logging.info("WebSocket connection closed.")
    except Exception as e:
        logging.error(f"An error occurred in the WebSocket connection: {e}")
        # Try to send a final error message if possible
        try:
            await websocket.send_json({"error": f"Server error: {str(e)}"})
        except RuntimeError:
            pass