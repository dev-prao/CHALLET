FROM node:20 as build-stage
WORKDIR /challet

# pnpm 전역 설치
RUN npm install -g pnpm

# 필요한 파일만 복사 (package.json, pnpm-lock.yaml)
COPY package*.json pnpm-lock.yaml ./

# 의존성 설치
RUN pnpm install

# 소스 파일 복사
COPY . .

# 빌드 실행
RUN pnpm run build

# Nginx를 사용한 프로덕션 단계
FROM nginx:stable-alpine as production-stage

# Nginx 설정 파일 복사
COPY conf/nginx.conf /etc/nginx/nginx.conf

# 빌드 결과물을 Nginx HTML 경로로 복사
COPY --from=build-stage /challet/dist /usr/share/nginx/html
COPY --from=build-stage /challet/dev-dist /usr/share/nginx/html

# 포트 4000 노출
EXPOSE 4000

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
