# TODO app

## Introduction 

TBD

## Scripts

The `scripts` directory contain the following useful scripts:

- **sync_rasp.sh**: syncronize local directory with remote host (e.g., raspberry pi).

- **start_nodejs_dev_server.sh**: just start the node.js app at local host (development only).

- **docker_compose_up_build.sh**: builds the node.js app-server and the mongodb container images, as defined at 'docker-compose.yml', and runs both containers.

- **docker_compose_up_only.sh**:  runs the node.js app-server and the mongodb containers, as defined at 'docker-compose.yml'.

- **docker_compose_down_only.sh**: stops the node.js app-server and the mongodb database containers.

- **docker_compose_down_remove.sh**:  stops the node.js app-server and the mongodb database containers and removes all the images. 


- **rebuild_docker_image.sh**: builds the node.js app-server image, as defined at 'Dockerfile.nodejs', if there is already an image, it removes it and re-builds it again. Note that, it only builds the app server, not the mongodb database. It is meant to be used with native installation of mongodb. 

- **run_docker_container.sh**: runs the node.js app-server based in the image created by the script `rebuild_docker_image.sh`. As the previous script, it only builds the app server, not the mongodb database.

- **stop_docker_container.sh**: stops the container running the todos-app server. 
