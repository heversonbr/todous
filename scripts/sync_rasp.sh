#!/bin/bash

cd ..  
source .env

echo "**************************************************"
echo "Rsync local repository and rasp $REMOTE_HOST"
echo "**************************************************"
echo "rsync -avhP $SRC_PATH $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH --exclude-from=$EXCLUDE_FILES"
echo "--------------------------------------------------"
rsync -avh $SRC_PATH $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH --exclude-from=$EXCLUDE_FILES
echo "--------------------------------------------------"
echo "Done !!!" 


