# Google OAuth 登录配置指南

为了使您的应用程序能够使用Google登录功能，您需要在Google Cloud Console中创建一个OAuth 2.0客户端ID和密钥。请按照以下步骤操作：

## 步骤1：访问Google Cloud Console

1. 打开浏览器并访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 如果您还没有Google账户，请先创建一个
3. 登录您的Google账户

## 步骤2：创建或选择项目

1. 在控制台顶部的项目选择器中，选择一个现有项目或点击 "新建项目"
2. 如果创建新项目，请输入项目名称和位置，然后点击 "创建"
3. 等待项目创建完成（这可能需要几秒钟时间）

## 步骤3：启用Google API

1. 在左侧导航菜单中，点击 "API和服务" > "库"
2. 在搜索框中输入 "Google People API" 并按回车
3. 点击 "Google People API" 结果
4. 点击 "启用" 按钮

## 步骤4：创建OAuth客户端ID

1. 在左侧导航菜单中，点击 "API和服务" > "凭据"
2. 点击顶部的 "创建凭据" 按钮，选择 "OAuth客户端ID"
3. 如果这是您第一次创建OAuth客户端ID，您需要配置同意屏幕：
   - 点击 "配置同意屏幕" 按钮
   - 选择 "外部" 作为用户类型，然后点击 "创建"
   - 填写必要的应用信息：应用名称、用户支持电子邮件、开发者联系电子邮件
   - 点击 "保存并继续"
   - 对于范围，点击 "添加或移除范围"，选择必要的范围（通常至少需要 `.../auth/userinfo.email` 和 `.../auth/userinfo.profile`），然后点击 "更新"
   - 点击 "保存并继续" 直到完成配置

4. 返回创建OAuth客户端ID的页面：
   - 选择 "Web应用程序" 作为应用类型
   - 输入一个名称（例如：`Chronicle Web App`）
   - 在 "已获授权的JavaScript来源" 部分，添加：
     - `http://localhost:3000`（用于本地开发）
     - 您的生产网站URL（如果适用）
   - 在 "已获授权的重定向URI" 部分，添加：
     - `http://localhost:3000/api/auth/callback/google`（用于本地开发）
     - 您的生产网站的相应重定向URI（如果适用），格式为 `https://your-domain.com/api/auth/callback/google`
   - 点击 "创建" 按钮

## 步骤5：配置环境变量

1. Google Cloud Console将显示您的客户端ID和客户端密钥
2. 复制这些值
3. 打开您项目中的 `.env.local` 文件
4. 取消注释或添加以下行，并替换为您刚刚获取的值：
   ```
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```
5. 保存 `.env.local` 文件
6. 重启您的开发服务器以使更改生效

## 步骤6：验证配置

1. 打开您的应用程序
2. 导航到登录页面
3. 您应该能够看到 "继续使用 Google" 的登录选项
4. 点击该选项并按照提示完成登录过程

## 注意事项

- 确保在生产环境中使用适当的域名配置
- 保护您的客户端密钥，不要将其泄露或提交到代码仓库
- 如果您的应用程序要面向公众使用，可能需要通过Google的OAuth审核流程

如果您在配置过程中遇到任何问题，请参考[NextAuth.js的官方Google提供商文档](https://next-auth.js.org/providers/google)获取更多帮助。