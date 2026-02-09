# AI视频制片链路系统 - 技术架构设计方案

## 文档信息
- **文档版本**: 1.0
- **创建日期**: 2026-02-09
- **文档状态**: 正式发布
- **架构版本**: MVP v1.0

---

## 1. 技术选型决策

### 1.1 选型结果

基于产品策略分析和团队能力评估，确定以下技术栈：

| 层级 | 技术选型 | 选型理由 |
|------|---------|---------|
| **前端** | React 18 + TypeScript + Ant Design | 生态成熟、组件丰富、TypeScript提供类型安全 |
| **后端** | Python 3.11 + FastAPI + PostgreSQL | AI生态丰富、性能优秀、异步支持好 |
| **AI服务** | 多模型策略 + 统一抽象层 | 灵活切换、避免供应商锁定、成本优化 |
| **基础设施** | Docker + Kubernetes + AWS/阿里云 | 容器化部署、弹性扩展、成本可控 |

### 1.2 选型对比分析

#### 前端技术对比

| 维度 | React + TypeScript | Vue 3 + TypeScript | Next.js |
|------|-------------------|-------------------|---------|
| 生态成熟度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 学习曲线 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 组件库丰富度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| AI工具集成 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 团队招聘 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **综合评分** | **4.6/5** | 4.2/5 | 4.0/5 |

**选择React的理由**:
1. **AI生态优势**: React与AI可视化工具集成最成熟
2. **组件丰富**: Ant Design Pro提供企业级后台模板
3. **类型安全**: TypeScript在大中型项目中优势明显
4. **人才市场**: React开发者最多，招聘最容易

#### 后端技术对比

| 维度 | Python + FastAPI | Node.js + Express | Go + Gin |
|------|-----------------|-------------------|----------|
| AI生态 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| 开发效率 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 性能表现 | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 异步支持 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 学习曲线 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **综合评分** | **4.6/5** | 4.0/5 | 3.6/5 |

**选择Python FastAPI的理由**:
1. **AI集成**: Python是AI/ML领域标准语言，API SDK最完善
2. **异步性能**: FastAPI基于Starlette，异步性能接近Node.js
3. **类型系统**: 原生支持Pydantic，API文档自动生成
4. **开发速度**: 快速原型开发，适合MVP阶段

---

## 2. 系统架构设计

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              客户端层 (Client Layer)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                 │
│   │   Web App    │    │  Mobile Web  │    │   Desktop    │                 │
│   │   (React)    │    │   (PWA)      │    │  (Electron)  │                 │
│   └──────┬───────┘    └──────┬───────┘    └──────┬───────┘                 │
│          │                   │                   │                          │
│          └───────────────────┴───────────────────┘                          │
│                              │                                              │
└──────────────────────────────┼──────────────────────────────────────────────┘
                               │ HTTPS/WSS
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           网关层 (Gateway Layer)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                         API Gateway (Kong/Nginx)                     │   │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │   │
│   │  │ 路由转发  │  │ 负载均衡  │  │ 限流控制  │  │ 认证鉴权  │            │   │
│   │  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          业务服务层 (Service Layer)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│   │   用户服务    │  │   项目服务    │  │   剧本服务    │  │   分镜服务    │   │
│   │  (User Svc)  │  │ (Project Svc)│  │ (Script Svc) │  │(Storyboard)  │   │
│   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
│          │                 │                 │                 │            │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│   │   人设服务    │  │   音频服务    │  │   视频服务    │  │   导出服务    │   │
│   │(Character)   │  │  (Audio Svc) │  │  (Video Svc) │  │ (Export Svc) │   │
│   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
│          │                 │                 │                 │            │
│          └─────────────────┴─────────────────┴─────────────────┘            │
│                              │                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      消息队列 (Redis/RabbitMQ)                       │   │
│   │              异步任务处理、服务间通信、事件驱动                       │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AI服务层 (AI Service Layer)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      AI服务抽象层 (AI Abstraction Layer)              │   │
│   │  ┌──────────────────────────────────────────────────────────────┐  │   │
│   │  │                    统一API接口定义                             │  │   │
│   │  │  - 标准化输入/输出格式                                         │  │   │
│   │  │  - 模型切换策略                                                │  │   │
│   │  │  - 故障转移机制                                                │  │   │
│   │  │  - 成本优化策略                                                │  │   │
│   │  └──────────────────────────────────────────────────────────────┘  │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│          │                    │                    │                        │
│          ▼                    ▼                    ▼                        │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                 │
│   │   文本生成    │    │   图像生成    │    │   视频生成    │                 │
│   │   (LLM)      │    │   (Image)    │    │   (Video)    │                 │
│   │              │    │              │    │              │                 │
│   │ • GPT-4     │    │ • Midjourney │    │ • Runway     │                 │
│   │ • Claude    │    │ • Stable Diff│    │ • Pika Labs  │                 │
│   │ • 文心一言   │    │ • DALL-E 3   │    │ • 可灵       │                 │
│   │ • 通义千问   │    │ • 通义万相   │    │ • 海螺AI     │                 │
│   └──────────────┘    └──────────────┘    └──────────────┘                 │
│          │                    │                    │                        │
│          ▼                    ▼                    ▼                        │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                 │
│   │   语音合成    │    │   音乐生成    │    │   其他AI     │                 │
│   │    (TTS)     │    │   (Music)    │    │   (Others)   │                 │
│   │              │    │              │    │              │                 │
│   │ • Azure TTS │    │ • Suno      │    │ • 风格迁移   │                 │
│   │ • 阿里云    │    │ • Udio      │    │ • 超分辨率   │                 │
│   │ • ElevenLabs│    │ • MusicGen  │    │ • 去背景     │                 │
│   └──────────────┘    └──────────────┘    └──────────────┘                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          数据存储层 (Data Layer)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│   │  PostgreSQL  │  │    Redis     │  │    MinIO     │  │ Elasticsearch│   │
│   │   (主数据库)  │  │   (缓存)     │  │  (对象存储)   │  │   (搜索)     │   │
│   │              │  │              │  │              │  │              │   │
│   │ • 用户数据   │  │ • 会话缓存   │  │ • 图片文件   │  │ • 全文搜索   │   │
│   │ • 项目数据   │  │ • 热点数据   │  │ • 视频文件   │  │ • 日志分析   │   │
│   │ • 元数据     │  │ • 队列数据   │  │ • 文档文件   │  │ • 监控数据   │   │
│   └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 微服务架构设计

#### 服务拆分策略

采用**领域驱动设计 (DDD)** 进行服务拆分，每个服务对应一个业务领域：

