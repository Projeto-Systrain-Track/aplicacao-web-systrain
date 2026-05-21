FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production \
    AMBIENTE_PROCESSO=desenvolvimento \
    APP_HOST=0.0.0.0 \
    APP_PORT=3333

COPY package*.json ./
RUN npm ci --omit=dev

COPY app.js ./app.js
COPY src ./src
COPY public ./public

EXPOSE 3333

CMD ["npm", "start"]