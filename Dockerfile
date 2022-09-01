FROM ubuntu:20.04
MAINTAINER Miso Wei <miso.cc.wei@mail.foxconn.com>

RUN apt-get update -y && apt-get install nginx -y

RUN apt-get install -y curl

RUN apt-get install -y build-essential

RUN apt-get install -y sudo

RUN curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
RUN apt-get install -y nodejs

# Source code copy
COPY ./www /media/www
COPY ./public /media/public
COPY ./schema /media/schema
COPY ./dist/ /usr/share/nginx/html/

# Remove the default nginx.conf
RUN rm /etc/nginx/sites-enabled/default

# Replace with our own nginx.conf
COPY nginx.conf /etc/nginx/sites-enabled/
COPY start.sh /media/start.sh

RUN mkdir /media/storage
RUN mkdir /media/logs
RUN chmod 777 /media/storage
RUN chmod 777 /media/logs

# Build dist
WORKDIR /media/

EXPOSE 80 443
CMD ["/media/start.sh"]