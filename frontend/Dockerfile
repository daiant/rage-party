ARG NODE_VERSION=22.14.0-alpine

# Set the base image for development
FROM node:${NODE_VERSION} AS dev

# Set environment variable to indicate development mode
ENV NODE_ENV=development

# Set the working directory inside the container
WORKDIR /app

RUN npm install -g @angular/cli

# Copy only the dependency files first to optimize Docker caching
COPY package.json package-lock.json ./

RUN npm install

# Copy all application source files into the container
COPY . .

# Expose the port Angular uses for the dev server (default is 4200)
EXPOSE 4200
