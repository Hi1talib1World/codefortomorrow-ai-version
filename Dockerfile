FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 7860

ENV NODE_ENV=production
ENV PORT=7860

CMD ["npm", "start"]
