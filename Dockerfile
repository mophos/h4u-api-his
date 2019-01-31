FROM keymetrics/pm2:latest-alpine

LABEL maintainer="Naphattharawat <naphattharawat@gmail.com>"

WORKDIR /home/h4u

RUN npm i npm@latest -g 


RUN  apk add --no-cache --virtual deps \
    python \
    build-base 

COPY ./dist/ .

COPY ./package.json .

RUN npm i

RUN npm init -y && npm i express

COPY ./process.json .

CMD  ["pm2-runtime","start","process.json"] 

EXPOSE 3318