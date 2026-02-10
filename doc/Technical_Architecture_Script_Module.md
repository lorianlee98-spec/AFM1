# 剧本创作模块技术架构设计

## 1. 模块概述

剧本创作模块是AI视频制片链路系统的核心功能模块之一，负责用户剧本的创建、编辑、管理和AI辅助生成。该模块集成了Prompt优化引擎，为用户提供智能的提示词优化和内容优化建议，帮助用户快速生成高质量的剧本内容。

## 2. 技术架构

### 2.1 前端架构

**技术栈：**
- React 18 + TypeScript
- Framer Motion (动画效果)
- Lucide React (图标库)
- Axios (HTTP客户端)

**核心组件：**
- `ScriptCreation` - 剧本创作主页面组件
- `scriptApi` - API客户端服务

**状态管理：**
- React Hooks (useState, useEffect, useRef)

**数据流向：**
1. 用户输入 → 前端状态
2. 前端状态 → API调用
3. API响应 → 前端状态更新
4. 前端状态 → UI渲染

### 2.2 后端架构

**技术栈：**
- Python 3.11
- FastAPI
- SQLAlchemy
- PostgreSQL (Supabase)

**核心模块：**
- `scripts.py` - 剧本相关API端点
- `script.py` (CRUD) - 剧本数据操作
- `script.py` (models) - 剧本数据模型
- `script.py` (schemas) - 剧本数据验证

**数据流向：**
1. API请求 → 数据验证
2. 数据验证 → 业务逻辑处理
3. 业务逻辑 → 数据库操作
4. 数据库操作 → API响应

### 2.3 Prompt优化引擎

**架构设计：**
- 前端组件：提供用户交互界面
- 后端API：提供优化算法实现
- 本地降级：当API不可用时使用本地算法

**核心功能：**
1. 提示词优化：分析用户输入的提示词，生成更详细、更有效的优化建议
2. 内容优化：分析剧本内容，提供结构、对话、描述、角色等方面的优化建议

## 3. 目录结构

### 3.1 前端结构

```
frontend/
├── src/
│   ├── pages/
│   │   └── ScriptCreation.tsx     # 剧本创作页面
│   ├── services/
│   │   └── scriptApi.ts           # API客户端服务
│   ├── styles/
│   │   ├── theme.css              # 主题样式
│   │   └── components.css         # 组件样式
│   ├── App.tsx                    # 应用入口
│   └── main.tsx                   # 主渲染文件
```

