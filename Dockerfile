# # build the image
# docker build -t davideicardi-website .
#
# # run the container with environment variable(s)
# docker run -d -p 8181:8181 --restart unless-stopped --name test-davideicardi davideicardi-website
#
# # exec bash inside the container
# docker exec -ti test-davideicardi bash
#
# # Get the container IP
# docker inspect -f "{{ .NetworkSettings.Networks.nat.IPAddress }}" test-davideicardi
#


FROM node:8.9.1
# Create app directory
RUN mkdir -p /usr/src/app

# Install pm2
RUN npm install pm2@2.7.2 -g

WORKDIR /usr/src/app

# Install app dependencies
COPY . /usr/src/app
RUN npm install --only=production

EXPOSE 8181

CMD ["pm2-docker", "start", "./server/index.js"]