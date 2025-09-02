# Chronicle - 多视角事件记录平台

Chronicle 是一个基于 Next.js 15 构建的多视角事件记录平台，允许用户记录事件并从不同角度分享见解。

## 功能特性

- 🔐 用户认证（GitHub 和 Google 登录）
- 📝 创建和编辑事件
- 🖼️ 支持图片和标签
- 👥 多视角叙述
- 📱 响应式设计
- 🎨 现代化 UI 设计

## 技术栈

- **Framework**: Next.js 15 (App Router)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Package Manager**: npm

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

创建 `.env.local` 文件并配置以下环境变量：

```env
# NextAuth.js 配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# GitHub OAuth
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
/app/
├── globals.css              # 全局样式
├── layout.tsx               # 根布局
├── page.tsx                 # 首页
├── create/
│   └── page.tsx            # 创建事件页面
└── event/
    └── [id]/
        ├── page.tsx        # 事件详情页
        └── perspective/
            └── page.tsx    # 添加视角页面

/components/
├── Navbar.tsx              # 导航栏
├── EventCard.tsx           # 事件卡片
└── PerspectiveList.tsx     # 视角列表

/lib/
├── auth.ts                 # NextAuth 配置
└── api.ts                  # API 封装函数

/types/
└── index.ts                # TypeScript 类型定义
```

## 主要功能

### 用户认证
- 支持 GitHub 和 Google 登录
- 受保护的页面路由
- 用户会话管理

### 事件管理
- 创建新事件（标题、描述、时间、来源类型、图片、标签）
- 浏览事件列表
- 查看事件详情

### 视角系统
- 为事件添加新的视角叙述
- 查看所有视角记录
- 支持富文本内容

### 分享功能
- 复制事件页面链接
- 响应式设计适配各种设备

## 开发说明

### 模拟数据
当前版本使用模拟数据和 API 函数，可以轻松替换为真实的后端服务。

### 样式系统
使用 Tailwind CSS 构建，包含自定义组件类和响应式设计。

### 类型安全
完整的 TypeScript 类型定义，确保代码质量和开发体验。

## 部署

### Vercel 部署
推荐使用 Vercel 进行部署：

```bash
npm run build
```

### 环境变量
确保在生产环境中正确配置所有必要的环境变量。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
