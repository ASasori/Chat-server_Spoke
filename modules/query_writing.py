import json
import re
from typing import Dict, Any
from modules.llm_client import BaseLLMClient

class QueryWriting:
    def __init__(
        self,
        llm_client: BaseLLMClient
    ):
        print("Initializing QueryWriting module...")
        self.llm_client = llm_client
        print("--- QueryWriting ready ---")
    
    @staticmethod
    def _format_history_for_prompt(history: list) -> str:
        if not history:
            return "No history provided"
        
        formatted_lines = []
        for msg in history:
            role = msg.get("role", "unknow").capitalize()
            content = msg.get("content", "")
            formatted_lines.append(f"{role}: {content}")
        return "\n".join(formatted_lines)
    
    async def get_standalone_question(self, question: str, history: list) -> str:
        
        formatted_history = self._format_history_for_prompt(history)

        print("\n ---- Rewriting query ---- \n")

        final_prompt = f"""
        You are an expert query rewriter. Your task is to transform the 'New Question' into a single, standalone, 
        and contextually complete question. Use the 'Chat History' to understand the context and resolve any references, pronouns (like 'it', 'its', 'they', 'that'), or ambiguities. 
        **Rules:** 
        1. If the 'New Question' is already self-contained and clear (e.g., "What are the side effects of Aspirin?"), return it exactly as it is. 
        2. If the 'New Question' is a follow-up (e.g., "What are its symptoms?"), rewrite it using context from the history (e.g., "What are the symptoms of Breast Cancer?"). 
        3. Your output MUST be **only** the rewritten question. Do not add any conversational text, explanations, or labels like "Standalone Question:". 
        **Chat History:** 
            {formatted_history} 
        **New Question:** 
            {question}
        """
        try:
            # Use the LLM client (which now has retry logic)
            final_standalone_question = await self.llm_client.query_writing(final_prompt)
            return final_standalone_question
        except Exception as e:
            print(f"Error when generating final answer: {e}")
            return "An error occurred while trying to generate the final answer."



