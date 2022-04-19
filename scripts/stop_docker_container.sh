#!/bin/bash
# stops the container running the todos-app server
# use this script to stop the container when deployed the app-server 
# as a container without using docker-compose.
cd ..  
source .env

 
echo "**************************************************"
echo "Stopping container:  [$NODEJS_CONTAINER]"
echo "**************************************************"
echo "--------------------------------------------------"
echo "(1/4) - List containers..."
docker ps -a | grep $NODEJS_CONTAINER
echo "--------------------------------------------------"
echo "(2/4) - Stop running container [$NODEJS_CONTAINER] ..."
docker stop $NODEJS_CONTAINER 
echo "--------------------------------------------------"
echo "(3/4) - Remove container [$NODEJS_CONTAINER]..."
docker rm $NODEJS_CONTAINER
echo "--------------------------------------------------"
echo "(4/4) - List all containers...!"
docker ps -a 
echo "--------------------------------------------------"
echo "Done !!!" 