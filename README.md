# AI视频制片链路系统 (AI Video Production Pipeline)

## 项目简介

AI视频制片链路系统是一个端到端的AI驱动视频制作平台，帮助用户通过简单的文字描述快速生成专业级视频内容。

### 核心功能

1. **剧本创作** - 基于AI生成标准格式剧本
2. **分镜制作** - 自动生成视觉化分镜图
3. **人设制作** - 创建一致性的角色形象
4. **音频生成** - 生成旁白和配乐
5. **视频生成** - 基于分镜生成视频片段
6. **成片输出** - 导出到剪映进行后期制作

## 技术架构

### 前端
- **框架**: React 18 + TypeScript
- **UI库**: Ant Design
- **构建工具**: Vite
- **状态管理**: Zustand
- **部署**: Vercel

### 后端
- **语言**: Python 3.11
- **框架**: FastAPI
- **数据库**: PostgreSQL (Supabase)
- **缓存**: Redis (可选)
- **部署**: Render

### 文件存储
- **对象存储**: Cloudflare R2

## 项目结构

```
ai-video-platform/
├── frontend/          # 前端应用 (React + TypeScript)
│   ├── src/
│   │   ├── components/  # 组件
│   │   ├── pages/       # 页面
│   │   ├── hooks/       # 自定义Hooks
│   │   ├── utils/       # 工具函数
│   │   ├── types/       # TypeScript类型
│   │   └── api/         # API客户端
│   └── package.json
├── backend/           # 后端服务 (FastAPI)
│   ├── app/
│   │   ├── api/         # API路由
│   │   ├── core/        # 核心配置
│   │   ├── models/      # 数据模型
│   │   ├── services/    # 业务服务
│   │   └── utils/       # 工具函数
│   ├── tests/           # 测试
│   └── requirements.txt
├── shared/            # 共享代码
│   ├── types/           # 共享类型
│   └── constants/       # 共享常量
└── doc/               # 文档
```

## 快速开始

### 环境要求
- Node.js 18+
- Python 3.11+
- Git

### 前端开发

```bash
cd frontend
npm install
npm run dev
```

### 后端开发

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 部署

### 免费部署方案

本项目支持全免费部署：

- **前端**: Vercel (免费)
- **后端**: Render (免费)
- **数据库**: Supabase (免费)
- **存储**: Cloudflare R2 (免费)

详见 [部署策略文档](./doc/Deployment_Strategy_Updated.md)

## 开发计划

### 阶段一: MVP (1-3个月)
- [ ] 用户系统
- [ ] 剧本创作模块
- [ ] 分镜制作模块
- [ ] 人设制作模块
- [ ] 视频生成模块
- [ ] 剪映导出功能

### 阶段二: 优化 (4-6个月)
- [ ] 性能优化
- [ ] 用户体验改进
- [ ] 批量生成功能
- [ ] 团队协作功能

### 阶段三: 商业化 (7-12个月)
- [ ] 付费系统
- [ ] 高级功能
- [ ] 企业版
- [ ] 生态系统

## 文档

- [产品需求文档 (PRD)](./doc/PRD_AI_Video_Production_Platform.md)
- [技术架构设计](./doc/Technical_Architecture_Design.md)
- [部署策略文档](./doc/Deployment_Strategy_Updated.md)
- [可实施性评估](./doc/Implementation_Feasibility_Assessment.md)

## 贡献

欢迎提交Issue和Pull Request。

## 许可证

MIT License

## 联系方式

- 项目主页: [待添加]
- 问题反馈: [待添加]
- 邮箱: [待添加]

---

**最后更新**: 2026-02-09  
**版本**: 0.1.0 (开发中)
