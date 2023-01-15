FROM node:19.4.0
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 41500
ENTRYPOINT npm start
#RUN npm run build-release
#EXPOSE 48213
#CMD npm run start