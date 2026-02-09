# AI视频制片链路系统 - UI/UX 设计系统

**版本**: 1.1  
**日期**: 2026-02-09  
**风格**: Apple Pro + Dark Mode + Glassmorphism

**更新记录**:
- v1.1 (2026-02-09): 更新导航项为毛玻璃设计，优化未选中状态颜色，品牌名称更新为 AMF.io

---

## 1. 设计理念

### 核心原则

1. **Dark First**: 纯黑背景，减少视觉疲劳，突出视频内容
2. **Glassmorphism**: 玻璃拟态效果，增加层次感和现代感
3. **Content Focus**: 内容优先，UI元素最小化
4. **Cinematic**: 电影感视觉，符合视频制作主题
5. **Micro-interactions**: 细腻的微交互提升体验

### 设计目标

- 专业级视频编辑工具的视觉标准
- 长时间使用的舒适度
- 高度可交互的现代体验
- 与AI功能相匹配的未来感

---

## 2. 色彩系统

### 2.1 背景层级

| Token | 值 | 用途 |
|-------|-----|------|
| `--bg-primary` | `#000000` | 主背景、页面底色 |
| `--bg-secondary` | `#0d0d12` | 卡片背景、面板 |
| `--bg-tertiary` | `#1a1a24` | 悬浮面板、下拉菜单 |
| `--bg-elevated` | `#252530` | 输入框、按钮、选中项 |
| `--bg-overlay` | `rgba(0,0,0,0.8)` | 模态框遮罩 |

### 2.2 玻璃拟态

| Token | 值 | 用途 |
|-------|-----|------|
| `--glass-bg` | `rgba(255,255,255,0.03)` | 玻璃背景 |
| `--glass-border` | `rgba(255,255,255,0.08)` | 玻璃边框 |
| `--glass-highlight` | `rgba(255,255,255,0.12)` | 玻璃高光 |
| `--glass-shadow` | `0 8px 32px rgba(0,0,0,0.4)` | 玻璃阴影 |

### 2.3 文字颜色

| Token | 值 | 用途 |
|-------|-----|------|
| `--text-primary` | `#ffffff` | 标题、重要文字 |
| `--text-secondary` | `rgba(255,255,255,0.7)` | 正文、描述 |
| `--text-tertiary` | `rgba(255,255,255,0.5)` | 辅助文字、占位符 |
| `--text-quaternary` | `rgba(255,255,255,0.3)` | 禁用状态、水印 |

### 2.4 强调色

| Token | 值 | 用途 |
|-------|-----|------|
| `--accent-blue` | `#0a84ff` | 主按钮、链接、主强调 |
| `--accent-blue-light` | `#409cff` | 悬停状态 |
| `--accent-purple` | `#bf5af2` | AI功能、魔法效果 |
| `--accent-orange` | `#ff9f0a` | 警告、生成中状态 |
| `--accent-green` | `#30d158` | 成功、完成状态 |
| `--accent-red` | `#ff453a` | 错误、删除 |
| `--accent-yellow` | `#ffd60a` | 提示、注意 |

### 2.5 渐变色

```css
/* 英雄区渐变 */
--gradient-hero: linear-gradient(180deg, #1a1a2e 0%, #0d0d12 100%);

/* 玻璃渐变 */
--gradient-glass: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%);

/* 强调渐变 */
--gradient-accent: linear-gradient(135deg, #0a84ff 0%, #bf5af2 100%);

/* 成功渐变 */
--gradient-success: linear-gradient(135deg, #30d158 0%, #64d2ff 100%);

/* 警告渐变 */
--gradient-warning: linear-gradient(135deg, #ff9f0a 0%, #ffd60a 100%);
```

---

## 3. 字体系统

### 3.1 字体族

```css
/* 主字体 - Apple风格 */
--font-primary: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

/* 等宽字体 - 代码、数据 */
--font-mono: "SF Mono", "Fira Code", "JetBrains Mono", Consolas, Monaco, monospace;

/* 中文字体 */
--font-chinese: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
```

