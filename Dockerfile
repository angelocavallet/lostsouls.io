FROM node:19.4.0
EXPOSE 8443
WORKDIR .
COPY . .
CMD apt-get install -y build-essential
RUN npm install
#CMD npm install -g npm@9.3.0
ENTRYPOINT npm start
#RUN npm run build-release
#EXPOSE 48213
#CMD npm run start