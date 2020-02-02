# Get base image
FROM node:13.6.0-alpine

# Create working dir
WORKDIR /usr/src/app

# Install app dep
COPY package*.json ./

RUN npm install

# Bundle app
COPY . . 

EXPOSE 5000
