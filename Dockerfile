# Use an official Node.js runtime as a parent image
FROM node:20-slim AS base

# Set the working directory
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# Set environment variables (can be overridden at runtime)
# Example: Replace with your actual Firebase config if needed
# ARG NEXT_PUBLIC_FIREBASE_CONFIG
# ENV NEXT_PUBLIC_FIREBASE_CONFIG=${NEXT_PUBLIC_FIREBASE_CONFIG}
# ARG GOOGLE_GENAI_API_KEY
# ENV GOOGLE_GENAI_API_KEY=${GOOGLE_GENAI_API_KEY}

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# If you have Genkit flows or prompts outside the default Next.js structure, copy them too
# COPY --from=builder --chown=nextjs:nodejs /app/src/ai ./src/ai

USER nextjs

EXPOSE 9002 # Match the port used in package.json dev script or use 3000 for default `npm start`

ENV PORT 9002

# Use `npm start` which likely runs `next start`
# If you need to run on a different port use `next start -p $PORT`
CMD ["node", "server.js"]
# Or if using the default 'start' script:
# CMD ["npm", "start"]