### 3.2 后端结构

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       └── endpoints/
│   │           └── scripts.py     # 剧本API端点
│   ├── crud/
│   │   └── script.py              # 剧本数据操作
│   ├── models/
│   │   └── script.py              # 剧本数据模型
│   ├── schemas/
│   │   └── script.py              # 剧本数据验证
│   └── main.py                    # 应用入口
```

## 4. API接口设计

### 4.1 剧本管理接口

#### 4.1.1 获取所有剧本
- **Endpoint:** `GET /api/v1/scripts/`
- **Auth:** Bearer Token
- **Response:** `List[ScriptResponse]`

#### 4.1.2 创建剧本
- **Endpoint:** `POST /api/v1/scripts/`
- **Auth:** Bearer Token
- **Request Body:** `ScriptCreate`
- **Response:** `ScriptResponse`

#### 4.1.3 获取单个剧本
- **Endpoint:** `GET /api/v1/scripts/{script_id}`
- **Auth:** Bearer Token
- **Response:** `ScriptResponse`

#### 4.1.4 更新剧本
- **Endpoint:** `PUT /api/v1/scripts/{script_id}`
- **Auth:** Bearer Token
- **Request Body:** `ScriptUpdate`
- **Response:** `ScriptResponse`

#### 4.1.5 删除剧本
- **Endpoint:** `DELETE /api/v1/scripts/{script_id}`
- **Auth:** Bearer Token
- **Response:** `ScriptResponse`

#### 4.1.6 更新剧本内容
- **Endpoint:** `PATCH /api/v1/scripts/{script_id}/content`
- **Auth:** Bearer Token
- **Request Body:** `{"content": string}`
- **Response:** `ScriptResponse`

### 4.2 Prompt优化引擎接口

#### 4.2.1 优化提示词
- **Endpoint:** `POST /api/v1/scripts/optimize/prompt`
- **Auth:** Bearer Token
- **Request Body:** `{"prompt": string}`
- **Response:** `{"suggestions": string[]}`

#### 4.2.2 优化剧本内容
- **Endpoint:** `POST /api/v1/scripts/optimize/content`
- **Auth:** Bearer Token
- **Request Body:** `{"content": string, "script_id": number}`
- **Response:** `{"suggestions": OptimizationSuggestion[]}`

### 4.3 数据模型

#### 4.3.1 ScriptCreate
```typescript
interface ScriptCreate {
  title: string
  description?: string
  content?: string
  genre?: string
  target_audience?: string
  duration?: number
  status?: string
}
```

#### 4.3.2 ScriptUpdate
```typescript
interface ScriptUpdate {
  title?: string
  description?: string
  content?: string
  genre?: string
  target_audience?: string
  duration?: number
  status?: string
}
```

#### 4.3.3 ScriptResponse
```typescript
interface Script {
  id: number
  title: string
  description: string | null
  content: string | null
  genre: string | null
  target_audience: string | null
  duration: number
  status: string
  user_id: number
  created_at: string
  updated_at: string | null
}
```

#### 4.3.4 OptimizationSuggestion
```typescript
interface OptimizationSuggestion {
  type: 'structure' | 'dialogue' | 'description' | 'character'
  title: string
  description: string
  suggestion: string
}
```

## 5. 核心功能实现

### 5.1 剧本管理功能

**功能描述：**
- 创建新剧本项目
- 管理剧本列表（重命名、删除）
- 编辑剧本内容
- 自动保存功能
- 导出剧本

**实现细节：**
- 使用React的useState管理前端状态
- 使用Axios调用后端API
- 实现本地存储作为API不可用时的降级方案
- 使用Framer Motion实现流畅的动画效果

### 5.2 AI辅助生成功能

**功能描述：**
- 基于用户提示词生成剧本
- 模拟AI生成过程的加载动画
- 生成后自动分析并提供优化建议

**实现细节：**
- 使用setTimeout模拟AI生成过程
- 生成后自动调用内容优化API
- 提供直观的加载状态反馈

### 5.3 Prompt优化引擎

**功能描述：**
- 分析用户输入的提示词
- 生成5种不同维度的优化建议
- 用户可以一键应用优化建议

**实现细节：**
- 前端调用`scriptApi.optimizePrompt`方法
- 后端实现提示词优化算法
- 提供本地降级方案

### 5.4 内容优化功能

**功能描述：**
- 分析剧本内容的结构、对话、描述、角色等方面
- 生成针对性的优化建议
- 用户可以一键应用优化建议

**实现细节：**
- 前端调用`scriptApi.optimizeContent`方法
- 后端实现内容分析和优化算法
- 使用正则表达式进行内容分析
- 提供本地降级方案

## 6. 技术亮点

### 6.1 前后端分离架构
- 清晰的职责分离
- 独立的开发和部署
- 更好的扩展性

### 6.2 优雅的降级策略
- API不可用时自动切换到本地存储
- 保持功能的连续性
- 提升用户体验

### 6.3 智能的Prompt优化引擎
- 多维度的优化建议
- 实时的用户反馈
- 一键应用优化建议

### 6.4 流畅的用户体验
- 响应式设计
- 流畅的动画效果
- 直观的状态反馈
- 自动保存功能

### 6.5 安全的认证机制
- JWT令牌认证
- 权限验证
- 错误处理

## 7. 性能优化

### 7.1 前端优化
- 使用React.memo优化组件渲染
- 使用useCallback和useMemo缓存函数和计算结果
- 防抖处理用户输入
- 懒加载非关键资源

### 7.2 后端优化
- 使用FastAPI的异步特性
- 数据库查询优化
- 缓存频繁访问的数据
- 合理的错误处理

### 7.3 网络优化
- 使用HTTP/2
- 压缩API响应
- 合理的缓存策略
- 批量请求减少网络开销

## 8. 部署策略

### 8.1 前端部署
- Vercel平台
- 自动CI/CD集成
- 环境变量配置

### 8.2 后端部署
- Render平台
- PostgreSQL数据库（Supabase）
- 环境变量配置

### 8.3 扩展性考虑
- 模块化设计
- 微服务架构
- 容器化部署
- 水平扩展能力

## 9. 开发最佳实践

### 9.1 代码规范
- TypeScript类型定义
- 清晰的命名规范
- 合理的代码结构
- 详细的注释

### 9.2 测试策略
- 单元测试
- 集成测试
- 端到端测试
- 性能测试

### 9.3 版本控制
- Git工作流程
- Conventional Commits规范
- 分支管理策略
- 代码审查流程

### 9.4 文档管理
- 技术架构文档
- API文档
- 开发指南
- 用户手册

## 10. 未来规划

### 10.1 功能扩展
- 支持更多剧本格式
- 集成更多AI模型
- 添加团队协作功能
- 提供剧本模板库

### 10.2 技术升级
- 迁移到React Server Components
- 使用GraphQL API
- 集成向量数据库
- 实现边缘计算

### 10.3 性能提升
- 优化AI生成速度
- 提升内容分析准确性
- 改进用户界面响应速度
- 减少API调用延迟

## 11. 结论

剧本创作模块是AI视频制片链路系统的重要组成部分，通过集成Prompt优化引擎，为用户提供了智能、高效的剧本创作体验。该模块采用现代化的技术架构，实现了完整的剧本管理、AI辅助生成、Prompt优化等功能，同时保持了良好的可扩展性和可维护性。

该模块的设计和实现可以作为其他功能分区的开发参考，遵循相同的技术架构和开发规范，确保整个系统的一致性和可靠性。

## 12. 参考资料

- [FastAPI官方文档](https://fastapi.tiangolo.com/)
- [React官方文档](https://react.dev/)
- [TypeScript官方文档](https://www.typescriptlang.org/)
- [SQLAlchemy官方文档](https://www.sqlalchemy.org/)
- [PostgreSQL官方文档](https://www.postgresql.org/)
- [Supabase官方文档](https://supabase.com/docs)
