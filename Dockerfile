FROM node:14-alpine

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm ci

COPY . .

RUN npm run build

RUN npm prune --production

CMD ["node", "dist/apps/api/main"]
