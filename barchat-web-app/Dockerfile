# web
FROM node:4
MAINTAINER simon@ifwe.co

#ENV NODE_ENV stage
ENV NODE_ENV production

ADD ./ /usr/local/src/barchat-web-app/
RUN apt-get -y update

WORKDIR /usr/local/src/barchat-web-app/
RUN  rm -rf  /usr/local/src/node_modules && npm install
CMD npm start