### 3.2 字号层级

| Token | 大小 | 行高 | 字重 | 用途 |
|-------|------|------|------|------|
| `--text-xs` | 11px | 16px | 400 | 标签、时间戳、徽章 |
| `--text-sm` | 13px | 20px | 400 | 辅助文字、说明 |
| `--text-base` | 15px | 24px | 400 | 正文、按钮 |
| `--text-lg` | 17px | 28px | 400 | 小标题、导航 |
| `--text-xl` | 20px | 32px | 500 | 卡片标题 |
| `--text-2xl` | 28px | 36px | 600 | 页面标题 |
| `--text-3xl` | 36px | 44px | 700 | 大标题、英雄区 |
| `--text-4xl` | 48px | 56px | 700 | 品牌标题 |

### 3.3 字重

| Token | 值 | 用途 |
|-------|-----|------|
| `--font-regular` | 400 | 正文 |
| `--font-medium` | 500 | 强调文字 |
| `--font-semibold` | 600 | 标题、按钮 |
| `--font-bold` | 700 | 大标题 |

---

## 4. 间距系统

### 4.1 基础间距

| Token | 值 | 用途 |
|-------|-----|------|
| `--space-1` | 4px | 图标间距、紧凑内边距 |
| `--space-2` | 8px | 小间距、行内元素 |
| `--space-3` | 12px | 按钮内边距、小卡片 |
| `--space-4` | 16px | 标准间距、卡片内边距 |
| `--space-5` | 20px | 中等间距 |
| `--space-6` | 24px | 大间距、区块间距 |
| `--space-8` | 32px | 大区块间距 |
| `--space-10` | 40px | 页面级间距 |
| `--space-12` | 48px | 大区块间距 |
| `--space-16` | 64px | 英雄区间距 |

### 4.2 布局尺寸

| Token | 值 | 用途 |
|-------|-----|------|
| `--sidebar-width` | 240px | 侧边栏宽度 |
| `--sidebar-collapsed` | 64px | 侧边栏收起宽度 |
| `--header-height` | 56px | 顶部栏高度 |
| `--content-max-width` | 1400px | 内容最大宽度 |
| `--card-border-radius` | 16px | 卡片圆角 |
| `--button-border-radius` | 8px | 按钮圆角 |
| `--input-border-radius` | 10px | 输入框圆角 |

---

## 5. 组件规范

### 5.1 玻璃卡片 (Glass Card)

```css
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: var(--card-border-radius);
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.glass-card:active {
  transform: translateY(0);
  transition-duration: 0.1s;
}
```

### 5.2 主按钮 (Primary Button)

```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--accent-blue);
  color: white;
  border: none;
  border-radius: var(--button-border-radius);
  padding: 10px 20px;
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 0 0 0 rgba(10, 132, 255, 0);
}

.btn-primary:hover {
  background: var(--accent-blue-light);
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(10, 132, 255, 0.3);
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* 加载状态 */
.btn-primary.loading {
  opacity: 0.8;
  cursor: wait;
}
```

### 5.3 次级按钮 (Secondary Button)

```css
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--bg-elevated);
  color: var(--text-primary);
  border: 1px solid var(--glass-border);
  border-radius: var(--button-border-radius);
  padding: 10px 20px;
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
  border-color: var(--glass-highlight);
}

.btn-secondary:active {
  background: var(--bg-secondary);
  transform: scale(0.98);
}
```

### 5.4 幽灵按钮 (Ghost Button)

```css
.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: transparent;
  color: var(--text-secondary);
  border: none;
  border-radius: var(--button-border-radius);
  padding: 8px 16px;
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}
```

### 5.5 输入框 (Input)

