# Dockerfile
FROM mcr.microsoft.com/playwright:v1.50.1-noble

# Set the working directory in the container
WORKDIR /pw-tests

# Copy package.json and package-lock.json for dependencies
COPY package*.json ./

# Install dependencies directly 
RUN npm install 

# Copy the application code into the container
COPY . .

# Ensure Playwright browsers are installed
RUN npx playwright install --with-deps

# Command to run the tests
CMD ["npx", "playwright", "test", "--reporter=allure-playwright"]
