FROM node:6.7.0
MAINTAINER Karel Ploc "karelploc@gmail.com"
# define working directory

WORKDIR /src
VOLUME /src

RUN mkdir /flyway; \
    cd /flyway; \
    wget https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/4.0.3/flyway-commandline-4.0.3-linux-x64.tar.gz; \
    tar -xvzf flyway-commandline-4.0.3-linux-x64.tar.gz; \
    rm -rf flyway-commandline-4.0.3-linux-x64.tar.gz; \
    cd /src;


ENV PATH "$PATH:/flyway/flyway-4.0.3"

RUN npm install
RUN npm install -g forever
RUN npm run compile

# start app
CMD npm run forever