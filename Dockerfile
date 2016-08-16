FROM mhart/alpine-node
MAINTAINER Karel Ploc "karelploc@gmail.com"
# define working directory

WORKDIR /src
VOLUME /src

# start app
CMD npm install && npm install -g forever && npm run env-dev && npm run forever