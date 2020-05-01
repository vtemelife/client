FROM node:13.14.0-alpine
RUN apk update && apk --no-cache add make bash

RUN yarn install
RUN npm rebuild node-sass

WORKDIR /app/client
