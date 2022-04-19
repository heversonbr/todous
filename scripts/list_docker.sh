#!/bin/bash

cd ..  
source .env

echo "--------------------------------------------------"
echo "(1/3) - Listing containers..."
docker ps -a 
echo "--------------------------------------------------"
echo "(2/3) - Listing docker images..."
docker images 
echo "--------------------------------------------------"echo "--------------------------------------------------"
echo "(3/3) - Listing docker networks..."
docker network ls
echo "--------------------------------------------------"