| 服务名称 | 职责描述 | 核心功能 | 数据存储 |
|---------|---------|---------|---------|
| **用户服务**<br>(user-service) | 用户管理和认证 | 注册、登录、权限管理、用户画像 | PostgreSQL |
| **项目服务**<br>(project-service) | 项目生命周期管理 | 项目CRUD、版本控制、协作管理 | PostgreSQL |
| **剧本服务**<br>(script-service) | 剧本创作和管理 | 剧本生成、编辑、多语言支持 | PostgreSQL + ES |
| **分镜服务**<br>(storyboard-service) | 分镜制作和管理 | 分镜生成、编辑、图片管理 | PostgreSQL + MinIO |
| **人设服务**<br>(character-service) | 角色设计和管理 | 人设生成、一致性控制、档案管理 | PostgreSQL + MinIO |
| **音频服务**<br>(audio-service) | 音频生成和管理 | 旁白生成、配乐生成、音频处理 | PostgreSQL + MinIO |
| **视频服务**<br>(video-service) | 视频生成和管理 | 视频生成、批量处理、格式转换 | PostgreSQL + MinIO |
| **导出服务**<br>(export-service) | 项目导出和集成 | 格式转换、剪映集成、下载管理 | PostgreSQL + MinIO |
| **AI网关服务**<br>(ai-gateway) | AI服务统一接入 | 模型路由、负载均衡、故障转移 | Redis |
| **通知服务**<br>(notification-service) | 消息通知 | 邮件、短信、站内信、Webhook | PostgreSQL |
| **Prompt优化服务**<br>(prompt-optimizer) | 自然语言Prompt优化 | 意图识别、结构化转换、模板管理 | PostgreSQL + Redis |

#### 服务间通信

**同步通信**: REST API + gRPC
- **内部服务**: gRPC (高性能、类型安全)
- **外部服务**: REST API (通用性强)

**异步通信**: 消息队列 (RabbitMQ/Redis)
- **场景**: AI生成任务、文件处理、通知发送
- **优势**: 解耦服务、削峰填谷、可靠性高

### 2.3 AI服务抽象层设计

#### 核心设计理念

**统一接口、多供应商、灵活切换**

```python
# AI服务抽象层核心接口
class AIGenerator(ABC):
    """AI生成器抽象基类"""
    
    @abstractmethod
    async def generate(self, prompt: str, **kwargs) -> AIGenerationResult:
        """生成内容"""
        pass
    
    @abstractmethod
    async def health_check(self) -> bool:
        """健康检查"""
        pass
    
    @property
    @abstractmethod
    def cost_per_request(self) -> float:
        """单次请求成本"""
        pass

# 具体实现示例
class GPT4Generator(AIGenerator):
    """GPT-4文本生成器"""
    
    async def generate(self, prompt: str, **kwargs) -> AIGenerationResult:
        # 调用OpenAI API
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            **kwargs
        )
        return AIGenerationResult(
            content=response.choices[0].message.content,
            tokens_used=response.usage.total_tokens,
            cost=self.calculate_cost(response.usage)
        )

class ClaudeGenerator(AIGenerator):
    """Claude文本生成器"""
    
    async def generate(self, prompt: str, **kwargs) -> AIGenerationResult:
        # 调用Anthropic API
        response = await anthropic.Completion.acreate(
            model="claude-3-opus-20240229",
            prompt=prompt,
            **kwargs
        )
        return AIGenerationResult(
            content=response.completion,
            tokens_used=response.usage.input_tokens + response.usage.output_tokens,
            cost=self.calculate_cost(response.usage)
        )
```

#### 模型路由策略

**智能路由算法**:
1. **成本优先**: 选择成本最低的可用模型
2. **质量优先**: 选择质量最高的模型（不考虑成本）
3. **速度优先**: 选择响应速度最快的模型
4. **混合策略**: 根据任务类型自动选择

```python
class ModelRouter:
    """AI模型路由器"""
    
    def __init__(self):
        self.generators: Dict[str, AIGenerator] = {}
        self.strategy: RoutingStrategy = RoutingStrategy.BALANCED
    
    async def route(self, task_type: TaskType, prompt: str, **kwargs) -> AIGenerationResult:
        """路由到最佳模型"""
        
        # 根据任务类型和策略选择模型
        if self.strategy == RoutingStrategy.COST_FIRST:
            generator = self._select_by_cost(task_type)
        elif self.strategy == RoutingStrategy.QUALITY_FIRST:
            generator = self._select_by_quality(task_type)
        elif self.strategy == RoutingStrategy.SPEED_FIRST:
            generator = self._select_by_speed(task_type)
        else:  # BALANCED
            generator = self._select_balanced(task_type)
        
        try:
            return await generator.generate(prompt, **kwargs)
        except Exception as e:
            # 故障转移
            logger.error(f"Primary model failed: {e}, trying fallback...")
            fallback_generator = self._get_fallback(task_type)
            return await fallback_generator.generate(prompt, **kwargs)
```

#### 免费API测试策略 (MVP阶段)

**推荐免费/低成本API方案**:

| 功能 | 推荐API | 免费额度 | 成本 |
|------|---------|---------|------|
| **文本生成** | 文心一言ERNIE-Bot | 500,000 tokens/月 | ¥0 |
| **文本生成** | 通义千问Qwen | 1,000,000 tokens/月 | ¥0 |
| **文本生成** | OpenAI GPT-3.5 | $5信用额度 | $0.002/1K tokens |
| **图像生成** | Stable Diffusion XL | 自托管/免费 | $0 |
| **图像生成** | DALL-E 2 | $5信用额度 | $0.02/图片 |
| **语音合成** | 阿里云TTS | 100,000字符/月 | ¥0 |
| **语音合成** | Azure TTS | 500,000字符/月 | $0 |
| **视频生成** | Runway Gen-2 | 试用额度 | $0.05/秒 |
| **视频生成** | Pika Labs | 试用额度 | $0.05/秒 |

**成本优化策略**:
1. **分层使用**: 开发测试用免费API，生产环境用付费API
2. **缓存机制**: 相同输入直接返回缓存结果
3. **批量处理**: 合并请求减少API调用次数
4. **质量分级**: 根据用户需求选择不同质量等级

### 2.4 Prompt优化服务设计

#### 2.4.1 服务架构

Prompt优化服务作为独立微服务，负责将用户自然语言输入转换为结构化Prompt：

