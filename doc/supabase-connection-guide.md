# Supabase 连接字符串查找指南

## 方法1: 通过 Dashboard 查找（推荐）

1. **登录 Supabase**
   - 访问 https://app.supabase.com
   - 登录您的账户

2. **进入项目**
   - 点击您的项目 `ai-video-production`

3. **找到连接字符串**
   - 点击左侧菜单 **"Project Settings"**（项目设置）
   - 在左侧子菜单中点击 **"Database"**（数据库）
   - 向下滚动找到 **"Connection string"**（连接字符串）部分
   - 选择 **"URI"** 标签
   - 点击 **"Copy"** 按钮复制

4. **连接字符串格式**
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

## 方法2: 通过连接信息手动构建

如果您找不到URI格式的连接字符串，可以手动构建：

### 需要的信息：

1. **Host**（主机）
   - 位置: Dashboard → Database → Connection Info
   - 格式: `db.xxxxxxxxxxxxxxxxxxxx.supabase.co`

2. **Port**（端口）
   - 默认: `5432`

3. **Database**（数据库名）
   - 默认: `postgres`

4. **User**（用户名）
   - 默认: `postgres`

5. **Password**（密码）
   - 这是您创建项目时设置的密码
   - 如果忘记，可以在 Dashboard → Database → Reset password 重置

### 手动构建连接字符串：

```
postgresql://postgres:您的密码@db.xxxxxxxxxxxxxxxxxxxx.supabase.co:5432/postgres
```

## 方法3: 快速查找（截图指引）

```
Supabase Dashboard
├── 左侧菜单
│   ├── Home
│   ├── Table Editor
│   ├── SQL Editor
│   ├── ⚙️ Project Settings  ← 点击这里
│   │   ├── General
│   │   ├── Database         ← 然后点击这里
│   │   ├── API
│   │   └── ...
│   └── ...
└── ...
```

在 Database 页面中，找到：
- **Connection Info** 部分
- 或 **Connection string** 部分

## 常见问题

### Q1: 找不到 Database 菜单？
**A**: 确保您在 Project Settings 下查看，不是在主菜单中。

### Q2: 密码忘记了怎么办？
**A**: 
1. Dashboard → Database
2. 找到 "Reset database password"
3. 点击 "Reset password"
4. 保存新密码

### Q3: 连接字符串中的 [YOUR-PASSWORD] 需要替换吗？
**A**: 是的！将 `[YOUR-PASSWORD]` 替换为您的实际密码。例如：
```
# 错误 ❌
postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres

# 正确 ✅
postgresql://postgres:myActualPassword123@db.xxx.supabase.co:5432/postgres
```

## 下一步

获取连接字符串后：

1. 复制 `backend/.env.production.template` 为 `backend/.env.production`
2. 将连接字符串填入 `DATABASE_URL`
3. 生成 `SECRET_KEY`: 
   ```bash
   openssl rand -hex 32
   ```
4. 运行数据库迁移：
   ```bash
   cd backend
   export DATABASE_URL="您的连接字符串"
   alembic upgrade head
   ```

## 需要帮助？

如果还是找不到，请告诉我：
1. 您在 Supabase Dashboard 中看到了哪些菜单选项？
2. 您创建项目时设置的密码还记得吗？

我可以进一步帮您定位问题。
