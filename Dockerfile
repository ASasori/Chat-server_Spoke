# Sử dụng image node 18-alpine nhẹ
FROM node:18-alpine
WORKDIR /usr/src/app

# Copy file package và cài đặt CHỈ dependencies cho production
# (axios, cors, dotenv, express, mongoose)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy toàn bộ source code (thư mục src, v.v.)
COPY . .

# Mở port mà server đang chạy
EXPOSE 3000

# Chạy server trực tiếp bằng node
# KHÔNG dùng "npm start" vì nó gọi nodemon
CMD ["node", "src/server.js"]