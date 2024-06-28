<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## 介绍

这是一个使用 [Nest](https://github.com/nestjs/nest)  框架的 TypeScript 启动项目。

## 安装

在开始之前，请确保您的环境满足以下要求：

1. Node.js 版本 18 及以上
2. 已安装 pnpm 包管理器

您可以使用以下命令来检查和安装这些依赖：

```bash
# 检查 Node.js 版本
node -v

# 安装 pnpm
npm install -g pnpm
```

## 安装依赖

使用 pnpm 安装项目依赖：
```bash
$ pnpm install
```

### 配置 Prisma

安装完成后，需要配置 Prisma。

#### 创建 **.env** 文件并添加以下内容：

 ```bash
        # Environment variables declared in this file are automatically made available to Prisma.
        # See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema
        
        # Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
        # See the documentation for all the connection string options: https://pris.ly/d/connection-strings
        
        DATABASE_URL="mysql://root:root@localhost:3306/testdb"
        
        # RCON链接地址
        RCON_HOST="ip地址"
        RCON_PORT="端口"
        RCON_PASSWORD="RCON密码"
```
如何打开[RCON模式？](https://www.iecraft.com/news/rcon.html) 

#### 运行 Prisma 命令来初始化数据库：
```bash
$ pnpm prisma migrate dev --name init
$ pnpm prisma generate
```

运行应用

使用以下命令启动应用：

```bash
# 开发模式
$ pnpm start

# 监听模式
$ pnpm start:dev

# 生产模式
$ pnpm start:prod
```




