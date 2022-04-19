#!/bin/bash

cd ..  
source .env 

# command to execute
CMD='docker-compose down'

echo "**************************************************"
echo "RUNNING: $CMD"
echo "**************************************************"
echo "(1/3) - Running cmd: $CMD"
$CMD
echo "--------------------------------------------------"
echo "--------------------------------------------------"
echo "(2/3) - Listing containers..."
docker ps -a 
echo "--------------------------------------------------"
echo "(3/3) - Listing images..."
docker images
echo "--------------------------------------------------"
echo "Done !!!" 