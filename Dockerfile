# Sử dụng image node 18-alpine nhẹ
FROM node:18-alpine
WORKDIR /usr/src/app

# Copy file package và cài đặt CHỈ dependencies cho production
# (axios, cors, dotenv, express, mongoose)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy toàn bộ source code của bạn (thư mục src, v.v.)
COPY . .

# ⚠️ QUAN TRỌNG: Mở port mà server của bạn đang chạy
# Mở src/server.js và kiểm tra (ví dụ: process.env.PORT || 3000)
# Ở đây tôi đoán là port 3000, hãy sửa nếu cần.
EXPOSE 3000

# Chạy server trực tiếp bằng node
# Chúng ta KHÔNG dùng "npm start" vì nó gọi nodemon
CMD ["node", "src/server.js"]