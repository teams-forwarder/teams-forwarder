FROM node:24-slim

RUN apt-get update && apt-get install -y \
  chromium \
  curl \
  fonts-liberation \
  fonts-noto \
  fonts-noto-color-emoji \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV CHROMIUM_PATH=/usr/bin/chromium

WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
COPY server.js .

EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=1 CMD curl -f http://localhost:3000/health || exit 1

USER node
CMD ["node", "server.js"]
