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
/
├── .env                    # 环境变量配置
├── .gitignore              # Git忽略文件配置
├── README.md               # 项目说明文档
├── app/                    # Next.js App Router目录
│   ├── [locale]/           # 国际化路由
│   │   ├── auth/           # 认证相关页面
│   │   ├── create/         # 创建事件页面
│   │   ├── error.tsx       # 错误页面
│   │   ├── event/          # 事件相关页面
│   │   ├── globals.css     # 全局样式
│   │   ├── layout.tsx      # 根布局
│   │   ├── loading.tsx     # 加载状态页面
│   │   ├── page.tsx        # 首页
│   │   ├── privacy/        # 隐私政策页面
│   │   └── terms/          # 服务条款页面
│   ├── api/                # API路由
│   │   ├── auth/           # 认证API
│   │   ├── events/         # 事件相关API
│   │   └── storage/        # 存储相关API
│   └── api-test/           # API测试页面
├── components/             # React组件
│   ├── DeleteEventButton.tsx       # 删除事件按钮
│   ├── DropdownMenu.tsx            # 下拉菜单组件
│   ├── EventActionsMenu.tsx        # 事件操作菜单
│   ├── EventCard.tsx               # 事件卡片
│   ├── EventImageUploader.tsx      # 事件图片上传器
│   ├── GoogleAnalytics.tsx         # Google Analytics集成
│   ├── ImageUploader.tsx           # 图片上传器
│   ├── LeafletMapWrapper.tsx       # Leaflet地图包装器
│   ├── MapComponent.tsx            # 地图组件
│   ├── Navbar.tsx                  # 导航栏
│   ├── PerspectiveList.tsx         # 视角列表
│   ├── Providers.tsx               # 提供者组件
│   ├── StaticMapWrapper.tsx        # 静态地图包装器
│   └── index.ts                    # 组件导出
├── doc/                    # 文档目录
│   ├── DATABASE_GUIDE.md           # 数据库指南
│   ├── GOOGLE_OAUTH_GUIDE.md       # Google OAuth指南
│   ├── TIMELINE_FEATURE_DESIGN.md  # 时间轴功能设计文档
│   └── USAGE.md                    # 使用指南
├── i18n/                   # 国际化配置
│   ├── messages/           # 翻译消息
│   │   ├── common/         # 通用翻译
│   │   ├── components/     # 组件翻译
│   │   └── pages/          # 页面翻译
│   ├── navigation.ts       # 导航国际化
│   ├── request.ts          # 请求国际化
│   └── routing.ts          # 路由国际化
├── lib/                    # 工具库
│   ├── api.ts              # API封装函数
│   ├── auth.ts             # 认证相关工具
│   └── db.ts               # 数据库连接
├── middleware.ts           # 中间件
├── next-env.d.ts           # Next.js环境类型声明
├── next.config.js          # Next.js配置
├── package-lock.json       # 依赖锁文件
├── package.json            # 项目依赖和脚本
├── postcss.config.js       # PostCSS配置
├── prisma/                 # Prisma ORM
│   ├── migrations/         # 数据库迁移
│   └── schema.prisma       # 数据库模型定义
├── public/                 # 静态资源
├── scripts/                # 脚本工具
├── start-dev.js            # 开发服务器启动脚本
├── tailwind.config.js      # Tailwind CSS配置
├── tsconfig.json           # TypeScript配置
└── types/                  # 类型定义
    ├── index.ts            # 主要类型定义
    ├── map.ts              # 地图相关类型
    └── next-auth.d.ts      # NextAuth类型扩展
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