```
┌─────────────────────────────────────────────────────────────────┐
│                    Prompt优化服务架构                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   API 接口层                             │   │
│  │  • /optimize/intent       - 意图识别                     │   │
│  │  • /optimize/structure    - 结构化转换                   │   │
│  │  • /optimize/template     - 模板管理                     │   │
│  │  • /optimize/dialog       - 多轮对话                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌───────────────────────────┼───────────────────────────────┐ │
│  │                           ▼                                │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │                 核心处理引擎                         │  │ │
│  │  │                                                     │  │ │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │  │ │
│  │  │  │ 意图识别器   │  │ 实体提取器   │  │ 模板匹配器   │ │  │ │
│  │  │  │ Intent      │  │ Entity      │  │ Template    │ │  │ │
│  │  │  │ Classifier  │  │ Extractor   │  │ Matcher     │ │  │ │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘ │  │ │
│  │  │                                                     │  │ │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │  │ │
│  │  │  │ Prompt构建器 │  │ 质量检查器   │  │ 对话管理器   │ │  │ │
│  │  │  │ Builder     │  │ Validator   │  │ Dialog Mgr  │ │  │ │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘ │  │ │
│  │  │                                                     │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │                  数据存储层                          │  │ │
│  │  │  • Prompt模板库 (PostgreSQL)                         │  │ │
│  │  │  • 用户偏好数据 (PostgreSQL)                         │  │ │
│  │  │  • 对话上下文 (Redis)                                │  │ │
│  │  │  • 优化缓存 (Redis)                                  │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 2.4.2 核心组件设计

**1. 意图识别器 (Intent Classifier)**

```python
class IntentClassifier:
    """意图识别器 - 识别用户输入的任务类型和意图"""
    
    def __init__(self):
        self.task_types = {
            'script_generation': ['剧本', '脚本', '故事', '剧情'],
            'storyboard_generation': ['分镜', '镜头', '画面'],
            'character_design': ['人设', '角色', '人物', '主角'],
            'audio_generation': ['配音', '旁白', '音乐', '音效'],
            'video_generation': ['视频', '动画', '影片']
        }
        
        self.genre_types = {
            'sci-fi': ['科幻', '未来', '科技', '太空'],
            'romance': ['爱情', '浪漫', '感情'],
            'action': ['动作', '打斗', '战斗'],
            'comedy': ['喜剧', '搞笑', '幽默'],
            'horror': ['恐怖', '惊悚', '悬疑']
        }
    
    async def classify(self, user_input: str) -> IntentResult:
        """识别用户意图"""
        # 使用轻量级LLM进行意图识别
        # 或使用规则匹配 + 向量相似度
        
        intent = IntentResult(
            task_type=self._detect_task_type(user_input),
            genre=self._detect_genre(user_input),
            entities=await self._extract_entities(user_input),
            confidence=0.0
        )
        
        return intent
```

**2. 实体提取器 (Entity Extractor)**

```python
class EntityExtractor:
    """实体提取器 - 提取关键信息和参数"""
    
    def __init__(self):
        self.entity_patterns = {
            'character': r'主角[是为]?(.+?)[，。]|人物[是为]?(.+?)[，。]',
            'setting': r'场景[在为]?(.+?)[，。]|背景[在为]?(.+?)[，。]',
            'style': r'风格[是为]?(.+?)[，。]|(.+?)风格',
            'mood': r'氛围[是为]?(.+?)[，。]|(.+?)氛围'
        }
    
    async def extract(self, user_input: str, task_type: str) -> Dict[str, Any]:
        """提取实体信息"""
        entities = {}
        
        # 规则匹配提取
        for entity_type, pattern in self.entity_patterns.items():
            matches = re.findall(pattern, user_input)
            if matches:
                entities[entity_type] = matches[0]
        
        # LLM辅助提取（处理复杂情况）
        if len(entities) < 3:  # 如果提取的实体较少，使用LLM补充
            llm_entities = await self._extract_with_llm(user_input, task_type)
            entities.update(llm_entities)
        
        return entities
```

**3. 模板匹配器 (Template Matcher)**

```python
class TemplateMatcher:
    """模板匹配器 - 匹配最佳Prompt模板"""
    
    def __init__(self):
        self.templates = self._load_templates()
        self.embedding_model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
    
    def _load_templates(self) -> Dict[str, PromptTemplate]:
        """加载Prompt模板库"""
        return {
            'script_scifi': PromptTemplate(
                task_type='script_generation',
                genre='sci-fi',
                template="""
                创作一个科幻题材的剧本。
                
                故事设定: {setting}
                主角特征: {character}
                视觉风格: {style}
                情感基调: {mood}
                
                要求:
                1. 符合好莱坞剧本格式标准
                2. 包含10-15个场景
                3. 每个场景包含场景标题、动作描述、对话
                4. 体现科幻元素的独特视觉呈现
                """,
                parameters=['setting', 'character', 'style', 'mood']
            ),
            # 更多模板...
        }
    
    async def match(self, intent: IntentResult, entities: Dict) -> PromptTemplate:
        """匹配最佳模板"""
        # 基于任务类型和题材筛选候选模板
        candidates = [
            t for t in self.templates.values()
            if t.task_type == intent.task_type and t.genre == intent.genre
        ]
        
        if not candidates:
            # 如果没有精确匹配，使用通用模板
            return self.templates['generic']
        
        # 使用向量相似度选择最佳模板
        user_embedding = self.embedding_model.encode(intent.raw_input)
        best_match = max(candidates, key=lambda t: 
            cosine_similarity(
                user_embedding,
                self.embedding_model.encode(t.description)
            )
        )
        
        return best_match
```

**4. Prompt构建器 (Prompt Builder)**

```python
class PromptBuilder:
    """Prompt构建器 - 构建最终的结构化Prompt"""
    
    def __init__(self):
        self.quality_keywords = {
            'image': ['high quality', 'detailed', 'professional', '8k'],
            'video': ['smooth animation', 'cinematic', 'high resolution'],
            'text': ['well-structured', 'creative', 'engaging']
        }
    
    async def build(self, template: PromptTemplate, 
                    entities: Dict[str, Any],
                    user_preferences: Dict) -> OptimizedPrompt:
        """构建优化后的Prompt"""
        
        # 填充模板参数
        filled_prompt = template.template.format(**entities)
        
        # 添加质量提升关键词
        content_type = self._detect_content_type(template.task_type)
        quality_tags = self.quality_keywords.get(content_type, [])
        
        # 根据用户偏好调整
        if user_preferences.get('professional_mode'):
            filled_prompt += f"\n\n质量要求: {', '.join(quality_tags)}"
        
        # 优化Prompt结构
        optimized = self._optimize_structure(filled_prompt)
        
        return OptimizedPrompt(
            original_input=entities.get('raw_input'),
            optimized_prompt=optimized,
            template_used=template.name,
            parameters=entities,
            estimated_quality=self._estimate_quality(optimized)
        )
    
    def _optimize_structure(self, prompt: str) -> str:
        """优化Prompt结构"""
        # 1. 去除冗余空白
        prompt = re.sub(r'\n{3,}', '\n\n', prompt)
        
        # 2. 确保关键信息在前
        lines = prompt.split('\n')
        priority_keywords = ['创作', '生成', '设计']
        
        # 3. 添加结构化标记
        if '要求:' not in prompt:
            prompt += '\n\n要求:\n- 高质量输出\n- 符合描述\n- 专业水准'
        
        return prompt.strip()
