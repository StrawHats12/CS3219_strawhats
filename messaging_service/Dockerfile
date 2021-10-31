FROM node:14.11-alpine

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY . .
RUN npm install

EXPOSE 8081
EXPOSE 5050

CMD ["npm", "start"]