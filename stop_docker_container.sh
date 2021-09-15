#!/bin/bash

source ./docker_env.sh 
# CONTAINER_NAME='my-nodejs-ctnr'
 
echo "**************************************************"
echo "Stopping container:  [$CONTAINER_NAME]"
echo "**************************************************"

echo "--------------------------------------------------"
echo "(1/4) - List containers..."
docker ps -a | grep $CONTAINER_NAME
echo "--------------------------------------------------"
echo "(2/4) - Stop running container [$CONTAINER_NAME] ..."
docker stop $CONTAINER_NAME 
echo "--------------------------------------------------"
echo "(3/4) - Remove container [$CONTAINER_NAME]..."
docker rm $CONTAINER_NAME
echo "--------------------------------------------------"
echo "(4/4) - List containers...again!"
docker ps -a 
echo "--------------------------------------------------"
echo "Done !!!" 