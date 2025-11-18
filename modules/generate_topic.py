from modules.llm_client import BaseLLMClient

class GenerateTopic:
    def __init__(
        self,
        llm_client: BaseLLMClient
    ):
        print("Initializing Generate Topic module...")
        self.llm_client = llm_client
        print("--- Gerate Topic ready ---")
    
    async def generate_topic(self, question: str) -> str:
    
        print("\n ---- Generate Topic ---- \n")

        final_prompt = f"""
        You are a Topic Name Generator.  
        Your task is to read the user’s question or message and generate a short, clear, descriptive topic name for a new chat.  

        User's question:
        {question}

        Rules:
        1. The topic name must summarize the core subject of the user’s query.  
        2. Keep it concise: 3–7 words.  
        3. Do NOT answer the question or provide explanations.  
        4. Avoid filler words (such as “about”, “regarding”, “question of”).  
        5. Capitalize the topic name appropriately.  
        6. If the question is ambiguous, choose the most likely or general topic.  

        Examples:
        - User: “What are the symptoms of Aspirin?”  
        → Topic Name: “Aspirin Side Effects”

        - User: “How do I improve my Node.js server performance?”  
        → Topic Name: “Optimizing Node.js Performance”

        - User: “Give me Git commands to create a new branch.”  
        → Topic Name: “Git Branch Creation”

        - User: “Explain how transformers work in NLP.”  
        → Topic Name: “NLP Transformer Architecture”

        Return ONLY the topic name.

        """
        try:
            # Use the LLM client (which now has retry logic)
            final_topic = await self.llm_client.query_writing(final_prompt)
            return final_topic
        except Exception as e:
            print(f"Error when generating final answer: {e}")
            return "An error occurred while trying to generate the final answer."
