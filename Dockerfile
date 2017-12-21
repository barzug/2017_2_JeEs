FROM nginx:alpine

USER root

RUN apk update && apk add bash nodejs

EXPOSE 80

COPY quoridor-nginx.conf /etc/nginx/conf.d/
RUN rm /etc/nginx/conf.d/default.conf

RUN npm build
COPY dist var/www
