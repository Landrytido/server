# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies needed for building native modules
RUN apk add --no-cache openssl zlib-dev libgcc make gcc g++ python3

# Force native modules to build from source
ENV npm_config_build_from_source=true

# Copy package files and Prisma folder (includes schema and migrations)
COPY package.json yarn.lock ./
COPY prisma ./prisma/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Generate the Prisma client for the linux-musl environment
RUN npx prisma generate

# Build your NestJS application
RUN yarn build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Install runtime dependencies including Chromium and its required packages for Puppeteer
RUN apk add --no-cache \
    openssl \
    zlib-dev \
    libgcc \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates

# Set environment variables for Puppeteer to use the system Chromium
ENV CHROME_BIN=/usr/bin/chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Copy the node_modules, built app, and Prisma files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

EXPOSE 3000

# Run Prisma migrations and then start the NestJS application
CMD [ "yarn", "start:migrate:prod" ]
