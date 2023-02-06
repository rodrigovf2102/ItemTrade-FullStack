FROM node:19

ENV NODE_OPTIONS="--max-old-space-size=2048"
WORKDIR /app

COPY . .
RUN npm i -force
EXPOSE 3000

CMD ["npm", "start"]

