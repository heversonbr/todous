FROM node:16.3

# create directory for app files
RUN mkdir -p /usr/src/app
# set working directory
WORKDIR /usr/src/app
# copy the package.json file (contains dependencies) from project source dir to container dir
COPY package.json /usr/src/app
# installing the dependencies into the container
RUN npm install
#copying the source code of Application into the container dir
#COPY server.js /usr/src/app
#COPY app_hello_world.js /usr/src/app

#container exposed network port number
# EXPOSE 3000 
# (i'll expose while invoking 'docker run' command)
#command to run within the container
CMD ["npm", "start"]

# -----------------------------------------------------
# RUN apt-get update && apt-get install -y apt-file
# RUN apt-get install nano 
# HTTP basic Authentication
# RUN apt-get install -y apache2-utils  
# -----------------------------------------------------
# remove nginx default configuration
# RUN rm /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf
# copy new server configuration in the container
# COPY ./config/base_nginx_docker.conf /etc/nginx/nginx.conf
# COPY ./config/my_nginx_rasp5_server.conf /etc/nginx/conf.d/my_nginx_rasp5_server.conf
# -----------------------------------------------------
# add directories that store configuration 
# RUN mkdir -p /var/www/http
# -----------------------------------------------------

