# Use an official Node.js runtime as a parent image
# Using Node.js 20 LTS (Iron) as an example. Adjust if needed.
FROM node:20-alpine AS base

# Set the working directory in the container
WORKDIR /app

# Install pnpm globally if you decide to use it for dependency management
# RUN npm install -g pnpm

# Copy package.json and package-lock.json (or pnpm-lock.yaml)
COPY package*.json ./
# If using pnpm, you'd copy pnpm-lock.yaml instead of package-lock.json
# COPY pnpm-lock.yaml ./

# Install app dependencies
# If using npm:
RUN npm install --frozen-lockfile
# If using pnpm:
# RUN pnpm install --frozen-lockfile

# Bundle app source
COPY . .

# The Next.js app will be started by the command in docker-compose.yml,
# but it's good practice to expose the port here as well.
EXPOSE 9002

# The CMD can be overridden by docker-compose.yml
# For development, docker-compose.yml uses `npm run dev`.
# For a production build, you might have:
# RUN npm run build
# CMD ["npm", "start", "-p", "9002"]
# But for this dev setup, this CMD is effectively a placeholder.
CMD ["npm", "run", "dev"]