```

**5. 对话管理器 (Dialog Manager)**

```python
class DialogManager:
    """对话管理器 - 管理多轮对话优化"""
    
    def __init__(self, redis_client):
        self.redis = redis_client
        self.max_turns = 5
        self.session_ttl = 3600  # 1小时
    
    async def start_dialog(self, user_id: str, initial_input: str) -> DialogSession:
        """开始新对话"""
        session_id = f"dialog:{user_id}:{uuid.uuid4()}"
        
        session = DialogSession(
            session_id=session_id,
            user_id=user_id,
            turns=[DialogTurn(input=initial_input, turn=1)],
            collected_info={},
            missing_fields=self._identify_missing_fields(initial_input)
        )
        
        # 保存到Redis
        await self.redis.setex(
            session_id,
            self.session_ttl,
            json.dumps(session.to_dict())
        )
        
        return session
    
    async def continue_dialog(self, session_id: str, 
                             user_response: str) -> DialogResponse:
        """继续对话"""
        # 获取会话
        session_data = await self.redis.get(session_id)
        if not session_data:
            raise DialogNotFoundError("会话不存在或已过期")
        
        session = DialogSession.from_dict(json.loads(session_data))
        
        # 检查是否达到最大轮数
        if len(session.turns) >= self.max_turns:
            # 生成最终Prompt
            final_prompt = await self._generate_final_prompt(session)
            return DialogResponse(
                type='complete',
                message='已收集足够信息',
                optimized_prompt=final_prompt
            )
        
        # 解析用户回答，提取信息
        extracted_info = await self._extract_from_response(
            user_response, 
            session.missing_fields[0]
        )
        
        # 更新会话
        session.collected_info.update(extracted_info)
        session.missing_fields = self._update_missing_fields(
            session.missing_fields,
            extracted_info
        )
        
        # 生成下一轮问题
        if session.missing_fields:
            next_question = self._generate_question(session.missing_fields[0])
            session.turns.append(DialogTurn(
                input=user_response,
                output=next_question,
                turn=len(session.turns) + 1
            ))
            
            # 保存会话
            await self.redis.setex(
                session_id,
                self.session_ttl,
                json.dumps(session.to_dict())
            )
            
            return DialogResponse(
                type='continue',
                message=next_question,
                progress=len(session.collected_info) / 
                        (len(session.collected_info) + len(session.missing_fields))
            )
        else:
            # 信息收集完成
            final_prompt = await self._generate_final_prompt(session)
            return DialogResponse(
                type='complete',
                message='信息收集完成',
                optimized_prompt=final_prompt
            )
```

#### 2.4.3 Prompt模板库设计

```sql
-- Prompt模板表
CREATE TABLE prompt_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    task_type VARCHAR(50) NOT NULL,
    genre VARCHAR(50),
    template TEXT NOT NULL,
    parameters JSONB DEFAULT '[]',
    description TEXT,
    quality_score DECIMAL(3, 2) DEFAULT 0.0,
    usage_count INTEGER DEFAULT 0,
    success_rate DECIMAL(3, 2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户Prompt偏好表
CREATE TABLE user_prompt_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    task_type VARCHAR(50) NOT NULL,
    preferred_style VARCHAR(50),
    custom_templates JSONB DEFAULT '{}',
    quality_preference VARCHAR(20) DEFAULT 'balanced', -- fast, balanced, quality
    auto_optimize BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, task_type)
);

-- Prompt优化记录表
CREATE TABLE prompt_optimization_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    original_input TEXT NOT NULL,
    optimized_prompt TEXT NOT NULL,
    task_type VARCHAR(50) NOT NULL,
    template_used VARCHAR(100),
    processing_time_ms INTEGER,
    user_rating INTEGER, -- 1-5星评分
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2.4.4 API接口设计

```python
# FastAPI路由定义
from fastapi import APIRouter, Depends
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/prompt", tags=["Prompt优化"])

class OptimizeRequest(BaseModel):
    user_input: str
    task_type: Optional[str] = None
    context: Optional[Dict] = None

class OptimizeResponse(BaseModel):
    original_input: str
    optimized_prompt: str
    intent: IntentResult
    entities: Dict[str, Any]
    confidence: float
    processing_time_ms: int

@router.post("/optimize", response_model=OptimizeResponse)
async def optimize_prompt(
    request: OptimizeRequest,
    current_user: User = Depends(get_current_user)
):
    """
    优化用户输入的自然语言为结构化Prompt
    
    - **user_input**: 用户的自然语言输入
    - **task_type**: 可选，指定任务类型
    - **context**: 可选，上下文信息
    """
    start_time = time.time()
    
    # 1. 意图识别
    intent = await intent_classifier.classify(request.user_input)
    
    # 2. 实体提取
    entities = await entity_extractor.extract(
        request.user_input, 
        intent.task_type
    )
    
    # 3. 模板匹配
    template = await template_matcher.match(intent, entities)
    
    # 4. 获取用户偏好
    user_prefs = await get_user_preferences(current_user.id, intent.task_type)
    
    # 5. 构建Prompt
    optimized = await prompt_builder.build(template, entities, user_prefs)
    
    processing_time = int((time.time() - start_time) * 1000)
    
    # 6. 记录日志
    await log_optimization(
        user_id=current_user.id,
        original=request.user_input,
        optimized=optimized.optimized_prompt,
        task_type=intent.task_type,
        processing_time=processing_time
    )
    
    return OptimizeResponse(
        original_input=request.user_input,
        optimized_prompt=optimized.optimized_prompt,
        intent=intent,
        entities=entities,
        confidence=intent.confidence,
        processing_time_ms=processing_time
    )

@router.post("/dialog/start")
async def start_dialog_session(
    request: DialogStartRequest,
    current_user: User = Depends(get_current_user)
):
    """开始多轮对话优化会话"""
    session = await dialog_manager.start_dialog(
        current_user.id,
        request.initial_input
    )
    
    # 生成第一个问题
    first_question = dialog_manager.generate_first_question(session)
    
    return DialogStartResponse(
        session_id=session.session_id,
        first_question=first_question,
        estimated_turns=session.estimated_turns
    )

@router.post("/dialog/continue")
async def continue_dialog_session(
    request: DialogContinueRequest,
    current_user: User = Depends(get_current_user)
):
    """继续多轮对话"""
    response = await dialog_manager.continue_dialog(
        request.session_id,
        request.user_response
    )
    
    return response
```

