# 部署状态文档

**文档日期**: 2026-02-09  
**最后更新**: 2026-02-09

---

## 实际部署配置

### 部署架构

| 服务 | 平台 | 实际URL | 状态 |
|------|------|---------|------|
| **前端** | Vercel | https://afm-1.vercel.app | ✅ 运行中 |
| **后端** | Render | https://afm-5fof.onrender.com | ✅ 运行中 |
| **数据库** | Railway | PostgreSQL | ✅ 已连接 |
| **API文档** | Render | https://afm-5fof.onrender.com/docs | ✅ 可访问 |

---

## 部署变更记录

### 原计划 vs 实际部署

| 组件 | 原计划 | 实际使用 | 变更原因 |
|------|--------|----------|----------|
| 数据库 | Supabase | Railway | 连接更简单，无需额外配置 |
| 后端部署 | Python Runtime | Docker | 解决依赖兼容性问题 |

---

## 环境变量配置

### 后端环境变量 (Render)

```bash
DATABASE_URL=postgresql://postgres:PCqIbGjKFKIqVVDJuMflzIGYOPFejNBD@yamabiko.proxy.rlwy.net:39034/railway
SECRET_KEY=56eb8a24cab576c122cf02b1f9f9f55c74416aaf01d27125228b850b46e2ebe4
DEBUG=false
ALLOWED_ORIGINS=*
```

### 前端环境变量 (Vercel)

```bash
VITE_API_BASE_URL=https://afm-5fof.onrender.com/api/v1
```

---

## 部署文件清单

### 后端部署文件

| 文件 | 用途 | 位置 |
|------|------|------|
| `Dockerfile` | Docker构建配置 | 根目录 |
| `render.yaml` | Render服务配置 | 根目录 |
| `requirements.txt` | Python依赖 | 根目录 + backend/ |

### 前端部署文件

| 文件 | 用途 | 位置 |
|------|------|------|
| `vercel.json` | Vercel构建配置 | 根目录 |
| `.env.production` | 生产环境变量 | frontend/ |

---

## 健康检查端点

### 后端健康检查

```bash
curl https://afm-5fof.onrender.com/health
```

预期响应:
```json
{
  "status": "healthy",
  "version": "0.1.0"
}
```

### API文档

```
https://afm-5fof.onrender.com/docs
```

---

## 已知问题

### 后端

1. **JWT弃用方法** - `datetime.utcnow()` 已弃用
   - 影响: 低
   - 计划修复: 2周内

2. **刷新令牌传递方式** - 作为URL参数传递
   - 影响: 中
   - 计划修复: 2周内

### 前端

1. **路由系统缺失** - 无react-router实现
   - 影响: 高
   - 计划修复: 立即

2. **登录页面缺失** - 用户无法认证
   - 影响: 高
   - 计划修复: 立即

---

## 部署历史

| 日期 | 事件 | 备注 |
|------|------|------|
| 2026-02-09 | 后端部署到Render | 使用Docker部署 |
| 2026-02-09 | 前端部署到Vercel | 使用Vite构建 |
| 2026-02-09 | 数据库迁移完成 | Railway PostgreSQL |

---

## 维护指南

### 重新部署后端

1. 推送代码到GitHub
2. Render自动检测并重新部署
3. 或使用 "Manual Deploy" → "Deploy latest commit"

### 重新部署前端

1. 推送代码到GitHub
2. Vercel自动检测并重新部署
3. 或使用 "Redeploy" 按钮

### 数据库备份

Railway自动提供数据库备份，可在Dashboard中查看。

---

## 联系信息

- **GitHub仓库**: https://github.com/lorianlee98-spec/AFM1
- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Railway Dashboard**: https://railway.app/dashboard

---

**文档结束**
