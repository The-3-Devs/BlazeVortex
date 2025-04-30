FROM node:22-slim

WORKDIR /

COPY package*.json ./
RUN npm install --production

COPY . .

ENV PORT=8080
EXPOSE 8080

# Start the app
CMD ["npm", "run", "dev"]