### 2.5 前端多端架构设计

#### 2.5.1 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                     前端多端架构                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   表现层 (Presentation)                  │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │   Web App    │  │     PWA      │  │  Future App  │  │   │
│  │  │   (React)    │  │  (离线支持)   │  │(React Native)│  │   │
│  │  │              │  │              │  │              │  │   │
│  │  │ • 桌面端      │  │ • Service    │  │ • iOS        │  │   │
│  │  │ • 响应式      │  │   Worker     │  │ • Android    │  │   │
│  │  │ • 浏览器      │  │ • 离线缓存   │  │ • 原生体验   │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│  ┌───────────────────────────┼───────────────────────────────┐ │
│  │                           ▼                                │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │              共享逻辑层 (Shared Logic)               │  │ │
│  │  │                                                     │  │ │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │  │ │
│  │  │  │ 状态管理     │  │  API客户端   │  │ 业务逻辑    │ │  │ │
│  │  │  │ (Zustand)   │  │ (Axios/     │  │ (Hooks)     │ │  │ │
│  │  │  │             │  │  Fetch)     │  │             │ │  │ │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘ │  │ │
│  │  │                                                     │  │ │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │  │ │
│  │  │  │ 工具函数     │  │ 常量定义     │  │ 类型定义    │ │  │ │
│  │  │  │ (Utils)     │  │ (Constants) │  │ (Types)     │ │  │ │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘ │  │ │
│  │  │                                                     │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │              组件抽象层 (UI Abstraction)             │  │ │
│  │  │                                                     │  │ │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │  │ │
│  │  │  │ 业务组件     │  │ 跨平台抽象   │  │ 主题系统    │ │  │ │
│  │  │  │ (Business)  │  │ (Adapter)   │  │ (Theme)     │ │  │ │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘ │  │ │
│  │  │                                                     │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 2.5.2 项目结构

```
frontend/
├── apps/
│   ├── web/                    # Web应用 (MVP)
│   │   ├── src/
│   │   │   ├── main.tsx
│   │   │   ├── App.tsx
│   │   │   ├── index.html
│   │   │   └── service-worker.ts  # PWA支持
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── mobile/                 # 未来: React Native (预留)
│       └── (待创建)
│
├── packages/
│   ├── shared/                 # 共享逻辑层
│   │   ├── src/
│   │   │   ├── api/            # API客户端
│   │   │   │   ├── client.ts
│   │   │   │   ├── endpoints/
│   │   │   │   └── interceptors.ts
│   │   │   │
│   │   │   ├── store/          # 状态管理
│   │   │   │   ├── index.ts
│   │   │   │   ├── slices/
│   │   │   │   └── selectors.ts
│   │   │   │
│   │   │   ├── hooks/          # 业务逻辑Hooks
│   │   │   │   ├── useProject.ts
│   │   │   │   ├── useScript.ts
│   │   │   │   └── useAI.ts
│   │   │   │
│   │   │   ├── utils/          # 工具函数
│   │   │   │   ├── format.ts
│   │   │   │   ├── validation.ts
│   │   │   │   └── constants.ts
│   │   │   │
│   │   │   └── types/          # TypeScript类型
│   │   │       ├── index.ts
│   │   │       ├── api.ts
│   │   │       └── models.ts
│   │   │
│   │   └── package.json
│   │
│   ├── ui/                     # UI组件库
│   │   ├── src/
│   │   │   ├── components/     # 通用组件
│   │   │   │   ├── Button/
│   │   │   │   ├── Input/
│   │   │   │   └── Card/
│   │   │   │
│   │   │   ├── business/       # 业务组件
│   │   │   │   ├── ScriptEditor/
│   │   │   │   ├── StoryboardViewer/
│   │   │   │   └── CharacterDesigner/
│   │   │   │
│   │   │   ├── adapters/       # 跨平台适配器
│   │   │   │   ├── web.tsx
│   │   │   │   └── mobile.tsx  # 未来扩展
│   │   │   │
│   │   │   ├── theme/          # 主题系统
│   │   │   │   ├── index.ts
│   │   │   │   ├── tokens.ts
│   │   │   │   └── components.ts
│   │   │   │
│   │   │   └── hooks/          # UI Hooks
│   │   │       ├── useMediaQuery.ts
│   │   │       └── useResponsive.ts
│   │   │
│   │   └── package.json
│   │
│   └── config/                 # 共享配置
│       ├── eslint-config/
│       ├── ts-config/
│       └── tailwind-config/
│
└── turbo.json                  # Monorepo配置
```

#### 2.5.3 响应式设计实现

