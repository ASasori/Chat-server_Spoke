# Sử dụng Python 3.11
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Cài đặt dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ project vào container
COPY . .

# Expose port
EXPOSE 8001

# Chạy app (Đã bỏ --reload để chạy mode production)
CMD ["uvicorn", "server_ai_main:app", "--host", "0.0.0.0", "--port", "8001"]