# 前端部署

两个独立的 Compose 文件，按需选一个用。

## 1. 本地 Gateway（GoLand）

Gateway 在宿主机跑，不需要后端 Docker，也不需要 `chenaqi-net`：

```bash
cd frontend/deploy
docker compose -f docker-compose.local.yml up -d --build
```

代理目标：`http://host.docker.internal:9000`

## 2. 加入后端网络

先启后端（创建 `chenaqi-net`）：

```bash
cd backend/deploy
docker compose up -d --build
```

再启前端：

```bash
cd frontend/deploy
docker compose -f docker-compose.network.yml up -d --build
```

代理目标：`http://gateway:9000`（同一 Docker 网络内按容器名访问）

浏览器访问：`http://localhost:3000`
