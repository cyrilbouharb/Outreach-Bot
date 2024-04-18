# Use a specific version of Node.js as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to utilize Docker layer caching
COPY package*.json ./
# COPY rds-combined-ca-bundle.pem /usr/src/app/

# Install dependencies in the container, ensuring native dependencies are correctly compiled
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the application runs on
EXPOSE 5000

# Specify the command to run the application
CMD ["node", "index.js"]