```css
.input-glass {
  width: 100%;
  background: var(--bg-elevated);
  border: 1px solid var(--glass-border);
  border-radius: var(--input-border-radius);
  padding: 12px 16px;
  color: var(--text-primary);
  font-size: var(--text-base);
  font-family: var(--font-primary);
  transition: all 0.2s ease;
  outline: none;
}

.input-glass::placeholder {
  color: var(--text-tertiary);
}

.input-glass:hover {
  border-color: var(--glass-highlight);
}

.input-glass:focus {
  border-color: var(--accent-blue);
  box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.15);
  background: var(--bg-secondary);
}

.input-glass:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-glass.error {
  border-color: var(--accent-red);
  box-shadow: 0 0 0 3px rgba(255, 69, 58, 0.15);
}
```

### 5.6 导航项 - 毛玻璃设计 (Nav Item Glass)

**设计原则**:
- 未选中状态使用低饱和度颜色，避免与深色背景冲突
- 悬停时显示毛玻璃背景效果
- 选中状态使用渐变背景 + 发光阴影

```css
.nav-item-glass {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 未选中状态 - 低饱和度颜色 */
.nav-item-glass .nav-icon {
  color: var(--text-tertiary);  /* 50% 白色 */
  transition: color 0.2s ease, transform 0.2s ease;
}

.nav-item-glass span {
  color: var(--text-secondary);  /* 70% 白色 */
  font-size: var(--text-base);
  font-weight: 500;
  transition: color 0.2s ease;
}

/* 悬停状态 - 毛玻璃效果 */
.nav-item-glass:hover {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
}

.nav-item-glass:hover .nav-icon {
  transform: scale(1.1);
}

/* 选中状态 - 渐变背景 + 发光 */
.nav-item-glass.active {
  background: linear-gradient(135deg, rgba(10, 132, 255, 0.15) 0%, rgba(191, 90, 242, 0.15) 100%);
  border-color: rgba(10, 132, 255, 0.3);
  box-shadow: 
    0 4px 24px rgba(10, 132, 255, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.nav-item-glass.active .nav-icon,
.nav-item-glass.active span {
  color: white;
}
```

**颜色状态表**:

| 状态 | 图标颜色 | 文字颜色 | 背景 |
|------|----------|----------|------|
| 未选中 | `var(--text-tertiary)` | `var(--text-secondary)` | 透明 |
| 悬停 | `var(--text-tertiary)` | `var(--text-secondary)` | 毛玻璃 + 模糊 |
| 选中 | 纯白 `#ffffff` | 纯白 `#ffffff` | 蓝紫渐变 + 发光阴影 |

### 5.7 标签 (Tag)

```css
.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

.tag-blue {
  background: rgba(10, 132, 255, 0.15);
  color: var(--accent-blue);
}

.tag-purple {
  background: rgba(191, 90, 242, 0.15);
  color: var(--accent-purple);
}

.tag-green {
  background: rgba(48, 209, 88, 0.15);
  color: var(--accent-green);
}

.tag-orange {
  background: rgba(255, 159, 10, 0.15);
  color: var(--accent-orange);
}
```

---

## 6. 动画规范

### 6.1 时间

| Token | 值 | 用途 |
|-------|-----|------|
| `--duration-instant` | 100ms | 微交互、按钮点击 |
| `--duration-fast` | 200ms | 悬停效果、小过渡 |
| `--duration-normal` | 300ms | 页面切换、标准过渡 |
| `--duration-slow` | 500ms | 复杂动画、模态框 |
| `--duration-slower` | 700ms | 页面加载、大动画 |

### 6.2 缓动函数

| Token | 值 | 用途 |
|-------|-----|------|
| `--ease-smooth` | `cubic-bezier(0.4, 0, 0.2, 1)` | 标准过渡 |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 弹性效果 |
| `--ease-dramatic` | `cubic-bezier(0.87, 0, 0.13, 1)` | 戏剧性过渡 |
| `--ease-spring` | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | 弹簧效果 |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | 减速 |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | 加速 |

### 6.3 关键动画

