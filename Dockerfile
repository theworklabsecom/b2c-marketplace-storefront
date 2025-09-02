FROM node:20-alpine

WORKDIR /app

# Copy pre-built storefront (no building in Docker)
COPY . .

# Install production dependencies only
RUN npm ci --only=production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Start production server
CMD ["npm", "start"]
