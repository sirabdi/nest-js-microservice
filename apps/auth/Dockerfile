# ===============================
# STAGE 1: Build the application
# ===============================
FROM node:18-alpine AS development

# Set working directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package*.json ./
COPY nest-cli.json nes-cli.json

# Install all dependencies (including devDeps)
RUN npm install

# Copy source code
COPY . .

# Install all dependencies (including devDeps)
RUN npm install -r

# Build the app
RUN npm run build

# ===============================
# STAGE 2: Create production image
# ===============================
FROM node:18-alpine AS production

# Set NODE_ENV
ENV NODE_ENV=production

# Set working directory
WORKDIR /usr/src/app

# Copy only necessary files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy built files from development stage
COPY --from=development /usr/src/app/dist ./dist

# Run the application
CMD ["node", "dist/apps/auth/main"]
