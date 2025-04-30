# Use Node.js 20 as base
FROM node:18

WORKDIR /

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "run", "dev" ]
