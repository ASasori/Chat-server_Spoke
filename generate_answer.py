# generate_answer.py

import json
from typing import Dict, Any
from llm_client import BaseLLMClient

class AnswerGenerator:
    """
    Generates a final, reasoned natural language answer based on
    the context retrieved by the SpokeExecutor.
    """

    def __init__(self, llm_client: BaseLLMClient):
        """
        Initializes the Answer Generator.
        """
        self.llm_client = llm_client
        print("✓ AnswerGenerator ready.")

    def generate_final_answer(self, nlq: str, context_store: Dict[str, Any]) -> str:
        """
        Generates a final answer using the original question and the
        full context store (which includes intermediate steps).
        """
        print("\n--- [Task 3] Synthesizing final answer... ---")

        # Check if the final result is empty or the store is empty
        if not context_store or not context_store.get("final_result"):
            # Check for intermediate steps to explain *why* it failed
            if context_store:
                 return "Based on the data, I followed the steps but could not find a final answer for your question."
            return "Based on the available data, I cannot find an answer to your question in the knowledge base."
        
        context_str = json.dumps(context_store, indent=2)
        
        final_prompt = f"""
        You are an expert biomedical reasoning agent. Your task is to answer the user's question in clear, natural language, providing a step-by-step rationale.
        You MUST base your answer ONLY on the structured JSON context provided below. Do not use any external knowledge.

        The JSON context is a dictionary. Each key (e.g., "diseases_list", "final_result") represents the data found at a specific step of the query.
        - The "final_result" key holds the primary list of items that answer the question.
        - The *other keys* (e.g., "diseases_list") provide the intermediate *reasoning path* or *evidence* that connects the query to the final answer.

        User's Question:
        "{nlq}"

        Data Context from Knowledge Graph (all steps):
        ```json
        {context_str}
        ```

        Instructions:
        1.  Analyze the user's question: "{nlq}"
        2.  Look at the "final_result" key. This is the primary list of items to answer the question.
        3.  Look at the *other keys* in the JSON (e.g., "diseases_list", "side_effects_list") to understand the *connection* or *reasoning* path.
        4.  Formulate a direct answer.
        5.  **Crucially, explain *how* you found the answer by referencing the intermediate steps.**
        
        Example (for a query "What symptoms do diseases treated by Fulvestrant have?"):
        "Based on the data, the drug Fulvestrant is found to treat diseases such as 'Breast Cancer' and 'Ovarian Cancer'. These diseases, in turn, are associated with symptoms like 'Fatigue', 'Nausea', and 'Pain'."

        If the "final_result" list is empty, state that no results were found after following the steps.
        Do not mention the JSON file, keys (like "final_result"), or AI. Weave the reasoning into a natural language answer.
        """
        
        try:
            # Use the LLM client (which now has retry logic)
            final_answer = self.llm_client.generate_text(final_prompt)
            return final_answer
        except Exception as e:
            print(f"Error when generating final answer: {e}")
            return "An error occurred while trying to generate the final answer."