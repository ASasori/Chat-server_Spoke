# main.py

import os
import json
import time
from dotenv import load_dotenv

# Import our new separated modules
from modules.llm_client import GeminiLLMClient
from modules.smart_search import SmartSearch
from modules.spoke_executor import SpokeExecutor
from modules.generate_answer import AnswerGenerator

def main():
    start_time = time.time()
    
    # --- 1. INITIALIZE MODULES ---
    
    load_dotenv()
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        print("Error: GEMINI_API_KEY not found. Please set it in your .env file.")
        return

    # Initialize the single LLM client
    # We added retry logic to this client
    main_llm_client = GeminiLLMClient(api_key=gemini_key)

    # Module 1: Planner (needs LLM)
    search_module = SmartSearch(
        llm_client=main_llm_client,
        schema_path="modules/spoke_types.json",
        planner_template_path="modules/planner_prompt_v3.txt" # Make sure this path is correct
    )
    
    # Module 2: Executor (LLM is optional for pruning)
    executor = SpokeExecutor(
        llm_client=main_llm_client, # Pass client to enable pruning
        pruning_threshold=15
    )
    
    # Module 3: Answer Generator (needs LLM)
    answer_module = AnswerGenerator(llm_client=main_llm_client)
    
    print("\n" + "="*20 + " ALL MODULES INITIALIZED " + "="*20)

    # --- 2. DEFINE THE QUESTION ---
    
    # nlq = "What adverse event is caused by Fulvestrant ?"
    nlq = "What symptoms are presented by diseases that are treated by Fulvestrant?"
    # nlq = "What compounds treat Parkinson's disease AND also cause the side effect 'Nausea'?"
    
    try:
        # --- 3. RUN THE PIPELINE ---
        
        # Step 1: PLAN
        plan = search_module.get_execution_plan(nlq)
        if plan.get("error"):
            print(f"Error during planning: {plan.get('error')}")
            return
        
        print("\n--- [Planner Result] ---")
        print(json.dumps(plan, indent=2))

        # Step 2: EXECUTE
        # Executor now returns the full context_store dictionary
        context_store = executor.execute_plan(plan, nlq)
        
        print("\n--- [Final Context Store] ---")
        print(json.dumps(context_store, indent=2))

        # Step 3: GENERATE (RAG)
        final_answer = answer_module.generate_final_answer(
            nlq=nlq,
            context_store=context_store
        )

        print("\n" + "="*25 + " FINAL ANSWER " + "="*25)
        print(final_answer)
        print("="*64)
    
    except Exception as e:
        print(f"\nAn unhandled error occurred in the main pipeline: {e}")

    finally:
        end_time = time.time()
        print(f"Total execution time: {end_time - start_time:.2f} seconds")

if __name__ == "__main__":
    main()