# Chenaqi Frontend · 博客前端

基于 [Nuxt 4](https://nuxt.com/) 的个人博客前端，配合 [go-zero 后端](../backend/) 使用。采用 **SSR + 同源 API 代理**，提供博客阅读、用户中心、后台管理与互动能力。

注意：该 README.md 内容当前由 AI 生成，仅供参考

---

## 架构概览

```
 Browser
    │
    │  http://localhost:3000
    ▼
┌─────────────────────────────────────┐
│           Nuxt Frontend             │
│  ┌─────────┐    routeRules proxy    │
│  │  Pages  │ ─────────────────────► │──► /api/** ──► Gateway :9000
│  │Components│                        │
│  └─────────┘                         │
│  Pinia (auth) · Composables · API   │
└─────────────────────────────────────┘
```

浏览器只访问前端域名/端口，所有 `/api/**` 请求由 Nuxt 服务端代理转发到 Go Gateway，避免开发环境 CORS 问题。

| 环境 | 代理目标 | 说明 |
|------|----------|------|
| 本地开发 | `http://127.0.0.1:9000` | `npm run dev`，Gateway 在宿主机 |
| Docker + 宿主机 Gateway | `http://host.docker.internal:9000` | `docker-compose.local.yml` |
| Docker + 后端容器 | `http://gateway:9000` | `docker-compose.network.yml`，加入 `chenaqi-net` |

---

## 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | Nuxt 4 · Vue 3 |
| 状态管理 | Pinia |
| 路由 | Vue Router 5（Nuxt 文件路由） |
| HTTP | `$fetch` / `ofetch`（封装于 `app/api/http.ts`） |
| Markdown | marked |
| 样式 | 原生 CSS（`main.css` / `admin.css` / `auth.css`） |
| 运行时 | Node.js 22（Docker 构建） |

---

## 功能模块

### 公开页面

| 路由 | 说明 |
|------|------|
| `/` | 首页 Bento 布局（时钟、日历、音乐、推荐等） |
| `/blog` | 博客列表 |
| `/blog/:id` | 文章详情（Markdown 渲染、目录、评论、点赞） |
| `/about` | 关于页 |
| `/agent` | 站内助手（占位，开发中） |
| `/auth/login` | 登录 / 注册 / 重置密码 |

### 用户后台（需登录）

| 路由 | 中间件 | 说明 |
|------|--------|------|
| `/admin/profile` | `dashboard` | 个人资料、头像上传 |
| `/admin/likes` | `dashboard` | 点赞文章列表 |
| `/admin/my-articles` | `dashboard` | 我的文章 |

### 管理员后台（需 admin 角色）

| 路由 | 中间件 | 说明 |
|------|--------|------|
| `/admin/categories` | `admin` | 分类管理 |
| `/admin/articles` | `admin` | 全站博客列表 |
| `/admin/article/create` | `admin` | 新建 / 编辑文章 |

---

## 项目结构

```
frontend/
├── app/
│   ├── api/              # 后端 API 封装
│   │   ├── http.ts       # 统一请求、Token、响应解析
│   │   ├── auth.ts       # 登录、注册、验证码
│   │   ├── article.ts    # 文章 CRUD、搜索
│   │   ├── category.ts   # 分类
│   │   ├── comment.ts    # 评论
│   │   ├── interaction.ts# 点赞、浏览
│   │   ├── user.ts       # 用户资料
│   │   └── upload.ts     # 头像 / 博客图片上传
│   ├── components/       # 通用与业务组件
│   ├── composables/      # useAuth、useLikeToggle 等
│   ├── layouts/          # default / home / admin
│   ├── middleware/       # auth / admin / dashboard
│   ├── pages/            # 文件路由页面
│   ├── plugins/          # auth.client.ts 启动时 hydrate
│   ├── stores/           # Pinia auth store
│   └── utils/            # markdown、media、validation
├── deploy/
│   ├── docker-compose.local.yml    # 容器 → 宿主机 Gateway
│   └── docker-compose.network.yml  # 容器 → 后端 Docker 网络
├── public/               # 静态资源
├── nuxt.config.ts        # 代理、路由规则、运行时配置
├── Dockerfile            # 多阶段构建 → .output
└── package.json
```

---

## 快速开始

### 环境要求

- Node.js 18+（推荐 22）
- 后端 Gateway 已启动（默认 `http://127.0.0.1:9000`）

### 本地开发

```bash
cd frontend
npm install
npm run dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000)。

其他命令：

```bash
npm run build    # 生产构建
npm run preview  # 预览构建结果
npm run generate # 静态站点生成（如需要）
```

---

## Docker 部署

提供两个独立的 Compose 文件，按需选择。

### 方式一：Gateway 在宿主机（GoLand 本地调试）

前端跑容器，后端在 IDE 里启动，**不需要** `chenaqi-net`：

```bash
cd frontend/deploy
docker compose -f docker-compose.local.yml up -d --build
```

代理目标：`http://host.docker.internal:9000`

### 方式二：接入后端 Docker 网络

先启动后端（创建 `chenaqi-net`）：

```bash
cd backend/deploy
docker compose up -d --build
```

再启动前端：

```bash
cd frontend/deploy
docker compose -f docker-compose.network.yml up -d --build
```

代理目标：`http://gateway:9000`

浏览器访问 [http://localhost:3000](http://localhost:3000)。

### 自定义代理地址

`NUXT_API_PROXY_TARGET` 在 **构建时** 写入 Nuxt 配置，修改后需重新 build：

```bash
docker compose -f docker-compose.local.yml build \
  --build-arg NUXT_API_PROXY_TARGET=http://host.docker.internal:9000
docker compose -f docker-compose.local.yml up -d
```

---

## API 与认证

### 请求封装

`app/api/http.ts` 统一处理：

- `baseURL`：来自 `runtimeConfig.public.apiBase`（默认 `/api`）
- `Authorization`：从 `localStorage` 读取 access token
- 响应格式：解析 `{ code, msg, data }`，`code !== 200` 时抛错

### 认证流程

1. 登录成功后写入 Pinia + `localStorage`（user、access_token、refresh_token）
2. `plugins/auth.client.ts` 在客户端启动时 `hydrate` 恢复会话
3. 需登录页面使用 `middleware: 'auth'` 或 `'dashboard'`
4. 管理员页面额外使用 `middleware: 'admin'` 校验 `role === 'admin'`
5. 退出时调用 `/api/logout` 并清除本地状态

### 静态资源

Gateway 返回的 `/static/avatars/`、`/static/blog/` 路径经 `resolveMediaUrl()` 转为 `/api/static/...` 同源访问。

---

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `NUXT_API_PROXY_TARGET` | `http://127.0.0.1:9000` | 构建时 `/api/**` 代理目标（Docker 通过 build-arg 传入） |
| `NUXT_PUBLIC_API_BASE` | `/api` | 前端请求后端的 baseURL |
| `NUXT_HOST` | — | Docker 运行时监听地址（默认 `0.0.0.0`） |
| `NUXT_PORT` | `3000` | Docker 运行时端口 |

`nuxt.config.ts` 中的关键配置：

```ts
routeRules: {
  '/api/**': { proxy: `${apiProxyTarget}/**` },
  '/user': { redirect: '/admin/profile' },
}
```

---

## 页面与布局

| 布局 | 用途 |
|------|------|
| `home` | 博客首页、文章、登录等公开页（侧边栏 + Bento 风格） |
| `admin` | 后台管理（侧边导航 + 内容区） |
| `default` | 默认布局 |

主要组件包括 `HomeSidebar`、`CommentSection`、`LikeButton`、`UserAvatar`、`AdminArticleListItem` 等。

---

## 与后端联调清单

1. 启动 Gateway（`:9000`）及依赖的 core-rpc、MySQL、Redis、etcd
2. 前端 `npm run dev` 或 Docker 启动
3. 注册 / 登录验证 JWT 流程
4. 创建分类 → 发布文章 → 前台浏览与评论
5. 头像 / 博客图片上传验证 `/api/upload/*`

---

## 常见问题

<details>
<summary><strong>API 请求 404 或连接失败？</strong></summary>

确认 Gateway 已在 `9000` 端口运行。Docker 场景检查 `NUXT_API_PROXY_TARGET` 是否与 Gateway 实际地址一致，且镜像已重新 build。
</details>

<details>
<summary><strong>network chenaqi-net not found？</strong></summary>

使用 `docker-compose.network.yml` 前须先启动 `backend/deploy` 创建网络。仅联调宿主机 Gateway 时改用 `docker-compose.local.yml`。
</details>

<details>
<summary><strong>登录后刷新页面丢失状态？</strong></summary>

检查浏览器是否禁用 localStorage。`auth.client.ts` 会在客户端启动时从 localStorage 恢复会话。
</details>

<details>
<summary><strong>图片 / 头像无法显示？</strong></summary>

确认 Gateway 静态目录有文件，且路径经 `resolveMediaUrl` 转为 `/api/static/...` 可访问。
</details>

<details>
<summary><strong>前后端分域部署？</strong></summary>

设置 `NUXT_PUBLIC_API_BASE` 为后端完整 API 地址，并确保 Gateway 正确处理 CORS 与 OPTIONS 预检。
</details>

---

## License

Private project — 仅供本项目使用。
