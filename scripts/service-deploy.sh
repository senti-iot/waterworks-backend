#!/bin/bash

if [[ "$1" == "master" ]]; then 
	echo
	echo Deploying waterworks-backend $1 ... 
	rsync -r --quiet $2/ deploy@rey.webhouse.net:/srv/nodejs/senti/services/waterworks-backend/production
	echo
	echo Restarting waterworks-backend service: $1 ... 
	ssh deploy@rey.webhouse.net 'sudo /srv/nodejs/senti/services/waterworks-backend/production/scripts/service-restart.sh master'
	echo
	echo Deployment to waterworks-backend $1 and restart done!
	exit 0
fi 

if [[ "$1" == "dev" ]]; then 
	echo
	echo Deploying waterworks-backend $1 ... 
	rsync -r --quiet $2/ deploy@rey.webhouse.net:/srv/nodejs/senti/services/waterworks-backend/development
	echo
	echo Restarting waterworks-backend service: $1 ... 
	ssh deploy@rey.webhouse.net 'sudo /srv/nodejs/senti/services/waterworks-backend/development/scripts/service-restart.sh dev'
	echo
	echo Deployment to waterworks-backend $1 and restart done!
	exit 0
fi