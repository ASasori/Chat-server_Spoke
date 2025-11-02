# llm_client.py

import json
import time
import threading
import re 
from abc import ABC, abstractmethod
from typing import Any, List
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted

class BaseLLMClient(ABC):
    """
    Abstract interface for an LLM Client.
    Any client (OpenAI, Gemini, etc.) should inherit
    from this and implement the generate() methods.
    """

    @abstractmethod
    def generate(self, prompt: str) -> str:
        """
        Takes a full prompt string and returns a raw JSON string from the LLM.
        """
        pass

    @abstractmethod
    def generate_text(self, prompt: str) -> str:
        """
        Takes a full prompt string and returns a plain text answer.
        """
        pass

class GeminiLLMClient(BaseLLMClient):
    """
    Implementation of the BaseLLMClient using the Google Gemini API.
    Includes *proactive rate limiting* and *smart reactive retry logic*.
    """

    def __init__(
        self, 
        api_key: str, 
        max_retries: int = 2, 
        rpm_limit: int = 2
    ):
        self.api_key = api_key
        genai.configure(api_key=api_key)
        
        self.model_json = genai.GenerativeModel("gemini-2.5-pro") 
        self.model_text = genai.GenerativeModel("gemini-2.5-pro")
        
        self.max_retries = max_retries
        
        self.rpm_limit = rpm_limit
        self.request_timestamps: List[float] = [] 
        self.lock = threading.Lock()
        
        print(f"Initialized GeminiLLMClient.")


    def _wait_for_rate_limit(self):
        """
        Hàm chờ chủ động để không vi phạm RPM limit.
        """
        with self.lock:
            now = time.time()
            # 1. Xoá các timestamp cũ (hơn 60 giây trước)
            self.request_timestamps = [t for t in self.request_timestamps if now - t < 60]

            # 2. Vòng lặp: Kiểm tra xem có cần chờ không
            while len(self.request_timestamps) >= self.rpm_limit:
                oldest_request_time = self.request_timestamps[0]
                
                # 3. Tính thời gian cần chờ
                wait_duration = (oldest_request_time + 60.1) - now
                
                if wait_duration > 0:
                    print(f"Proactive rate limit: {len(self.request_timestamps)} requests in last 60s. "
                          f"Waiting for {wait_duration:.2f}s...")
                    time.sleep(wait_duration) # Chờ
                
                # 4. Cập nhật lại thời gian và danh sách
                now = time.time()
                self.request_timestamps = [t for t in self.request_timestamps if now - t < 60]

            # 5. Ghi lại mốc thời gian của yêu cầu *sắp* được thực hiện
            self.request_timestamps.append(time.time())

    
    async def _generate_with_retry(self, model: Any, prompt: str, is_json: bool) -> str:
        """
        CẬP NHẬT: Internal method to handle generation with *smart* reactive retry.
        """
        retries = 0
        # Bỏ 'backoff_time = 5', chúng ta sẽ lấy thời gian từ lỗi.
        
        gen_config = {
            "temperature": 0,
        }
        if is_json:
            gen_config["response_mime_type"] = "application/json"

        while retries < self.max_retries:
            try:
                response = model.generate_content(
                    prompt,
                    generation_config=gen_config
                )
                return response.text.strip()
            
            except ResourceExhausted as e:
                retries += 1
                if retries >= self.max_retries:
                    print(f"Error: Max retries ({self.max_retries}) reached. API rate limit exceeded.")
                    raise e
                
                # --- LOGIC MỚI: Đọc thời gian chờ từ thông báo lỗi ---
                error_message = str(e)
                # Dùng regex để tìm chuỗi "Please retry in X.Ys"
                match = re.search(r"Please retry in (\d+\.?\d*)s", error_message)
                
                # Đặt thời gian chờ mặc định (ví dụ 15s) nếu không tìm thấy
                wait_time = 15.0 
                
                if match:
                    try:
                        # Lấy số giây từ lỗi và cộng thêm 0.5s "cho chắc"
                        wait_time = float(match.group(1)) + 0.5 
                    except (ValueError, IndexError):
                        pass # Nếu thất bại, dùng 15s mặc định

                print(f"Warning: Reactive retry (attempt {retries}/{self.max_retries}). "
                      f"API requested retry in {wait_time:.2f}s...")
                time.sleep(wait_time)
                # --- KẾT THÚC LOGIC MỚI ---
            
            except Exception as e:
                print(f"Error: An unexpected error occurred calling Gemini: {e}")
                raise e

        return '{"error": "Gemini API call failed after retries"}' if is_json else "Error: Gemini call failed"


    async def generate(self, prompt: str) -> str:
        """
        Generates a JSON response with retry logic.
        """
        # LUÔN CHỜ TRƯỚC KHI GỌI
        self._wait_for_rate_limit()
        
        print(f"[LLM_JSON_INPUT] (Length: {len(prompt)} chars)")
        try:
            raw_json_string = await self._generate_with_retry(self.model_json, prompt, is_json=True)
            
            # Basic validation that it is JSON
            try:
                json.loads(raw_json_string)
            except json.JSONDecodeError:
                print("Warning: Gemini returned non-JSON, wrapping it.")
                raw_json_string = json.dumps({"output": raw_json_string})
            
            return raw_json_string

        except Exception as e:
            print(f"Error in generate(): {e}")
            return '{"error": "Gemini API call failed"}'
        
    async def generate_text(self, prompt: str) -> str:
        """
        Generates a plain text response with retry logic.
        """
        # LUÔN CHỜ TRƯỚC KHI GỌI
        self._wait_for_rate_limit()
        
        print(f"[LLM_TEXT_INPUT] (Length: {len(prompt)} chars)")
        try:
            return await self._generate_with_retry(self.model_text, prompt, is_json=False)
        except Exception as e:
            print(f"Error in generate_text(): {e}")
            return "An error occurred while trying to generate a response."