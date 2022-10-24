FROM node:16
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app
COPY tsconfig.json /usr/src/app
COPY tsoa.json /usr/src/app
COPY src /usr/src/app/src
COPY static /usr/src/app/static

RUN npm ci
RUN npm install pm2 -g

ENV NODE_ENV production

RUN npm run tsoa && npm run build
EXPOSE 3001

CMD ["pm2-runtime","/usr/src/app/build/index.js"]
