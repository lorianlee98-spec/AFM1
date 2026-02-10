# 🚀 CI/CD 自动部署指南

本文档指导你如何设置 GitHub 更新后自动推送到 Vercel（前端）、Render 和 Railway（后端）。

## 📋 目录

1. [架构概览](#架构概览)
2. [前置条件](#前置条件)
3. [部署平台选择](#部署平台选择)
4. [详细部署步骤](#详细部署步骤)
5. [GitHub Secrets 配置](#github-secrets-配置)
6. [验证部署](#验证部署)
7. [故障排除](#故障排除)

---

## 🏗️ 架构概览

```
GitHub Repository
       │
       ├── Push to main ──┬──► Vercel (前端自动部署)
       │                  │
       ├── Push to main ──┼──► Render (后端自动部署)
       │                  │
       └── Push to main ──┴──► Railway (后端自动部署)
```

### 部署配置文件

| 文件 | 用途 |
|------|------|
| `vercel.json` | Vercel 前端部署配置 |
| `render.yaml` | Render 后端部署配置 |
| `railway.toml` | Railway 后端部署配置 |
| `Dockerfile` | Docker 容器配置（后端） |
| `.github/workflows/` | GitHub Actions CI/CD 工作流 |

---

## ✅ 前置条件

1. **GitHub 账号** - 代码仓库托管
2. **Vercel 账号** - 前端部署 (https://vercel.com)
3. **Render 或 Railway 账号** - 后端部署
   - Render: https://render.com
   - Railway: https://railway.app
4. **PostgreSQL 数据库** - Supabase 或其他 PostgreSQL 服务
5. **Redis 缓存** (可选) - 用于 Refresh Token 白名单

---

## 🎯 部署平台选择

### 前端：Vercel（推荐）
- ✅ 与 GitHub 集成最完善
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 免费额度充足

### 后端：Render vs Railway

| 特性 | Render | Railway |
|------|--------|---------|
| 免费额度 | 750小时/月 | 500小时/月 |
| 自动休眠 | 15分钟无访问休眠 | 无访问休眠 |
| 数据库 | 需外部提供 | 内置 PostgreSQL |
| 部署速度 | 较慢 | 较快 |
| 推荐场景 | 生产环境 | 开发测试 |

**建议**：生产环境使用 Render，开发测试使用 Railway。

---

## 📖 详细部署步骤

### 第一步：准备 GitHub 仓库

1. 确保代码已推送到 GitHub
2. 确认以下文件已提交：
   ```
   vercel.json
   render.yaml
   railway.toml
   Dockerfile
   .github/workflows/
   ```

### 第二步：部署前端到 Vercel

#### 2.1 注册并登录 Vercel
1. 访问 https://vercel.com
2. 使用 GitHub 账号登录
3. 点击 "Add New Project"

#### 2.2 导入项目
1. 选择你的 GitHub 仓库
2. Vercel 会自动检测到 `vercel.json` 配置

#### 2.3 配置项目
1. **Framework Preset**: 选择 "Vite"
2. **Root Directory**: 选择 `frontend`
3. **Build Command**: `npm run build`（自动读取 vercel.json）
4. **Output Directory**: `dist`

#### 2.4 设置环境变量
在 Vercel Dashboard → Project Settings → Environment Variables 中添加：

```
VITE_API_BASE_URL=https://your-backend-url.com/api/v1
```

#### 2.5 部署
点击 "Deploy"，等待部署完成。

#### 2.6 获取 Vercel Token（用于 GitHub Actions）
1. 访问 https://vercel.com/account/tokens
2. 点击 "Create Token"
3. 复制 Token 值
4. 保存到 GitHub Secrets（见下文）

### 第三步：部署后端到 Render

#### 3.1 注册并登录 Render
1. 访问 https://render.com
2. 使用 GitHub 账号登录

#### 3.2 创建 Web Service
1. 点击 "New" → "Web Service"
2. 选择你的 GitHub 仓库
3. Render 会自动读取 `render.yaml` 配置

#### 3.3 配置环境变量
在 Render Dashboard → Service → Environment 中添加：

**必需变量：**
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
SECRET_KEY=your-32-char-secret-key
```

**可选变量：**
```
REDIS_URL=redis://user:password@host:6379/0
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

#### 3.4 获取 Render API Key（用于 GitHub Actions）
1. 访问 https://dashboard.render.com/account/api-keys
2. 点击 "Create API Key"
3. 复制 Key 值
4. 保存到 GitHub Secrets

#### 3.5 获取 Service ID
1. 打开你的 Render Service 页面
2. URL 格式：`https://dashboard.render.com/web/srv-xxxxx`
3. `srv-xxxxx` 就是 Service ID
4. 保存到 GitHub Secrets

### 第四步：部署后端到 Railway（可选）

#### 4.1 注册并登录 Railway
1. 访问 https://railway.app
2. 使用 GitHub 账号登录

#### 4.2 创建项目
1. 点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 选择你的仓库

#### 4.3 配置环境变量
在 Railway Dashboard → Variables 中添加：

```
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key
PORT=8000
```

#### 4.4 获取 Railway Token（用于 GitHub Actions）
1. 访问 https://railway.app/account/tokens
2. 点击 "Create Token"
3. 复制 Token 值
4. 保存到 GitHub Secrets

---

## 🔐 GitHub Secrets 配置

### 5.1 打开 GitHub Secrets 页面
1. 进入 GitHub 仓库
2. 点击 Settings → Secrets and variables → Actions
3. 点击 "New repository secret"

### 5.2 添加 Secrets

#### Vercel 部署所需：
```
VERCEL_TOKEN=你的 Vercel Token
VERCEL_ORG_ID=你的 Vercel 组织 ID
VERCEL_PROJECT_ID=你的 Vercel 项目 ID
API_BASE_URL=后端 API 地址
```

**获取 ORG_ID 和 PROJECT_ID：**
1. 在项目根目录运行：
   ```bash
   npx vercel link
   ```
2. 完成后查看 `.vercel/project.json`：
   ```json
   {
     "orgId": "team_xxxxx",
     "projectId": "prj_xxxxx"
   }
   ```

#### Render 部署所需：
```
RENDER_API_KEY=你的 Render API Key
RENDER_SERVICE_ID=你的 Render Service ID
```

#### Railway 部署所需：
```
RAILWAY_TOKEN=你的 Railway Token
```

---

## ✔️ 验证部署

### 6.1 触发自动部署
1. 修改 `frontend/src/App.tsx` 中的某个文字
2. 提交并推送到 main 分支：
   ```bash
   git add .
   git commit -m "test: 验证自动部署"
   git push origin main
   ```
3. 查看 GitHub Actions 运行状态：
   - 仓库页面 → Actions 标签

### 6.2 检查部署状态

#### Vercel
- 访问 Vercel Dashboard
- 查看 Deployment 列表
- 确认最新提交已部署

#### Render
- 访问 Render Dashboard
- 查看 Service Logs
- 确认部署成功

#### Railway
- 访问 Railway Dashboard
- 查看 Deployments
- 确认状态为 "Success"

### 6.3 验证功能
1. 访问前端 URL（Vercel 提供）
2. 测试登录功能
3. 测试 API 调用

---

## 🐛 故障排除

### 问题 1：Vercel 部署失败

**症状：** Build 失败

**解决方案：**
1. 检查 `vercel.json` 配置
2. 确认 `frontend/package.json` 中的 build 脚本正确
3. 查看 Vercel Build Logs

### 问题 2：Render 部署失败

**症状：** Service 启动失败

**解决方案：**
1. 检查 Dockerfile 是否正确
2. 确认环境变量已设置
3. 查看 Render Logs：
   ```
   Dashboard → Service → Logs
   ```

### 问题 3：GitHub Actions 失败

**症状：** Workflow 运行失败

**解决方案：**
1. 检查 GitHub Secrets 是否已正确设置
2. 查看 Actions 日志：
   ```
   仓库页面 → Actions → 失败的 Workflow
   ```
3. 常见错误：
   - `VERCEL_TOKEN` 无效 → 重新生成 Token
   - `RENDER_SERVICE_ID` 错误 → 确认格式为 `srv-xxxxx`

### 问题 4：前端无法连接后端

**症状：** API 请求失败

**解决方案：**
1. 检查 `VITE_API_BASE_URL` 是否正确
2. 确认后端 CORS 设置允许前端域名
3. 检查后端是否正常运行

### 问题 5：数据库连接失败

**症状：** 后端启动失败，数据库错误

**解决方案：**
1. 确认 `DATABASE_URL` 格式正确：
   ```
   postgresql://user:password@host:5432/dbname
   ```
2. 检查数据库是否允许外部连接
3. 确认 SSL 设置（部分服务需要）

---

## 📚 参考资源

- [Vercel 文档](https://vercel.com/docs)
- [Render 文档](https://render.com/docs)
- [Railway 文档](https://docs.railway.app)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

---

## 🎉 完成！

现在每次你推送代码到 main 分支，系统会自动：
1. 运行代码检查和测试
2. 自动部署前端到 Vercel
3. 自动部署后端到 Render/Railway

只需专注于开发，部署完全自动化！
