FROM node:19.4.0
WORKDIR /app
COPY . .
CMD apt-get install -y build-essential
CMD npm install -g npm@9.3.0
RUN npm install
EXPOSE 8443
ENTRYPOINT npm start
#RUN npm run build-release
#EXPOSE 48213
#CMD npm run start