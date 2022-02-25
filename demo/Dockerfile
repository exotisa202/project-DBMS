FROM node:22-alpine
WORKDIR /app/demo
COPY demo/package*.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY demo/ ./
COPY views/ /app/views/
COPY public/ /app/public/
COPY util/ /app/util/
USER node
CMD ["npm", "test"]
