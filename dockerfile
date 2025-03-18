# Use the official Node.js image as the base image
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Next.js application
RUN npm run build

# Use a smaller image for the production environment
FROM node:18 AS runner

# Set the working directory
WORKDIR /app

# Copy the build output and necessary files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/server.js ./

# Install only production dependencies
RUN npm install --production --omit=dev

# Set environment variable to tell Next.js that it is running in production
ENV NODE_ENV=production

# Expose the port on which the app will run
EXPOSE 3000

# Start the application using the custom server
CMD ["node", "server.js"]