```typescript
// packages/ui/src/hooks/useResponsive.ts
import { useMediaQuery } from './useMediaQuery';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export const breakpoints = {
  xs: 0,      // 移动端竖屏
  sm: 576,    // 移动端横屏
  md: 768,    // 平板竖屏
  lg: 992,    // 平板横屏/小桌面
  xl: 1200,   // 桌面
  xxl: 1400,  // 大桌面
};

export function useResponsive() {
  const isXs = useMediaQuery(`(max-width: ${breakpoints.sm - 1}px)`);
  const isSm = useMediaQuery(`(min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.md - 1}px)`);
  const isMd = useMediaQuery(`(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`);
  const isLg = useMediaQuery(`(min-width: ${breakpoints.lg}px) and (max-width: ${breakpoints.xl - 1}px)`);
  const isXl = useMediaQuery(`(min-width: ${breakpoints.xl}px)`);
  
  const isMobile = isXs || isSm;
  const isTablet = isMd || isLg;
  const isDesktop = isXl;
  
  return {
    breakpoint: isXs ? 'xs' : isSm ? 'sm' : isMd ? 'md' : isLg ? 'lg' : 'xl',
    isMobile,
    isTablet,
    isDesktop,
    isXs, isSm, isMd, isLg, isXl,
  };
}

// 使用示例
function ProjectList() {
  const { isMobile, isTablet } = useResponsive();
  
  return (
    <div className={`
      grid gap-4
      ${isMobile ? 'grid-cols-1' : ''}
      ${isTablet ? 'grid-cols-2' : ''}
      ${!isMobile && !isTablet ? 'grid-cols-3' : ''}
    `}>
      {/* 项目卡片 */}
    </div>
  );
}
```

#### 2.5.4 PWA配置

```typescript
// apps/web/src/service-worker.ts
/// <reference lib="webworker" />

const CACHE_NAME = 'ai-video-platform-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/index.js',
  '/assets/index.css',
  '/manifest.json',
];

// 安装时缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// 激活时清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// 拦截请求，优先使用缓存
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // API请求使用网络优先策略
  if (request.url.includes('/api/')) {
    event.respondWith(networkFirst(request));
  } else {
    // 静态资源使用缓存优先策略
    event.respondWith(cacheFirst(request));
  }
});

async function networkFirst(request: Request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

async function cacheFirst(request: Request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, networkResponse.clone());
  return networkResponse;
}

// 后台同步
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-projects') {
    event.waitUntil(syncProjects());
  }
});

async function syncProjects() {
  // 同步离线期间的操作
  const db = await openDB('ai-video-db', 1);
  const pendingChanges = await db.getAll('pendingChanges');
  
  for (const change of pendingChanges) {
    try {
      await fetch('/api/projects/sync', {
        method: 'POST',
        body: JSON.stringify(change),
      });
      await db.delete('pendingChanges', change.id);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}
```

#### 2.5.5 跨平台代码复用策略

```typescript
// packages/shared/src/api/client.ts
// 平台无关的API客户端

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

interface APIConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  // 平台特定的适配器
  adapter?: AxiosRequestConfig['adapter'];
}

export class APIClient {
  private client: AxiosInstance;
  
  constructor(config: APIConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      adapter: config.adapter, // React Native可以使用不同的adapter
    });
    
    this.setupInterceptors();
  }
  
  private setupInterceptors() {
    // 请求拦截器
    this.client.interceptors.request.use(
      async (config) => {
        // 获取token（平台无关）
        const token = await this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        if (error.response?.status === 401) {
          // 处理认证失败
          await this.handleAuthError();
        }
        return Promise.reject(error);
      }
    );
  }
  
  // 平台特定的token获取（由具体平台实现）
  protected async getAuthToken(): Promise<string | null> {
    // Web: localStorage
    // Mobile: AsyncStorage
    throw new Error('Must be implemented by platform');
  }
  
  protected async handleAuthError(): Promise<void> {
    throw new Error('Must be implemented by platform');
  }
  
  // 通用API方法
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    return this.client.get(url, { params });
  }
  
  async post<T>(url: string, data?: any): Promise<T> {
    return this.client.post(url, data);
  }
  
  async put<T>(url: string, data?: any): Promise<T> {
    return this.client.put(url, data);
  }
  
  async delete<T>(url: string): Promise<T> {
    return this.client.delete(url);
  }
}

// Web平台实现
// apps/web/src/api/client.ts
import { APIClient } from '@ai-video/shared/api';

export class WebAPIClient extends APIClient {
  protected async getAuthToken(): Promise<string | null> {
    return localStorage.getItem('auth_token');
  }
  
  protected async handleAuthError(): Promise<void> {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  }
}

// 使用
export const apiClient = new WebAPIClient({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
```

---

## 3. 数据架构设计

### 3.1 数据库设计

#### PostgreSQL 主数据库

**核心表结构**:

```sql
-- 用户表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500),
    role VARCHAR(20) DEFAULT 'user', -- admin, user, viewer
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 项目表
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'draft', -- draft, processing, completed
    progress INTEGER DEFAULT 0, -- 0-100
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 剧本表
CREATE TABLE scripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(200),
    content TEXT NOT NULL,
    language VARCHAR(10) DEFAULT 'zh-CN',
    style VARCHAR(50),
    scenes JSONB DEFAULT '[]',
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 分镜表
CREATE TABLE storyboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    script_id UUID REFERENCES scripts(id) ON DELETE CASCADE,
    sequence INTEGER NOT NULL,
    shot_number VARCHAR(10),
    shot_type VARCHAR(50), -- 特写、近景、中景、全景
    camera_movement VARCHAR(100),
    description TEXT,
    image_url VARCHAR(500),
    image_key VARCHAR(200),
    status VARCHAR(20) DEFAULT 'pending', -- pending, generated, approved
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 角色人设表
CREATE TABLE characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    personality TEXT,
    appearance TEXT,
    clothing TEXT,
    image_url VARCHAR(500),
    image_key VARCHAR(200),
    consistency_id VARCHAR(100), -- 用于AI一致性控制
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 音频表
CREATE TABLE audios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, -- narration, music, sfx
    scene_id UUID REFERENCES storyboards(id),
    url VARCHAR(500),
    file_key VARCHAR(200),
    duration INTEGER, -- 秒
    settings JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 视频表
CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    storyboard_id UUID REFERENCES storyboards(id) ON DELETE CASCADE,
    url VARCHAR(500),
    file_key VARCHAR(200),
    duration INTEGER DEFAULT 10, -- 秒
    resolution VARCHAR(20), -- 720p, 1080p, 2K, 4K
    format VARCHAR(10), -- mp4, mov
    file_size BIGINT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI生成任务表
CREATE TABLE ai_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    task_type VARCHAR(50) NOT NULL, -- script, storyboard, character, audio, video
    provider VARCHAR(50), -- openai, anthropic, aliyun, etc.
    model VARCHAR(100),
    prompt TEXT,
    result TEXT,
    tokens_input INTEGER,
    tokens_output INTEGER,
    cost DECIMAL(10, 4),
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
    error_message TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_scripts_project_id ON scripts(project_id);
CREATE INDEX idx_storyboards_script_id ON storyboards(script_id);
CREATE INDEX idx_characters_project_id ON characters(project_id);
CREATE INDEX idx_videos_storyboard_id ON videos(storyboard_id);
CREATE INDEX idx_ai_tasks_project_id ON ai_tasks(project_id);
CREATE INDEX idx_ai_tasks_status ON ai_tasks(status);
```

#### Redis 缓存层

**缓存策略**:

| 数据类型 | 缓存Key | 过期时间 | 说明 |
|---------|---------|---------|------|
| 用户会话 | `session:{token}` | 30分钟 | JWT Token映射 |
| 热点数据 | `hot:{entity}:{id}` | 10分钟 | 频繁访问的数据 |
| AI结果缓存 | `ai_cache:{hash}` | 24小时 | 相同输入的AI结果 |
| 限流计数 | `rate_limit:{user_id}` | 1分钟 | API限流控制 |
| 任务队列 | `task_queue:{type}` | 无 | 异步任务队列 |
| 分布式锁 | `lock:{resource}` | 30秒 | 并发控制 |

### 3.2 对象存储设计 (MinIO)

**存储桶结构**:

```
ai-video-platform/
├── avatars/              # 用户头像
│   └── {user_id}/
│       └── avatar.png
├── projects/             # 项目文件
│   └── {project_id}/
│       ├── storyboards/  # 分镜图片
│       │   └── {storyboard_id}.png
│       ├── characters/   # 角色人设
│       │   └── {character_id}.png
│       ├── audios/       # 音频文件
│       │   └── {audio_id}.mp3
│       ├── videos/       # 视频文件
│       │   └── {video_id}.mp4
│       └── exports/      # 导出文件
│           └── {export_id}.zip
├── templates/            # 系统模板
│   ├── scripts/          # 剧本模板
│   ├── styles/           # 风格模板
│   └── presets/          # 预设配置
└── temp/                 # 临时文件
    └── {session_id}/
```

**文件命名规范**:
- 图片: `{entity}_{id}_{timestamp}.png`
- 音频: `{entity}_{id}_{timestamp}.mp3`
- 视频: `{entity}_{id}_{timestamp}_{quality}.mp4`
- 文档: `{entity}_{id}_{timestamp}.pdf`

---

## 4. API设计

### 4.1 REST API规范

#### API版本控制
- **URL路径**: `/api/v1/...`
- **Header**: `Accept: application/vnd.api.v1+json`

#### 标准响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": { ... },
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 100,
    "total_pages": 5
  },
  "timestamp": "2026-02-09T10:30:00Z"
}
```

#### 错误响应格式

```json
{
  "code": 400,
  "message": "Invalid request parameters",
  "errors": [
    {
      "field": "email",
      "message": "Email format is invalid"
    }
  ],
  "timestamp": "2026-02-09T10:30:00Z"
}
```

### 4.2 核心API接口

#### 用户认证API

```yaml
# 用户注册
POST /api/v1/auth/register
Request:
  body:
    email: string (required)
    password: string (required, min: 8)
    name: string (required)
