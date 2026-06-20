# 前端 Docker 部署

完整说明见上级目录 [README.md](../README.md#docker-部署)。

## 本地 Gateway（GoLand）

前端独立运行，代理到宿主机 `9000`：

```bash
docker compose -f docker-compose.local.yml up -d --build
```

## 接入后端 Docker 网络

前后端共用 `chenaqi-net`，**谁先启动都可以**：

```bash
# 只启后端
cd ../../backend/deploy && docker compose up -d --build

# 只启前端（顺序任意）
cd ../../frontend/deploy
docker compose -f docker-compose.network.yml up -d --build
```

- 仅前端：页面可开，API 需等 gateway
- 仅后端：Gateway 在跑，浏览器访问 http://localhost:9000
- 两者都启：http://localhost:3000 完整联调

---

## 生产环境（阿里云 Ubuntu · chena7.cn）

服务器目录建议：

```
~/chenaqiweb/              # 代码
├── backend/
└── frontend/

~/docker/chenaqiweb/       # 即 /home/docker/chenaqiweb
├── etcd/
├── mysql/
├── redis/
├── chroma/
├── knowledge/             # Agent 知识库
├── gateway/static/        # 头像、博客图片上传
│   ├── avatars/
│   └── blog/
└── nginx/ssl/             # HTTPS 证书
```

### 1. 安装 Docker

```bash
sudo apt update
sudo apt install -y ca-certificates curl
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
# 重新登录 SSH 使 docker 组生效
```

### 2. 上传代码

在本地打包或通过 git 拉取到服务器：

```bash
mkdir -p ~/chenaqiweb
cd ~/chenaqiweb
git clone <你的后端仓库地址> backend
git clone <你的前端仓库地址> frontend
```

### 3. 初始化数据目录与配置

```bash
# 创建挂载目录（路径已写在 docker-compose.prod.yml 中）
mkdir -p /home/docker/chenaqiweb/{etcd,mysql,redis,chroma,knowledge,gateway/static/avatars,gateway/static/blog,nginx/ssl}

# 首次部署：复制 Agent 知识库
cp -r ~/chenaqiweb/backend/other-rpc/data/knowledge/* /home/docker/chenaqiweb/knowledge/

# 后端：Agent API 密钥（other-rpc/.env）+ MySQL/Redis 密码（deploy/docker-compose.prod.yml 各服务）
cd ~/chenaqiweb/backend/other-rpc
cp .env.example .env
nano .env   # 填写 LLMAPIKEY、DASHSCOPE_API_KEY
```

### 4. 配置域名解析

在阿里云域名控制台，将 `chena7.cn` 和 `www.chena7.cn` 的 A 记录指向服务器公网 IP。

### 5. 启动服务（顺序任意）

前后端共用 Docker 网络 `chenaqi-net`（同名自动创建或加入），**谁先启动都可以**，互不阻塞。

```bash
# 只启前端
cd ~/chenaqiweb/frontend/deploy
docker compose -f docker-compose.prod.yml up -d --build

# 只启后端（顺序任意）
cd ~/chenaqiweb/backend/deploy
docker compose -f docker-compose.prod.yml up -d --build
```

- 仅前端：页面可访问，API 暂不可用
- 仅后端：Gateway 在跑，但没有 Nginx 对外入口
- 两者都启：完整功能

浏览器访问：http://chena7.cn

### 6. 配置 HTTPS（推荐）

**方式 A：阿里云免费 SSL 证书**

1. 在阿里云 SSL 证书服务申请免费证书（域名填 `chena7.cn`）
2. 下载 Nginx 格式证书，上传到服务器：

```bash
mkdir -p /home/docker/chenaqiweb/nginx/ssl
# 上传证书到 /home/docker/chenaqiweb/nginx/ssl/
#   chena7.cn.pem  /  chena7.cn.key
```

3. 编辑 `nginx/nginx.conf`，取消 HTTPS `server` 块注释
4. 重启 Nginx：

```bash
cd ~/chenaqiweb/frontend/deploy
docker compose -f docker-compose.prod.yml restart nginx
```

**方式 B：Certbot 自动续期**

```bash
sudo apt install -y certbot
sudo certbot certonly --standalone -d chena7.cn -d www.chena7.cn
sudo cp /etc/letsencrypt/live/chena7.cn/fullchain.pem /home/docker/chenaqiweb/nginx/ssl/chena7.cn.pem
sudo cp /etc/letsencrypt/live/chena7.cn/privkey.pem /home/docker/chenaqiweb/nginx/ssl/chena7.cn.key
```

然后同样取消 `nginx.conf` 中 HTTPS 配置并重启 nginx。

### 7. 防火墙

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

阿里云安全组也需放行 **80、443**（以及 SSH 22）。

### 8. 常用运维命令

```bash
# 查看日志
docker compose -f docker-compose.prod.yml logs -f nginx
docker compose -f docker-compose.prod.yml logs -f frontend

# 更新代码后重新构建
cd ~/chenaqiweb/backend/deploy
docker compose -f docker-compose.prod.yml up -d --build

cd ~/chenaqiweb/frontend/deploy
docker compose -f docker-compose.prod.yml up -d --build

# 停止
docker compose -f docker-compose.prod.yml down
```

### 9. 备案信息

页脚已展示域名 [chena7.cn](https://chena7.cn) 与备案号 **浙ICP备2025156531号-1**（链接至 https://beian.miit.gov.cn/）。