```css
/* 淡入 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 淡入 + 上移 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 缩放弹出 */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 脉冲 */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 旋转 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 渐变流动 */
@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 闪烁 */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

---

## 7. 布局规范

### 7.1 页面结构

```
┌──────────────────────────────────────────────────────────────────────┐
│  Header (56px)                                                       │
├──────────────────┬───────────────────────────────────────────────────┤
│                  │                                                   │
│  Sidebar (240px) │              Main Content                        │
│                  │                                                   │
│                  │   ┌─────────────────────────────────────────┐     │
│                  │   │                                         │     │
│                  │   │         Content Area                    │     │
│                  │   │                                         │     │
│                  │   └─────────────────────────────────────────┘     │
│                  │                                                   │
│                  │   ┌─────────────────────────────────────────┐     │
│                  │   │         AI Assistant Panel              │     │
│                  │   │         (可选, 320px)                   │     │
│                  │   └─────────────────────────────────────────┘     │
│                  │                                                   │
└──────────────────┴───────────────────────────────────────────────────┘
```

### 7.2 响应式断点

| 断点 | 宽度 | 布局变化 |
|------|------|----------|
| Desktop XL | > 1440px | 完整布局，AI面板展开 |
| Desktop | 1200px - 1440px | 标准布局 |
| Laptop | 1024px - 1200px | 侧边栏可收起 |
| Tablet | 768px - 1024px | 侧边栏隐藏，汉堡菜单 |
| Mobile | < 768px | 单栏布局，底部导航 |

### 7.3 网格系统

```css
/* 12列网格 */
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-4);
}

