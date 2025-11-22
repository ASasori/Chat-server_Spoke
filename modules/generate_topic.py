from modules.llm_client import BaseLLMClient

class TopicGenerator:
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
        1. **Language Matching (CRITICAL):** The generated topic name MUST be in the **SAME LANGUAGE** as the user's question.
        - If the user asks in Vietnamese, the topic name must be in Vietnamese.
        - If the user asks in English, the topic name must be in English.
        2. The topic name must summarize the core subject of the user’s query.
        3. Keep it concise: 3–7 words.
        4. Do NOT answer the question or provide explanations.
        5. Avoid filler words (e.g., "about", "regarding", "về việc", "câu hỏi về").
        6. Capitalize the topic name appropriately (Title Case for English, Sentence case/Proper Nouns for Vietnamese).
        7. If the question is ambiguous, choose the most likely or general topic.

        Examples:
        - User (English): "What are the symptoms of Aspirin?"
        → Topic Name: "Aspirin Side Effects"

        - User (Vietnamese): "Làm sao để tối ưu hóa hiệu suất Node.js?"
        → Topic Name: "Tối ưu hóa Node.js"

        - User (English): "Give me Git commands to create a new branch."
        → Topic Name: "Git Branch Creation"

        - User (Vietnamese): "Triệu chứng của bệnh sốt xuất huyết là gì?"
        → Topic Name: "Triệu chứng Sốt xuất huyết"

        - User (Vietnamese): "Giải thích cơ chế Attention trong mô hình Transformer."
        → Topic Name: "Cơ chế Attention Transformer"

        - User: "Why?" or "Alo"
        → Topic Name: "General Discussion" (or "Trò chuyện chung" if Vietnamese context implies)

        Return ONLY the topic name.
        """
        try:
            # Use the LLM client (which now has retry logic)
            final_topic = await self.llm_client.query_writing(final_prompt)
            return final_topic
        except Exception as e:
            print(f"Error when generating final answer: {e}")
            return "An error occurred while trying to generate the final answer."
