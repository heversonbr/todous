#!/bin/bash

source ./docker_env.sh 
# CONTAINER_NAME='my-nodejs-ctnr'
# IMAGE='mymongo'
HOST_VOL='/Users/heversonbr/workspace/web-dev/nodejs/todos_hands_on'
CONTAINER_VOL='/usr/src/app'
HOST_PORT='9000'
CONTAINER_PORT='3000'
RESTART_POLICY='--restart always'

#  REMIND:  mkdir -p data/db
echo "**************************************************"
echo "RUNNING Docker container:  [$CONTAINER_NAME]"
echo "**************************************************"

echo "--------------------------------------------------"
echo "(1/3) - Running docker with the following options:"
echo "     publish port  :  -p $HOST_PORT:$CONTAINER_PORT" 
echo "     mount volume  :  -v $HOST_VOL:$CONTAINER_VOL $IMAGE"
#echo "     restart policy:  $RESTART_POLICY"
# docker run -d $RESTART_POLICY --name $CONTAINER_NAME -p $HOST_PORT:$CONTAINER_PORT -v $HOST_VOL:$CONTAINER_VOL $IMAGE 
# docker run -d --name $CONTAINER_NAME -p $HOST_PORT:$CONTAINER_PORT $IMAGE:$IMG_TAG
# docker run -d --name $CONTAINER_NAME $IMAGE:$IMG_TAG
docker run -d -p $HOST_PORT:$CONTAINER_PORT -v $HOST_VOL:$CONTAINER_VOL --name $CONTAINER_NAME $IMAGE:$IMG_TAG
# docker run -it -p $HOST_PORT:$CONTAINER_PORT -v $HOST_VOL:$CONTAINER_VOL --name $CONTAINER_NAME $IMAGE:$IMG_TAG
echo "--------------------------------------------------"
echo "(3/3) - Fetching the logs of a container $CONTAINER_NAME"
docker logs $CONTAINER_NAME 

echo "--------------------------------------------------"
echo "(3/3) - Listing containers..."
docker ps -a 
echo "--------------------------------------------------"
echo "Done !!!" 