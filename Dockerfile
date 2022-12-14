FROM node as builder
WORKDIR /app
COPY . .
RUN \
  yarn install --frozen-lockfile && \
  yarn build

FROM alpine as runner
ENV \
  # APP
  NODE_ENV="development" \
  PORT="3000" \
  SERVERS="" \
  # DB
  DB_LIMIT=50 \
  DB_POSTGRES="postgresql://postgres:postgres@localhost:5432/contentor-api-user" \
  DB_ELASTICSEARCH="http://localhost:9200"
RUN apk add --update nodejs
WORKDIR /app
COPY --from=builder /app/dist/ /app/
EXPOSE ${PORT}
CMD node index.js