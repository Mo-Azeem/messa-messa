FROM node:alpine

WORKDIR /messa

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3002

RUN npm run build

CMD ["npm", "start"]