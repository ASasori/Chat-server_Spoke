# generate_answer.py

import json
from typing import Dict, Any
from modules.llm_client import BaseLLMClient

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

    # async def generate_final_answer(self, nlq: str, context_store: Dict[str, Any]) -> str:
    #     """
    #     Generates a final answer using the original question and the
    #     full context store (which includes intermediate steps).
    #     """
    #     print("\n--- [Task 3] Synthesizing final answer... ---")

    #     # Check if the final result is empty or the store is empty
    #     if not context_store or not context_store.get("final_result"):
    #         # Check for intermediate steps to explain *why* it failed
    #         if context_store:
    #              return "Based on the data, I followed the steps but could not find a final answer for your question."
    #         return "Based on the available data, I cannot find an answer to your question in the knowledge base."
        
    #     context_str = json.dumps(context_store, indent=2)

    #     final_prompt = f"""
    #     You are an expert biomedical reasoning agent. Your task is to answer the user's question in clear, natural language, providing a step-by-step rationale.
    #     You MUST base your answer ONLY on the structured JSON context provided below. Do not use any external knowledge.

    #     The JSON context is a dictionary. Each key (e.g., "diseases_list", "final_result") represents the data found at a specific step of the query.
    #     - The "final_result" key holds the primary list of items that answer the question.
    #     - The *other keys* (e.g., "diseases_list") provide the intermediate *reasoning path* or *evidence* that connects the query to the final answer.

    #     User's Question:
    #     "{nlq}"

    #     Data Context from Knowledge Graph (all steps):
    #     ```json
    #     {context_str}
    #     ```

    #     Instructions:
    #     1.  Analyze the user's question: "{nlq}"
    #     2.  Look at the "final_result" key. This is the primary list of items to answer the question.
    #     3.  Look at the *other keys* in the JSON (e.g., "diseases_list", "side_effects_list") to understand the *connection* or *reasoning* path.
    #     4.  Formulate a direct answer.
    #     5.  **Crucially, explain *how* you found the answer by referencing the intermediate steps.** Your explanation must *only* reflect the data connections shown in the context and **must not add any information, inferences, or assumptions not present in the JSON.**
    #     6.  **Add a Disclaimer:** Always conclude your response with a clear disclaimer, formatted as a blockquote. For example:
    #         > **Note:** This information is for reference only and is not a substitute for professional medical advice, diagnosis, or treatment.
        
    #     Example (for a query "What symptoms do diseases treated by Fulvestrant have?"):
    #     "Based on the data, the drug Fulvestrant is found to treat diseases such as 'Breast Cancer' and 'Ovarian Cancer'. These diseases, in turn, are associated with symptoms like 'Fatigue', 'Nausea', and 'Pain'.

    #     > **Note:** This information is for reference only and is not a substitute for professional medical advice, diagnosis, or treatment."

    #     If the "final_result" list is empty, state that no results were found after following the steps (and still add the disclaimer).
    #     Do not mention the JSON file, keys (like "final_result"), or AI. Weave the reasoning into a natural language answer.
    #     """
        
    #     try:
    #         # Use the LLM client (which now has retry logic)
    #         final_answer = await self.llm_client.generate_text(final_prompt)
    #         return final_answer
    #     except Exception as e:
    #         print(f"Error when generating final answer: {e}")
    #         return "An error occurred while trying to generate the final answer."

    # generate answer through original_question, nlq: processed question and context store
    async def generate_final_answer(self, original_question: str, nlq: str, context_store: Dict[str, Any]) -> str:
        """
        Generates a final answer using the original question and the
        full context store. Ensures the response language matches the user's input language.
        """
        print("\n--- [Task 3] Synthesizing final answer... ---")

        try:
            if not context_store or not context_store.get("final_result"):
                
                # Kiểm tra xem có step trung gian nào không để giải thích lý do (nếu cần)
                reasoning_context = ""
                if context_store:
                    reasoning_context = f"Internal Trace: {json.dumps(context_store)}"

                empty_prompt = f"""
                You are a helpful assistant.
                INPUT CONTEXT:
                1. User's Original Question: "{original_question}"
                2. System Processed Query: "{nlq}"
                
                Task:
                1. Detect the language of user's original question (e.g., Vietnamese, English).
                2. The system searched based on the Processed Query but found **NO INFORMATION**.
                Please inform the user politely that **no information was found** in the internal knowledge base regarding their specific query.
                3. If there is 'Internal Trace' data below, briefly summarize in general terms why it failed (optional), but keep it user-friendly.
                4. **CRITICAL:** The output MUST be in the SAME LANGUAGE as user's original question.
                5. **CONDITIONAL DISCLAIMER:** - IF 'Internal Trace' data is present below: Add a standard medical disclaimer at the end in the SAME LANGUAGE.
                   - ELSE (If no Internal Trace): Do NOT add any disclaimer.
                
                {reasoning_context}
                """
                
                # Gọi LLM để sinh câu thông báo "Không tìm thấy" chuẩn ngôn ngữ
                no_data_response = await self.llm_client.generate_failed_text(empty_prompt)
                return no_data_response

            # 2. Xử lý trường hợp CÓ DỮ LIỆU (Success Case)
            context_str = json.dumps(context_store, indent=2, ensure_ascii=False)

            final_prompt = f"""
            You are an expert biomedical reasoning agent. Your task is to answer the user's question based ONLY on the provided JSON context.

            INPUTS:
            1. **User's Original Question:** "{original_question}" 
            (Use this to determine the **OUTPUT LANGUAGE** and tone).
            2. **System Processed Query:** "{nlq}" 
            (Use this to understand the **LOGIC** and match with the Data Context).

            Data Context from Knowledge Graph:
            ```json
            {context_str}
            ```

            Instructions:
            1.  **LANGUAGE DETECTION:** Identify the language used in "User's Original Question" (Input 1). (e.g., Vietnamese, English, French).
            2.  **OUTPUT GENERATION:** Generate the entire response **IN THAT EXACT SAME LANGUAGE**.
            3.  **ANALYSIS:** Analyze the "final_result" and intermediate keys ("diseases_list", etc.) in the JSON to answer the query.
            4.  **REASONING:** Explain *how* you found the answer by referencing the intermediate steps found in the Data Context. 
                - Do not add outside knowledge. 
                - Ensure the explanation logic matches the "System Processed Query" but is expressed in the target language.
            5.  **DISCLAIMER:** Conclude with a disclaimer translated into the target language. 
                (English template: "Note: This information is for reference only and is not a substitute for professional medical advice, diagnosis, or treatment.")

            If the "final_result" is valid, explain the findings clearly in the target language.
            """
            
            # Gọi LLM xử lý câu trả lời chính
            final_answer = await self.llm_client.generate_text(final_prompt)
            return final_answer

        except Exception as e:
            print(f"Error when generating final answer: {e}")
            return "Đã xảy ra lỗi trong quá trình tạo câu trả lời. Vui lòng thử lại sau. (An error occurred while generating the answer.)"