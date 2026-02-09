# MVP部署计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将AI视频制片链路系统部署到生产环境，使用免费托管服务

**Architecture:** 
- 前端: Vercel (Next.js/React静态托管)
- 后端: Render (Python FastAPI Web Service)
- 数据库: Supabase (PostgreSQL托管)
- 文件存储: Cloudflare R2 (可选，后续添加)

**Tech Stack:** Vercel, Render, Supabase, Git

---

## Task 1: 配置生产环境数据库 (Supabase)

**Files:**
- Create: `backend/.env.production` (本地模板，不提交到Git)
- Modify: `backend/app/core/config.py` (添加生产环境配置)

**Step 1: 创建Supabase项目**

1. 访问 https://supabase.com 并登录
2. 点击 "New Project"
3. 填写项目信息:
   - Organization: 选择或创建组织
   - Project Name: `ai-video-production`
   - Database Password: 生成强密码并保存
   - Region: 选择 `East Asia (Singapore)` 或 `Northeast Asia (Tokyo)`
4. 点击 "Create new project"
5. 等待项目创建完成 (约2分钟)

**Step 2: 获取数据库连接信息**

1. 进入项目 Dashboard
2. 点击左侧菜单 "Settings" → "Database"
3. 找到 "Connection string" 部分
4. 选择 "URI" 格式
5. 复制连接字符串，格式如下:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

**Step 3: 创建本地环境模板**

```bash
# backend/.env.production (添加到 .gitignore)
# 生产环境配置模板 - 复制为 .env.production 并填入实际值

# ==================== 基础配置 ====================
DEBUG=false
APP_NAME=AI视频制片链路系统
APP_VERSION=0.1.0

# ==================== 服务器配置 ====================
HOST=0.0.0.0
PORT=8000

# ==================== 数据库配置 (Supabase) ====================
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
DATABASE_POOL_SIZE=5
DATABASE_MAX_OVERFLOW=10

# ==================== 安全配置 ====================
# 生产环境必须修改！使用随机生成的强密钥 (openssl rand -hex 32)
SECRET_KEY=your-production-secret-key-min-32-characters-long
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
ALGORITHM=HS256

# ==================== CORS 配置 ====================
ALLOWED_ORIGINS=https://your-app.vercel.app

# ==================== AI 服务 API 配置 ====================
# 生产环境填入实际API密钥
WENXIN_API_KEY=your-wenxin-api-key
WENXIN_SECRET_KEY=your-wenxin-secret-key
QWEN_API_KEY=your-qwen-api-key
OPENAI_API_KEY=sk-your-openai-api-key
```

**Step 4: 更新 .gitignore**

```bash
# backend/.gitignore (添加)
.env.production
.env.local
```

**Step 5: 配置生产环境数据库迁移**

```bash
# 设置环境变量为生产环境
export DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# 运行迁移
cd backend
source venv/bin/activate
alembic upgrade head
```

Expected: 迁移成功执行，users表在Supabase中创建

**Step 6: Commit**

```bash
git add backend/.gitignore
git commit -m "chore: add production environment template

- Add .env.production template
- Update .gitignore for production env files
- Prepare for Supabase database setup"
```

---

## Task 2: 准备后端生产配置

**Files:**
- Create: `backend/Procfile`
- Create: `backend/render.yaml`
- Create: `backend/requirements.txt` (确保完整)
- Modify: `backend/app/core/config.py`

**Step 1: 创建Procfile**

```
# backend/Procfile
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**Step 2: 创建render.yaml**

```yaml
# backend/render.yaml
services:
  - type: web
    name: ai-video-backend
    runtime: python
    plan: free
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: DATABASE_URL
        sync: false  # 在Render Dashboard中手动设置
      - key: SECRET_KEY
        generateValue: true
      - key: DEBUG
        value: false
      - key: APP_NAME
        value: AI视频制片链路系统
      - key: APP_VERSION
        value: 0.1.0
      - key: ACCESS_TOKEN_EXPIRE_MINUTES
        value: 30
      - key: REFRESH_TOKEN_EXPIRE_DAYS
        value: 7
      - key: ALGORITHM
        value: HS256
      - key: ALLOWED_ORIGINS
        value: https://your-frontend.vercel.app  # 部署后更新为实际前端地址
      - key: PYTHON_VERSION
        value: 3.10.0
```

**Step 3: 确保requirements.txt完整**

```
# backend/requirements.txt (确认包含)
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
alembic==1.12.1
pydantic==2.5.0
pydantic-settings==2.1.0
python-jose[cryptography]==3.3.0
bcrypt==4.1.1
python-multipart==0.0.6
email-validator==2.1.0
python-dateutil==2.8.2
httpx==0.25.2
aiofiles==23.2.0
psycopg2-binary==2.9.9
```

**Step 4: 添加生产环境健康检查端点**

```python
# backend/app/main.py (添加)
@app.get("/health")
async def health_check():
    """健康检查接口"""
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "timestamp": datetime.utcnow().isoformat()
    }
```

**Step 5: Commit**

```bash
git add backend/Procfile backend/render.yaml backend/requirements.txt
git commit -m "chore: prepare backend for production deployment

- Add Procfile for Render
- Add render.yaml configuration
- Update requirements.txt with all dependencies
- Add health check endpoint"
```

---

## Task 3: 部署后端到Render

**Files:**
- 使用: GitHub仓库
- 配置: Render Dashboard

**Step 1: 推送代码到GitHub**

```bash
# 确保所有更改已提交
git status

