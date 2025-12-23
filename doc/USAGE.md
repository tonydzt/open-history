# Vine of Time 使用说明

## 🎉 项目已成功启动！

Vine of Time 多视角事件记录平台已经成功创建并运行在 http://localhost:3000

## 📋 已完成的功能

### ✅ 核心功能
- ✅ 用户认证系统（NextAuth.js）
- ✅ 事件创建和管理
- ✅ 多视角叙述系统
- ✅ 响应式设计
- ✅ 现代化 UI 界面

### ✅ 页面组件
- ✅ 首页 (`/`) - 事件列表展示
- ✅ 创建事件页 (`/create`) - 受保护的创建表单
- ✅ 事件详情页 (`/event/[id]`) - 完整事件信息和视角
- ✅ 添加视角页 (`/event/[id]/perspective`) - 受保护的视角添加

### ✅ 组件系统
- ✅ 导航栏 (`Navbar`) - 用户状态和导航
- ✅ 事件卡片 (`EventCard`) - 事件预览
- ✅ 视角列表 (`PerspectiveList`) - 视角展示
- ✅ 提供者组件 (`Providers`) - 认证上下文

### ✅ 技术栈
- ✅ Next.js 15 (App Router)
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ NextAuth.js
- ✅ 模拟 API 数据

## 🚀 如何使用

### 1. 访问应用
打开浏览器访问：http://localhost:3000

### 2. 浏览事件
- 首页显示所有事件列表
- 点击事件卡片查看详情

### 3. 创建事件（需要登录）
- 点击导航栏的"创建事件"按钮
- 填写事件信息（标题、描述、时间、来源类型、图片、标签）
- 提交后跳转到事件详情页

### 4. 添加视角（需要登录）
- 在事件详情页点击"补充视角"按钮
- 分享你对事件的独特见解
- 提交后返回事件详情页

### 5. 分享功能
- 在事件详情页点击"分享"按钮
- 自动复制页面链接到剪贴板

## 🔧 配置说明

### 环境变量
复制 `env.example` 为 `.env.local` 并配置：

```bash
# 必需配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# 可选：GitHub OAuth
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# 可选：Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### OAuth 配置（可选）
1. **GitHub OAuth**：
   - 访问 https://github.com/settings/developers
   - 创建新应用
   - 设置回调 URL：`http://localhost:3000/api/auth/callback/github`

2. **Google OAuth**：
   - 访问 https://console.cloud.google.com
   - 创建项目并启用 Google+ API
   - 设置回调 URL：`http://localhost:3000/api/auth/callback/google`

## 📁 项目结构

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
├── PerspectiveList.tsx     # 视角列表
└── Providers.tsx           # 认证提供者

/lib/
├── auth.ts                 # NextAuth 配置
└── api.ts                  # API 封装函数

/types/
└── index.ts                # TypeScript 类型定义
```

## 🎨 设计特色

- **现代化 UI**：使用 Tailwind CSS 构建的响应式设计
- **用户体验**：流畅的动画和交互效果
- **移动端适配**：完全响应式，支持各种设备
- **无障碍设计**：符合 Web 可访问性标准

## 🔄 开发模式

当前运行在开发模式下，支持：
- 热重载
- 错误边界
- 开发工具
- 实时预览

## 🚀 下一步

1. **配置 OAuth**：添加真实的 GitHub 或 Google 登录
2. **连接数据库**：替换模拟数据为真实数据库
3. **部署**：部署到 Vercel、Netlify 等平台
4. **功能扩展**：添加搜索、过滤、评论等功能

## 📞 支持

如有问题，请查看：
- README.md - 详细的项目说明
- 控制台日志 - 开发时的错误信息
- Next.js 文档 - 框架使用指南

---

**享受使用 Vine of Time 记录和分享你的故事！** 📖✨
