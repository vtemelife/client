FROM nginx:1.15.10-alpine
RUN apk update && apk --no-cache add bash

COPY ./build /www
COPY ./compose/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./compose/ssl /etc/nginx/ssl

WORKDIR /app/client
