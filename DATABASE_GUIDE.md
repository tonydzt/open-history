# 数据库配置与使用指南

本指南将帮助你配置项目的数据库连接，特别是连接到Vercel的云数据库。

## 1. 数据库架构

项目使用Prisma ORM连接数据库，支持SQLite（本地开发）和PostgreSQL（生产环境/Vercel）。

数据库模型主要包含以下实体：
- User: 用户信息
- Event: 事件信息
- Perspective: 事件视角（评论/观点）
- Account/Session: 认证相关

## 2. 本地开发配置

### 2.1 配置环境变量

在项目根目录创建或编辑 `.env.local` 文件，添加数据库连接配置：

```env
# 默认使用SQLite数据库（适合本地开发）
DATABASE_URL="file:./dev.db"

# 也可以使用PostgreSQL（需要本地安装PostgreSQL）
# DATABASE_URL="postgresql://username:password@localhost:5432/open-history?schema=public"
```

### 2.2 初始化数据库

运行以下命令初始化数据库（创建表结构并导入示例数据）：

```bash
# 使脚本可执行
chmod +x init-db.sh

# 运行初始化脚本
./init-db.sh
```

该脚本会自动完成以下操作：
- 安装项目依赖
- 生成Prisma Client
- 创建数据库表结构
- 导入示例数据

## 3. 连接Vercel云数据库

### 3.1 在Vercel控制台配置

1. 登录Vercel控制台，进入你的项目
2. 点击顶部导航栏的 "Settings"（设置）
3. 在侧边栏中选择 "Environment Variables"（环境变量）
4. 点击 "Add" 按钮添加新的环境变量

### 3.2 设置DATABASE_URL环境变量

- **Name**: `DATABASE_URL`
- **Value**: 从Vercel提供的PostgreSQL数据库获取连接URL
- **Environment**: 选择 "Production", "Preview", "Development"（或根据需要选择）

Vercel的PostgreSQL连接URL格式通常如下：
```
postgresql://username:password@host:port/database?sslmode=require
```

### 3.3 部署时的自动迁移

Vercel部署时，Prisma会自动使用你配置的`DATABASE_URL`连接到云数据库。

你可以在Vercel的部署设置中配置 `build` 命令来运行数据库迁移：

```bash
npx prisma migrate deploy && npm run build
```

## 4. 数据库操作命令

### 生成Prisma Client
```bash
npx prisma generate
```

### 创建新的迁移
```bash
npx prisma migrate dev --name migration_name
```

### 查看数据库状态
```bash
npx prisma studio
```

### 手动运行种子数据
```bash
npx ts-node seed-db.ts
```

## 5. 注意事项

1. **安全性**：不要在代码库中硬编码数据库连接字符串，始终使用环境变量
2. **版本控制**：`.env.local`文件已被添加到`.gitignore`中，不会被提交到版本控制系统
3. **Vercel部署**：确保在Vercel控制台正确设置了`DATABASE_URL`环境变量
4. **本地开发**：如果你更改了`prisma/schema.prisma`文件，需要重新运行`npx prisma generate`和`npx prisma migrate dev`
5. **时区问题**：注意处理好前端展示时间和数据库存储时间的时区转换

## 6. 常见问题排查

### 连接失败
- 检查`.env.local`中的`DATABASE_URL`是否正确
- 确保PostgreSQL服务器正在运行
- 验证防火墙设置允许连接

### 迁移错误
- 如果遇到迁移错误，可以尝试先重置数据库：`npx prisma migrate reset`
- 然后重新创建迁移：`npx prisma migrate dev --name init`

### Prisma Client错误
- 确保运行了`npx prisma generate`
- 检查依赖是否正确安装：`npm install`
- 尝试删除`node_modules`和`package-lock.json`，然后重新安装依赖

## 7. 相关文件

- `prisma/schema.prisma`: 数据库模型定义
- `lib/db.ts`: Prisma Client实例导出
- `seed-db.ts`: 数据库种子数据脚本
- `init-db.sh`: 数据库初始化脚本

如果需要更多帮助，请参考[Prisma官方文档](https://www.prisma.io/docs)或[Vercel数据库文档](https://vercel.com/docs/storage)。