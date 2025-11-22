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
    
    # async def get_standalone_question(self, question: str, history: list) -> str:
        
    #     formatted_history = self._format_history_for_prompt(history)

    #     print("\n ---- Rewriting query ---- \n")

    #     final_prompt = f"""
    #     You are an expert query rewriter. Your task is to transform the 'New Question' into a single, standalone, 
    #     and contextually complete question. Use the 'Chat History' to understand the context and resolve any references, pronouns (like 'it', 'its', 'they', 'that'), or ambiguities. 
    #     **Rules:** 
    #     1. If the 'New Question' is already self-contained and clear (e.g., "What are the side effects of Aspirin?"), return it exactly as it is. 
    #     2. If the 'New Question' is a follow-up (e.g., "What are its symptoms?"), rewrite it using context from the history (e.g., "What are the symptoms of Breast Cancer?"). 
    #     3. Your output MUST be **only** the rewritten question. Do not add any conversational text, explanations, or labels like "Standalone Question:". 
    #     **Chat History:** 
    #         {formatted_history} 
    #     **New Question:** 
    #         {question}
    #     """
    #     try:
    #         # Use the LLM client (which now has retry logic)
    #         final_standalone_question = await self.llm_client.query_writing(final_prompt)
    #         return final_standalone_question
    #     except Exception as e:
    #         print(f"Error when generating final answer: {e}")
    #         return "An error occurred while trying to generate the final answer."

    async def get_standalone_question(self, question: str, history: list) -> str:
        
        formatted_history = self._format_history_for_prompt(history)

        print("\n ---- Rewriting query to English ---- \n")

        final_prompt = f"""
        You are an expert query translator and rewriter for a biomedical knowledge graph.
        Your goal is to output a single **English** question that represents the user's intent.

        **Chat History:**
        {formatted_history}

        **New Question:**
        {question}

        **Instructions:**
        1. **MANDATORY OUTPUT LANGUAGE:** The final output must ALWAYS be in **ENGLISH**, regardless of the input language (Vietnamese, etc.).

        2. **Logic Check (Choose A or B):**
           - **Case A: The 'New Question' is already self-contained and clear.** (e.g., "Tác dụng phụ của Aspirin là gì?" or "What acts on Gene TP53?")
             -> **Action:** Simply **translate** it to English directly. Do NOT add extra context or alter the meaning.
             
           - **Case B: The 'New Question' is ambiguous, vague, or a follow-up.** (e.g., "Triệu chứng của nó?", "Còn Side Effect thì sao?", "Nó điều trị bệnh gì?")
             -> **Action:** Resolve the pronouns (it, they, nó, chúng) using the 'Chat History', then **rewrite** the complete question in English.

        3. **Constraint:** - Do NOT answer the question. 
           - Return **ONLY** the rewritten English question string. No "Here is the question:" or "Standalone:".

        **Examples:**
        - Input: "Aspirin điều trị bệnh gì?" (Self-contained) -> Output: "Which diseases does Aspirin treat?"
        - Input: "Nó có tác dụng phụ nào?" (Context: Panadol) -> Output: "What are the side effects of Panadol?"
        """
        
        try:
            final_standalone_question = await self.llm_client.query_writing(final_prompt)
            return final_standalone_question
        except Exception as e:
            print(f"Error when rewriting query: {e}")
            return "An error occurred during query rewriting."