FROM node:14.11-alpine

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY . .
RUN npm install

EXPOSE 8080
EXPOSE 5000

CMD ["npm", "start"]