FROM node:19

# pasta para aonde vai o build
#ENV NODE_OPTIONS="--max-old-space-size=4096"
WORKDIR /app

COPY . .
RUN npm i -force
EXPOSE 3000

CMD ["npm", "start"]

