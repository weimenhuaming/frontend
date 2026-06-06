# 前端 Docker 部署

完整说明见上级目录 [README.md](../README.md#docker-部署)。

## 本地 Gateway（GoLand）

```bash
docker compose -f docker-compose.local.yml up -d --build
```

## 接入后端 Docker 网络

```bash
# 先启后端
cd ../../backend/deploy && docker compose up -d --build

# 再启前端
cd ../../frontend/deploy
docker compose -f docker-compose.network.yml up -d --build
```

浏览器访问：http://localhost:3000