/* 常用列宽 */
.col-1 { grid-column: span 1; }
.col-2 { grid-column: span 2; }
.col-3 { grid-column: span 3; }
.col-4 { grid-column: span 4; }
.col-6 { grid-column: span 6; }
.col-8 { grid-column: span 8; }
.col-12 { grid-column: span 12; }
```

---

## 8. 图标规范

### 8.1 图标库

使用 **Lucide React** 图标库，风格：线性、简洁、统一。

### 8.2 图标尺寸

| 尺寸 | 用途 |
|------|------|
| 16px | 按钮内、小标签 |
| 20px | 导航项、列表项 |
| 24px | 标准图标 |
| 32px | 大按钮、功能图标 |
| 48px | 功能卡片、空状态 |

### 8.3 常用图标映射

| 功能 | 图标名称 |
|------|----------|
| 首页 | `Home` |
| 剧本 | `FileText` |
| 分镜 | `Image` / `Layout` |
| 人设 | `User` / `Users` |
| 音频 | `Music` / `Volume2` |
| 视频 | `Video` / `Play` |
| 导出 | `Download` / `Share` |
| 设置 | `Settings` / `Cog` |
| 搜索 | `Search` |
| 通知 | `Bell` |
| 用户 | `User` / `UserCircle` |
| 添加 | `Plus` |
| 编辑 | `Pencil` / `Edit` |
| 删除 | `Trash2` |
| 关闭 | `X` |
| 返回 | `ArrowLeft` |
| 更多 | `MoreHorizontal` / `MoreVertical` |
| AI/魔法 | `Sparkles` / `Wand2` |
| 生成中 | `Loader2` (旋转) |

---

## 9. 交互模式

### 9.1 微交互清单

| 元素 | 悬停 | 点击 | 其他 |
|------|------|------|------|
| 主按钮 | 亮度+10%, 发光阴影 | 缩放0.98 | 加载时旋转图标 |
| 次级按钮 | 背景变亮, 边框高亮 | 缩放0.98 | - |
| 幽灵按钮 | 背景出现 | - | - |
| 卡片 | 上浮4px, 阴影增强 | - | 选中边框 |
| 列表项 | 背景高亮 | - | 拖拽排序 |
| 输入框 | - | 边框聚焦, 发光 | 错误抖动 |
| 导航项(毛玻璃) | 毛玻璃背景+图标缩放 | 渐变背景+发光 | 图标颜色过渡 |
| 图标按钮 | 缩放1.1, 颜色变化 | 缩放0.95 | - |

### 9.2 手势支持

| 手势 | 功能 |
|------|------|
| 拖拽 | 分镜排序、文件上传 |
| 滑动 | 侧边栏收起/展开、删除确认 |
| 双指缩放 | 分镜预览、视频时间轴 |
| 长按 | 上下文菜单 |
| 下拉刷新 | 列表刷新 |

### 9.3 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `Cmd/Ctrl + K` | 命令面板/搜索 |
| `Cmd/Ctrl + N` | 新建项目 |
| `Cmd/Ctrl + S` | 保存 |
| `Cmd/Ctrl + Z` | 撤销 |
| `Cmd/Ctrl + Shift + Z` | 重做 |
| `Esc` | 关闭模态框/取消 |
| `?` | 显示快捷键帮助 |

---

## 10. 页面规范

### 10.1 登录页面

- 全屏动态背景（模糊视频或渐变）
- 居中玻璃卡片
- Logo + 标题
- 邮箱/密码输入框
- 登录按钮（主按钮）
- 第三方登录选项
- 注册链接

### 10.2 仪表盘页面 (首页)

**布局结构**:
- 左侧边栏导航（毛玻璃设计导航项）
- 顶部栏：搜索 + 通知 + 设置 + 用户头像
- 主内容区：
  - 欢迎区域：欢迎语 + 副标题 + 创建项目按钮
  - 工作流程：6个功能模块卡片（玻璃卡片）

**品牌标识**:
- Logo: 渐变背景 + Film图标 + Sparkles装饰
- 品牌名称: **AMF.io**

**导航设计**:
- 使用 `nav-item-glass` 毛玻璃导航项
- 未选中：图标 `text-tertiary`，文字 `text-secondary`
- 悬停：毛玻璃背景 + 模糊效果
- 选中：蓝紫渐变背景 + 发光阴影

### 10.3 剧本创作页面

- 三栏布局：导航 | 编辑器 | AI助手
- Markdown编辑器
- 实时预览
- AI润色按钮
- 版本历史
- 协作光标

### 10.4 分镜制作页面

- 画布式布局
- 分镜网格/列表切换
- 拖拽排序
- 缩略图预览
- 全屏查看
- AI生成分镜按钮

---

## 11. 可访问性

### 11.1 对比度

- 文字与背景对比度 >= 4.5:1
- 大文字对比度 >= 3:1
- 交互元素对比度 >= 3:1

### 11.2 焦点状态

- 所有交互元素有可见焦点指示器
- 焦点顺序符合逻辑
- 支持键盘导航

### 11.3 动画

- 支持 `prefers-reduced-motion` 媒体查询
- 重要信息不仅通过动画传达

---

## 12. 文件结构

```
frontend/src/
├── styles/
│   ├── theme.css           # CSS变量
│   ├── components.css      # 组件样式
│   ├── animations.css      # 动画
│   └── utilities.css       # 工具类
├── components/
│   ├── ui/                 # 基础UI组件
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── layout/             # 布局组件
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   └── features/           # 功能组件
├── pages/                  # 页面组件
└── hooks/                  # 自定义Hooks
```

---

## 13. 使用示例

### 13.1 创建主题文件

```css
/* styles/theme.css */
@import './variables.css';
@import './components.css';
@import './animations.css';
```

### 13.2 React组件使用

```tsx
// 使用CSS变量
<div className="glass-card">
  <h2 style={{ color: 'var(--text-primary)' }}>标题</h2>
  <p style={{ color: 'var(--text-secondary)' }}>描述文字</p>
  <button className="btn-primary">按钮</button>
</div>
```

### 13.3 动画使用

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
>
  内容
</motion.div>
```

---

**文档结束**

---

## 附录

### A. 参考资源

- [Apple Design Resources](https://developer.apple.com/design/resources/)
- [Linear Design](https://linear.app/)
- [Notion Design](https://www.notion.so/)
- [Glassmorphism Generator](https://glassmorphism.com/)

### B. 更新日志

| 日期 | 版本 | 变更 |
|------|------|------|
| 2026-02-09 | 1.0 | 初始版本 |
| 2026-02-09 | 1.1 | 更新导航项为毛玻璃设计，优化未选中状态颜色为 `text-tertiary`，品牌名称更新为 **AMF.io**，移除"核心优势"板块 |

