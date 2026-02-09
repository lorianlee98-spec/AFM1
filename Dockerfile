# 使用 Python 3.11 官方镜像
FROM python:3.11-slim

# 设置工作目录
WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# 复制 requirements
COPY requirements.txt .

# 安装 Python 依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY backend/ ./backend/

# 设置环境变量
ENV PYTHONPATH=/app/backend
ENV PORT=8000

# 暴露端口
EXPOSE 8000

# 启动命令
CMD cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
