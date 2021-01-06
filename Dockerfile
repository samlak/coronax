FROM node:12.18.1
WORKDIR /src
COPY package.json .env /src
RUN npm install
COPY . /src
CMD [ "npm", "start" ]
EXPOSE 3100