FROM node:15-alpine

COPY . .

RUN npm install

CMD ["npm", "run", "start"]