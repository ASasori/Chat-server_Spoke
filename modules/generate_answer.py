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

    # generate answer through original_question, nlq: processed question and context store
    async def generate_final_answer(self, original_question: str, nlq: str, context_store: Dict[str, Any]) -> str:
        """
        Generates a final answer using the original question and the
        full context store. Ensures the response language matches the user's input language.
        """
        print("\n--- [Task 3] Synthesizing final answer... ---")

        try:
            # 1. Xử lý trường hợp KHÔNG CÓ DỮ LIỆU (Failed Case)
            if not context_store or not context_store.get("final_result"):
                
                # Kiểm tra xem có step trung gian nào không để giải thích lý do (nếu cần)
                reasoning_context = ""
                if context_store:
                    reasoning_context = f"{json.dumps(context_store)}"

                empty_prompt = f"""
                You are a helpful assistant.
                INPUT CONTEXT:
                1. User's Original Question: "{original_question}"
                2. System Processed Query: "{nlq}"
                3. Internal Trace: {reasoning_context}
                
                Task:
                1. Detect the language of User's Original Question (e.g., Vietnamese, English).
                2. The system searched based on the System Processed Query but found **NO INFORMATION**.
                Please inform the user politely that **no information was found** in the internal knowledge base regarding their specific query.
                3. If there is 'Internal Trace', briefly summarize in general terms why it failed (optional), but keep it user-friendly.
                4. **CRITICAL:** The output MUST be in the SAME LANGUAGE as User's Original Question. 
                5. **CONDITIONAL DISCLAIMER:** 
                   - IF 'Internal Trace' data EXISTS and is NOT EMPTY (meaning it contains any non-empty value, text, or content): Add a standard medical disclaimer at the end in the SAME LANGUAGE.
                   (English template: "Note: This information is for reference only and is not a substitute for professional medical advice, diagnosis, or treatment.")
                   - ELSE (If no Internal Trace is EMPTY, NULL, MISSING, or contains NO meaningful content:): Do NOT add any disclaimer.
                """

                no_data_response = await self.llm_client.generate_failed_text(empty_prompt)
                return no_data_response

            # 2. Xử lý trường hợp CÓ DỮ LIỆU (Success Case)
            context_str = json.dumps(context_store, indent=2, ensure_ascii=False)

            final_prompt = f"""
            You are an expert biomedical reasoning agent. Your task is to answer the user's question based ONLY on the provided JSON context.

            INPUTS:
            1. **User's Original Question:** "{original_question}" 
            (Use this to determine the **OUTPUT LANGUAGE** and **TONE**).
            2. **System Processed Query:** "{nlq}" 
            (Use this to understand the **LOGIC** and match with the Data Context).

            Data Context from Knowledge Graph:
            ```json
            {context_str}
            ```

            Instructions:
            1.  **LANGUAGE DETECTION:** Identify the language used in "User's Original Question" (Input 1).
            2.  **OUTPUT GENERATION:** Generate the entire response **IN THAT EXACT SAME LANGUAGE**.
            3.  **NATURAL REASONING (CRITICAL):** - Analyze the connection between the intermediate data (e.g., "diseases_list") and the "final_result".
                - **Weave this reasoning into a clear, natural narrative.** Explain *how* one entity leads to another based on the data.
                - **PROHIBITION:** Do NOT mention technical terms like "JSON", "keys", "dictionaries", "lists", or "variables" in your final answer. Instead, use natural phrases like "associated with", "leads to", "causes", "treats".
                - Example style (English): "The drug Aspirin is shown to treat Headache, which is why..."
                - Example style (Vietnamese): "Dựa trên dữ liệu, thuốc Aspirin được tìm thấy là có điều trị chứng Đau đầu, điều này giải thích..."
            4.  **ACCURACY:** Your explanation must *only* reflect the data connections shown in the context. Do not add external knowledge.
            5.  **DISCLAIMER:** Conclude with a disclaimer translated into the target language. 
                (English template: "Note: This information is for reference only and is not a substitute for professional medical advice, diagnosis, or treatment.")

            If the "final_result" is valid, explain the findings clearly and naturally in the target language.
            """
            
            # Gọi LLM xử lý câu trả lời chính
            final_answer = await self.llm_client.generate_text(final_prompt)
            return final_answer

        except Exception as e:
            print(f"Error when generating final answer: {e}")
            return "Đã xảy ra lỗi trong quá trình tạo câu trả lời. Vui lòng thử lại sau. (An error occurred while generating the answer.)"