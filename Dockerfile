# --- Base image ---
FROM node:22-alpine

# --- App setup ---
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Install deps first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy the rest of the app
COPY . .

# Generate Prisma Client and build Next.js
RUN npx prisma generate
RUN npm run build

# The app listens on 3000
EXPOSE 3000

# On container start, ensure DB schema is applied (SQLite file created if missing), then start server
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
