# node latest
FROM node:11.6-alpine

# Change working directory
WORKDIR /usr/src/api

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Copy source code
COPY . .

# Expose API port to the outside
EXPOSE 3000

# Launch application
CMD ["npm", "run", "build", "-w"]
