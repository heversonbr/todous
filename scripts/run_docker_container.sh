#!/bin/bash

# runs the node.js app-server based in the image created by 
# the script: 'rebuild_docker_image.sh'
# use this script to start the container and deploy the app-server 
# without using docker-compose.
cd ..  
source .env 

echo "**************************************************"
echo "RUNNING Docker container:  [$NODEJS_CONTAINER]"
echo "**************************************************"


echo "--------------------------------------------------"
echo "(1/3) - Running docker with the following options:"
echo "        publish port  :  -p $NODEJS_HOST_PORT:$NODEJS_CONTAINER_PORT" 
echo "        restart policy:  $NODEJS_RESTART_POLICY"
echo "--------------------------------------------------"
#     docker run -d --restart $NODEJS_RESTART_POLICY -p $NODEJS_HOST_PORT:$NODEJS_CONTAINER_PORT -v $NODEJS_HOST_VOL:$NODEJS_CONTAINER_VOL --name $NODEJS_CONTAINER $NODEJS_IMAGE:$NODEJS_IMAGE_TAG
echo "docker run -d --restart $NODEJS_RESTART_POLICY -p $NODEJS_HOST_PORT:$NODEJS_CONTAINER_PORT --name $NODEJS_CONTAINER $NODEJS_IMAGE:$NODEJS_IMAGE_TAG"
docker run -d --restart $NODEJS_RESTART_POLICY -p $NODEJS_HOST_PORT:$NODEJS_CONTAINER_PORT --name $NODEJS_CONTAINER $NODEJS_IMAGE:$NODEJS_IMAGE_TAG

echo "--------------------------------------------------"
echo "(2/3) - Fetching the logs of a container $NODEJS_CONTAINER"
sleep 1
docker logs $NODEJS_CONTAINER 

echo "--------------------------------------------------"
echo "(3/3) - Listing containers..."
docker ps -a 
echo "--------------------------------------------------"
echo "Done !!!" 