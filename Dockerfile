FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    openssl

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000 8080

CMD ["npm", "start"]