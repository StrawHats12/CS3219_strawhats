FROM node:14

# Arg variables
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG REDIS_HOST
ARG MUX_TOKEN_ID
ARG MUX_TOKEN_SECRET

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# Env variables
ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
ENV REDIS_HOST=$REDIS_HOST
ENV MUX_TOKEN_ID=$MUX_TOKEN_ID
ENV MUX_TOKEN_SECRET=$MUX_TOKEN_SECRET

# If you are building your code for production
RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 9000
CMD [ "node", "server.js" ]