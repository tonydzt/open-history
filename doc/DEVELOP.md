# 开发流程
1. 先给需求描述，让ai升级需求，生成md需求文档
2. 根据本需求的数据库设计，生成数据库表结构，通过npx prisma introspect和npx prisma generate命令，同步本地模型并生成类型
3. 根据本地模型，生成po类型文件