#!/bin/bash

cd ..  
source .env 

# command to execute
CMD='docker-compose build --no-cache'

echo "**************************************************"
echo "RUNNING: $CMD"
echo "**************************************************"
echo " Using Environment Variables at .env file"
echo "--------------------------------------------------"
echo "(1/2) - Running cmd: $CMD"
$CMD
echo "--------------------------------------------------"
echo "(2/2) - Listing images..."
docker images
echo "--------------------------------------------------"
echo "Done !!!" 