#!/bin/bash

source ./docker_env.sh 
# IMAGE='mynodejs'
echo "**************************************************"
echo "Rebuilding image:  [$IMAGE]"
echo "**************************************************"

echo "--------------------------------------------------"
echo "(1/5) - Listing docker images..."
docker images | grep $IMAGE
echo "--------------------------------------------------"
echo "(2/5) - Remove image [$IMAGE]..."
docker rmi $IMAGE:$IMG_TAG  
echo "--------------------------------------------------"
echo "(3/5) - Listing docker images to check removal ..."
docker images | grep $IMAGE
echo "--------------------------------------------------"
echo "(4/5) - Building image [$IMAGE] from Dockerfile..."
docker build -t $IMAGE:$IMG_TAG .
echo "--------------------------------------------------"
echo "(5/5) - Listing images..."
docker images
echo "--------------------------------------------------"
echo "Done !!!" 