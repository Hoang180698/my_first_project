# Sử dụng image Node.js LTS làm base
FROM node:18-alpine as build

# ARG VITE_API_URL
# ENV VITE_API_URL $VITE_API_URL

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy file package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn của ứng dụng vào container
COPY . .

# Build ứng dụng với Vite
RUN npm run build

# Sử dụng một image nhẹ hơn để phục vụ các file tĩnh
FROM nginx:alpine

# Copy các file build từ bước trước vào thư mục phục vụ của Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy file cấu hình nginx tùy chỉnh nếu cần (không bắt buộc)
COPY nginx.conf /etc/nginx/nginx.conf


# Expose cổng mà Nginx sẽ chạy
EXPOSE 80

# Khởi chạy Nginx
CMD ["nginx", "-g", "daemon off;"]