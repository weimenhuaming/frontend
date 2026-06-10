FROM docker.m.daocloud.io/library/node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG NUXT_API_PROXY_TARGET=http://gateway:9000
ENV NUXT_API_PROXY_TARGET=${NUXT_API_PROXY_TARGET}

RUN npm run build

FROM docker.m.daocloud.io/library/node:22-alpine

WORKDIR /app

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