# 推送到GitHub
git push origin main
```

**Step 2: 创建Render账户并连接GitHub**

1. 访问 https://render.com 并注册/登录
2. 点击 "New +" → "Web Service"
3. 选择 "Build and deploy from a Git repository"
4. 连接GitHub账户并授权
5. 选择 `AFM` 仓库
6. 配置服务:
   - Name: `ai-video-backend`
   - Region: `Singapore`
   - Branch: `main`
   - Root Directory: `backend`
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

**Step 3: 配置环境变量**

在Render Dashboard中设置环境变量:

```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
SECRET_KEY=(生成随机密钥: openssl rand -hex 32)
DEBUG=false
ALLOWED_ORIGINS=https://your-frontend.vercel.app  # 暂时，部署前端后更新
WENXIN_API_KEY=(可选)
WENXIN_SECRET_KEY=(可选)
QWEN_API_KEY=(可选)
OPENAI_API_KEY=(可选)
```

**Step 4: 部署服务**

1. 点击 "Create Web Service"
2. 等待构建和部署完成 (约5-10分钟)
3. 获取服务URL: `https://ai-video-backend.onrender.com`

**Step 5: 验证部署**

```bash
# 测试健康检查
curl https://ai-video-backend.onrender.com/health

# 测试API状态
curl https://ai-video-backend.onrender.com/api/v1/status

# 测试注册
curl -X POST https://ai-video-backend.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'
```

Expected: 所有端点返回正确响应

**Step 6: 运行数据库迁移**

```bash
# 在Render Shell中运行
alembic upgrade head
```

或者在本地连接生产数据库运行:
```bash
export DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
cd backend
alembic upgrade head
```

---

## Task 4: 准备前端生产配置

**Files:**
- Create: `frontend/.env.production`
- Create: `frontend/vercel.json`
- Modify: `frontend/package.json`
- Modify: `frontend/src/services/api.ts` (创建API服务)

**Step 1: 创建生产环境配置**

```bash
# frontend/.env.production
VITE_API_BASE_URL=https://ai-video-backend.onrender.com/api/v1
VITE_APP_NAME=AI视频制片链路系统
VITE_APP_VERSION=0.1.0
```

**Step 2: 创建vercel.json**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

**Step 3: 确保package.json有build脚本**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

**Step 4: 创建API服务配置**

```typescript
// frontend/src/config/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const API_ENDPOINTS = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    refresh: '/auth/refresh',
  },
  users: {
    me: '/users/me',
    update: '/users/me',
    getById: (id: number) => `/users/${id}`,
  },
};
```

**Step 5: Commit**

```bash
git add frontend/.env.production frontend/vercel.json frontend/src/config/
git commit -m "chore: prepare frontend for production deployment

- Add production environment variables
- Add vercel.json configuration
- Create API configuration
- Update .gitignore for env files"
```

---

## Task 5: 部署前端到Vercel

**Files:**
- 使用: GitHub仓库
- 配置: Vercel Dashboard

**Step 1: 推送代码到GitHub**

```bash
git push origin main
```

**Step 2: 创建Vercel账户并导入项目**

1. 访问 https://vercel.com 并注册/登录
2. 点击 "Add New..." → "Project"
3. 导入GitHub仓库 `AFM`
4. 配置项目:
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build` (默认)
   - Output Directory: `dist` (默认)

**Step 3: 配置环境变量**

在Vercel Dashboard → Project Settings → Environment Variables:

```
VITE_API_BASE_URL=https://ai-video-backend.onrender.com/api/v1
VITE_APP_NAME=AI视频制片链路系统
VITE_APP_VERSION=0.1.0
```

**Step 4: 部署**

1. 点击 "Deploy"
2. 等待构建完成 (约2-3分钟)
3. 获取域名: `https://ai-video-production.vercel.app`

**Step 5: 更新后端CORS配置**

在Render Dashboard中更新环境变量:

```
ALLOWED_ORIGINS=https://ai-video-production.vercel.app
```

然后重启后端服务。

**Step 6: 验证部署**

1. 访问前端URL: `https://ai-video-production.vercel.app`
2. 测试用户注册功能
3. 测试用户登录功能
4. 验证API调用成功

---

## Task 6: 验证部署状态

**验证清单:**

- [ ] 后端服务运行正常 (Render)
- [ ] 前端应用可访问 (Vercel)
- [ ] 数据库连接正常 (Supabase)
- [ ] 用户注册功能正常
- [ ] 用户登录功能正常
- [ ] API文档可访问 (/docs)
- [ ] CORS配置正确
- [ ] 环境变量配置正确

**测试命令:**

```bash
# 后端健康检查
curl https://ai-video-backend.onrender.com/health

# API文档
curl https://ai-video-backend.onrender.com/docs

# 用户注册
curl -X POST https://ai-video-backend.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"deploy@test.com","username":"deploytest","password":"test123"}'

# 前端访问
open https://ai-video-production.vercel.app
```

---

## Summary

**部署架构:**
```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Vercel        │      │   Render         │      │   Supabase      │
│   (Frontend)    │◄────►│   (Backend)      │◄────►│   (Database)    │
│                 │      │                  │      │                 │
│ React + Vite    │      │ FastAPI          │      │ PostgreSQL      │
│ Static Hosting  │      │ Web Service      │      │ Managed DB      │
└─────────────────┘      └──────────────────┘      └─────────────────┘
       │                          │
       │                          │
       ▼                          ▼
https://ai-video-      https://ai-video-backend
production.vercel.app  .onrender.com
```

**成本:**
- Vercel: 免费 (Hobby计划)
- Render: 免费 (Web Service)
- Supabase: 免费 (500MB数据库)

**下一步:**
- 配置自定义域名 (可选)
- 添加Cloudflare R2文件存储
- 配置CDN加速
- 设置监控和日志
