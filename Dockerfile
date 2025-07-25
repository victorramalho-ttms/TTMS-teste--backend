FROM node:20.15-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN mkdir -p uploads && chmod 777 uploads

EXPOSE 3001
CMD ["npm", "start"]
