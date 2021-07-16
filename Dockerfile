FROM node:alpine as builder

WORKDIR /app

COPY package*.json ./
COPY yarn.lock .
COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN yarn install
RUN yarn prisma:generate
RUN yarn build

FROM node:alpine

WORKDIR /app

COPY package*.json ./
COPY yarn.lock .

COPY --from=builder /app/node_modules ./node_modules 
COPY --from=builder /app/dist ./dist

WORKDIR /app

EXPOSE 4000

CMD ["node", "dist/index.js"]
