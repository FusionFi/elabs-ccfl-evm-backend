FROM node:18-alpine

WORKDIR /web-app

COPY package.json ./
COPY yarn.lock ./
# install dependencies
RUN yarn install
# Bundle app source
COPY . .
# build pro source
RUN yarn run build
EXPOSE 3000
CMD ["yarn", "start"]
