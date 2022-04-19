#!/bin/bash
# builds the node.js app-server image, as defined at 'Dockerfile.nodejs' 
# if there is already an image, it removes it and re-builds it again 
# use this script to create the image when deploying the app-server 
# as a container without using docker-compose.


# load global environment variables 
cd ..  
source .env

echo "**************************************************"
echo "Rebuilding image:  [$NODEJS_IMAGE:$NODEJS_IMAGE_TAG]"
echo "**************************************************"

echo "--------------------------------------------------"
echo "(1/5) - Listing docker images..."
docker images | grep $NODEJS_IMAGE
echo "--------------------------------------------------"
echo "(2/5) - Remove image [$IMAGE]..."
docker rmi $NODEJS_IMAGE:$NODEJS_IMAGE_TAG 
echo "--------------------------------------------------"
echo "(3/5) - Listing docker images to check removal ..."
docker images | grep $NODEJS_IMAGE
echo "--------------------------------------------------"
echo "(4/5) - Building image [$NODEJS_IMAGE] from Dockerfile..."
echo "docker build --no-cache -t $NODEJS_IMAGE:$NODEJS_IMAGE_TAG -f Dockerfile.nodejs ."
echo "--------------------------------------------------"
docker build --no-cache -t $NODEJS_IMAGE:$NODEJS_IMAGE_TAG -f Dockerfile.nodejs .
echo "--------------------------------------------------"
echo "(5/5) - Listing images..."
docker images
echo "--------------------------------------------------"
echo "Done !!!" 