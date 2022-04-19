#!/bin/bash

cd ..  
source .env 

# command to execute
CMD='docker-compose up -d --build --no-cache'

echo "**************************************************"
echo "RUNNING: $CMD"
echo "**************************************************"
echo " Using Environment Variables at .env file"
echo "--------------------------------------------------"
echo "(1/3) - Running cmd: $CMD"
$CMD
echo "--------------------------------------------------"
echo "(2/3) - Fetching the logs"
docker-compose logs 
echo "--------------------------------------------------"
echo "(3/3) - Listing containers..."
docker ps -a 
echo "--------------------------------------------------"
echo "Done !!!" 