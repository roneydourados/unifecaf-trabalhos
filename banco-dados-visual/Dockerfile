FROM node:lts-alpine AS builder

WORKDIR /app

COPY src/package.json src/package-lock.json ./
RUN npm ci --ignore-scripts

COPY src/ ./
RUN npm run postinstall && npm run build

FROM node:lts-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=80
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=80

RUN apk add --no-cache libcap su-exec \
  && setcap 'cap_net_bind_service=+ep' /usr/local/bin/node

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

COPY --from=builder --chown=node:node /app/.output ./.output

EXPOSE 80

CMD ["/usr/local/bin/docker-entrypoint.sh"]
