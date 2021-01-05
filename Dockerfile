FROM node:14

WORKDIR /app

COPY package.json .

RUN npm i

COPY . .

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["npm"]

CMD ["run", "start:prod"]
