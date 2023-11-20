# Build setp
FROM node:18 AS build
WORKDIR /app
COPY . .
# Download public key for github.com
RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts
# we need to access ui-kit github private repo through ssh
RUN --mount=type=ssh npm ci
RUN if [ "$VERSION" = "prod" ]; then export VITE_APP_VERSION=$(npm pkg get version | sed 's/"//g'); else export VITE_APP_VERSION="dev"; fi; \
    VITE_APP_COMMIT=${COMMIT} \
    npm run build

# Production step
FROM nginx:1.24.0-alpine AS production
COPY spa.conf /etc/nginx/conf.d/default.conf
WORKDIR /app
COPY --from=build /app/dist ./
