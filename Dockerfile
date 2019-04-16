FROM node:8.15.1-alpine
RUN npm build
COPY . .
CMD ["npx","ts-node","index.ts"]

