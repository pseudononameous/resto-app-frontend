FROM node:20-alpine AS builder

WORKDIR /app

ARG VITE_API_HOST=/api
ARG VITE_API_DOMAIN=
ARG VITE_APP_NAME="RESTO APP"
ENV VITE_API_HOST=$VITE_API_HOST
ENV VITE_API_DOMAIN=$VITE_API_DOMAIN
ENV VITE_APP_NAME=$VITE_APP_NAME

COPY package.json package-lock.json* ./
RUN npm ci 2>/dev/null || npm install

COPY . .
RUN npm run build

FROM node:20-alpine

RUN npm install -g sirv-cli

COPY --from=builder /app/dist /app/dist

EXPOSE 3000

CMD ["sirv", "/app/dist", "--single", "--host", "0.0.0.0", "--port", "3000"]
