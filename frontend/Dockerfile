FROM node:19

# pasta para aonde vai o build
ENV NODE_OPTIONS="--max-old-space-size=4096"
WORKDIR /app

COPY . .
RUN npm i -force
RUN npm run build

RUN mkdir -p /var/www/html
RUN mv build/* /var/www/html

WORKDIR /

RUN rm -rf /app
