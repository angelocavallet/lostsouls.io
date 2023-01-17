FROM node:19.4.0
EXPOSE 8443

WORKDIR /opt/lostsouls-server/

COPY package.json .
RUN npm install

COPY . .
    #-g npm@9.3.0


ENTRYPOINT npm start