Response:
  201: { user_id, email, name, token }
  400: { errors }

# 用户登录
POST /api/v1/auth/login
Request:
  body:
    email: string (required)
    password: string (required)
Response:
  200: { user_id, email, name, token, refresh_token }
  401: { message: "Invalid credentials" }

# 刷新Token
POST /api/v1/auth/refresh
Request:
  header: Authorization: Bearer {refresh_token}
Response:
  200: { token, refresh_token }
```

#### 项目管理API

```yaml
# 创建项目
POST /api/v1/projects
Request:
  header: Authorization: Bearer {token}
  body:
    name: string (required)
    description: string
Response:
  201: { project_id, name, status, created_at }

# 获取项目列表
GET /api/v1/projects
Request:
  header: Authorization: Bearer {token}
  query:
    page: integer (default: 1)
    page_size: integer (default: 20)
    status: string (optional)
Response:
  200: { projects[], pagination }

# 获取项目详情
GET /api/v1/projects/{project_id}
Response:
  200: { project details with all related data }

# 更新项目
PUT /api/v1/projects/{project_id}
Request:
  body:
    name: string
    description: string
    status: string
Response:
  200: { updated project }

# 删除项目
DELETE /api/v1/projects/{project_id}
Response:
  204: No Content
```

#### 剧本创作API

```yaml
# 生成剧本
POST /api/v1/projects/{project_id}/scripts/generate
Request:
  body:
    description: string (required, min: 100)
    language: string (default: "zh-CN")
    style: string (optional)
Response:
  201: { script_id, content, scenes[], status: "processing" }

# 获取剧本
GET /api/v1/projects/{project_id}/scripts/{script_id}
Response:
  200: { script details }

# 更新剧本
PUT /api/v1/projects/{project_id}/scripts/{script_id}
Request:
  body:
    content: string
    scenes: array
Response:
  200: { updated script }

# 翻译剧本
POST /api/v1/projects/{project_id}/scripts/{script_id}/translate
Request:
  body:
    target_language: string (required)
Response:
  201: { translated_script }

# 生成分镜脚本
POST /api/v1/projects/{project_id}/scripts/{script_id}/storyboard-script
Response:
  201: { storyboard_script }
```

#### AI生成任务API

```yaml
# 获取任务状态
GET /api/v1/tasks/{task_id}
Response:
  200: 
    task_id: string
    type: string
    status: string (pending/processing/completed/failed)
    progress: integer (0-100)
    result: object
    error_message: string
    created_at: timestamp
    completed_at: timestamp

# 批量获取任务状态
POST /api/v1/tasks/batch
Request:
  body:
    task_ids: string[]
Response:
  200: { tasks[] }

# 取消任务
DELETE /api/v1/tasks/{task_id}
Response:
  204: No Content
```

### 4.3 WebSocket API (实时通信)

```yaml
# 连接WebSocket
wss://api.ai-video-platform.com/ws
Header: Authorization: Bearer {token}

# 订阅项目更新
Message:
  {
    "action": "subscribe",
    "channel": "project:{project_id}"
  }

# 接收实时更新
Message:
  {
    "type": "task_update",
    "data": {
      "task_id": "uuid",
      "status": "processing",
      "progress": 50,
      "message": "Generating video..."
    }
  }
```

---

## 5. 安全架构设计

### 5.1 认证与授权

#### JWT Token策略

```python
# Token配置
JWT_CONFIG = {
    "access_token_expire": 30 * 60,  # 30分钟
    "refresh_token_expire": 7 * 24 * 60 * 60,  # 7天
    "algorithm": "HS256",
    "secret_key": os.getenv("JWT_SECRET_KEY")
}

# Token内容
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "user",
  "iat": 1707475800,
  "exp": 1707477600
}
```

#### RBAC权限模型

| 角色 | 权限范围 |
|------|---------|
| **Admin** | 系统管理、用户管理、全部项目访问 |
| **User** | 自己的项目管理、团队协作项目 |
| **Viewer** | 只读访问被分享的项目 |
| **Guest** | 试用功能，限制生成次数 |

### 5.2 数据安全

#### 传输安全
- **HTTPS**: 全站TLS 1.3加密
- **HSTS**: HTTP Strict Transport Security
- **CORS**: 严格跨域控制

#### 存储安全
- **密码加密**: bcrypt (cost=12)
- **敏感数据**: AES-256加密存储
- **密钥管理**: AWS KMS / 阿里云KMS

#### API安全
- **限流**: 基于用户等级的请求限流
- **防重放**: 请求时间戳+Nonce验证
- **输入验证**: 严格的参数校验和SQL注入防护

---

## 6. 部署架构设计

### 6.1 容器化部署

#### Docker镜像设计

```dockerfile
# 前端镜像
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

```dockerfile
# 后端镜像
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Kubernetes部署

```yaml
# 后端服务Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: ai-video-platform/backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

### 6.2 CI/CD流水线

#### GitHub Actions工作流

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          pip install -r requirements.txt
          pytest tests/
      - name: Code coverage
        run: pytest --cov=app tests/

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t ai-video-platform/backend:${{ github.sha }} .
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push ai-video-platform/backend:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/backend backend=ai-video-platform/backend:${{ github.sha }}
          kubectl rollout status deployment/backend
```

### 6.3 环境规划

| 环境 | 用途 | 配置 | 访问权限 |
|------|------|------|---------|
| **Development** | 开发测试 | 单节点，最小配置 | 开发团队 |
| **Staging** | 预发布测试 | 生产等比缩小 | 开发+测试团队 |
| **Production** | 生产环境 | 高可用集群 | 运维团队 |
| **Disaster Recovery** | 灾备 | 冷备份 | 运维团队 |

---

## 7. 监控与运维

### 7.1 监控体系

#### 应用监控 (APM)

**工具**: Prometheus + Grafana

**监控指标**:
- API响应时间 (P50, P95, P99)
- 错误率 (4xx, 5xx)
- 吞吐量 (QPS)
- AI生成成功率
- 队列长度

#### 日志管理

**工具**: ELK Stack (Elasticsearch + Logstash + Kibana)

**日志分类**:
- 应用日志 (INFO, WARN, ERROR)
- 访问日志 (Nginx)
- AI服务日志 (调用记录、成本)
- 审计日志 (用户操作)

#### 告警策略

| 告警级别 | 触发条件 | 通知方式 | 响应时间 |
|---------|---------|---------|---------|
| **Critical** | 服务宕机、数据丢失 | 电话+短信+邮件 | 5分钟 |
| **High** | 错误率>5%、响应时间>5s | 短信+邮件 | 15分钟 |
| **Medium** | 错误率>1%、队列积压 | 邮件 | 1小时 |
| **Low** | 磁盘>80%、内存>90% | 邮件 | 4小时 |

### 7.2 运维自动化

#### 自动化脚本

```bash
#!/bin/bash
# 自动备份脚本

# 数据库备份
pg_dump -h $DB_HOST -U $DB_USER $DB_NAME > backup_$(date +%Y%m%d).sql

# 文件备份
mc mirror minio/projects s3/backup/projects

# 清理旧备份（保留30天）
find /backups -name "backup_*.sql" -mtime +30 -delete
```

---

## 8. 性能优化策略

### 8.1 前端优化

- **代码分割**: 路由懒加载，减少首屏加载时间
- **资源压缩**: Gzip/Brotli压缩，图片WebP格式
- **缓存策略**: 静态资源长期缓存，API响应ETag
- **CDN加速**: 全球CDN节点，就近访问

### 8.2 后端优化

- **数据库优化**: 索引优化、查询优化、连接池
- **缓存策略**: Redis多级缓存，热点数据预热
- **异步处理**: 耗时操作异步化，消息队列削峰
- **AI结果缓存**: 相同输入直接返回缓存结果

### 8.3 AI服务优化

- **批量处理**: 合并请求减少API调用
- **智能重试**: 失败自动重试，指数退避
- **降级策略**: 主服务失败自动切换到备用服务
- **成本控制**: 根据质量需求选择不同模型

---

## 9. 扩展性设计

### 9.1 水平扩展

**无状态服务设计**:
- 服务层无状态，支持水平扩展
- 会话信息存储在Redis
- 文件存储在对象存储

**自动扩缩容**:
```yaml
# Kubernetes HPA配置
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### 9.2 数据库扩展

**读写分离**:
- 主库处理写操作
- 从库处理读操作
- 自动故障转移

**分库分表**:
- 按用户ID分片
- 历史数据归档
- 冷热数据分离

---

## 10. 技术债务管理

### 10.1 代码质量

- **代码审查**: 所有代码必须经过PR审查
- **静态分析**: SonarQube代码质量检查
- **测试覆盖**: 单元测试覆盖率>80%
- **文档要求**: 核心功能必须有技术文档

### 10.2 重构计划

| 阶段 | 时间 | 重构内容 | 目标 |
|------|------|---------|------|
| **Phase 1** | 月6-7 | 优化数据库查询 | 响应时间减少50% |
| **Phase 2** | 月8-9 | 重构AI服务层 | 支持更多模型 |
| **Phase 3** | 月10-12 | 微服务拆分 | 独立部署、扩展 |

---

## 11. 技术风险与缓解

| 风险 | 可能性 | 影响 | 缓解策略 |
|------|--------|------|----------|
| AI服务不稳定 | 高 | 高 | 多供应商备份、降级策略 |
| 生成成本过高 | 中 | 高 | 缓存优化、批量处理、分层服务 |
| 系统性能瓶颈 | 中 | 中 | 性能测试、监控告警、自动扩容 |
| 技术栈学习成本 | 中 | 中 | 技术培训、文档完善、代码审查 |
| 第三方API变更 | 低 | 高 | 抽象层设计、版本控制、快速切换 |

---

## 12. 附录

### 12.1 技术栈版本

| 组件 | 版本 | 说明 |
|------|------|------|
| React | 18.2+ | 前端框架 |
| TypeScript | 5.0+ | 类型系统 |
| Ant Design | 5.0+ | UI组件库 |
| Python | 3.11+ | 后端语言 |
| FastAPI | 0.104+ | Web框架 |
| PostgreSQL | 15+ | 主数据库 |
| Redis | 7+ | 缓存/队列 |
| MinIO | 最新 | 对象存储 |
| Docker | 24+ | 容器化 |
| Kubernetes | 1.28+ | 容器编排 |

### 12.2 开发环境搭建

```bash
# 1. 克隆代码
git clone https://github.com/ai-video-platform/backend.git
cd backend

# 2. 创建虚拟环境
python -m venv venv
source venv/bin/activate

# 3. 安装依赖
pip install -r requirements.txt

# 4. 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 5. 启动服务
uvicorn main:app --reload --port 8000
```

### 12.3 相关文档

- [API接口文档](./API_Documentation.md) (待创建)
- [数据库设计文档](./Database_Design.md) (待创建)
- [部署手册](./Deployment_Manual.md) (待创建)
- [运维手册](./Operations_Manual.md) (待创建)

---

**文档结束**

本技术架构方案基于产品策略专家技能框架制定，结合了最佳实践和团队技术选型偏好，为AI视频制片链路系统的开发提供了完整的技术指导。