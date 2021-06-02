#!/bin/bash

# Variables for Docker setup
DOCKER_SP_AUTO=${bamboo_docker_image}":"${bamboo_docker_version}
DOCKER_SP_AUTO_CONTAINER_NAME="automation-container"
SITE_URL=${bamboo_site_url}
OS_NAME=${bamboo_os_name}
OS_VERSION=${bamboo_os_version}
BROWSER_NAME=${bamboo_browser_name}
BROWSER_VERSION=${bamboo_browser_version}
CONFIG_FILE=${bamboo_config_file}
CUCUMBER_OPTION_TAGS=${bamboo_cucumberOpts_tags}
MAX_SESSIONS=${bamboo_max_sessions}

echo "DOCKER_SP_AUTO -> $DOCKER_SP_AUTO"
echo "DOCKER_SP_AUTO_CONTAINER_NAME -> $DOCKER_SP_AUTO_CONTAINER_NAME"
echo "SITE_URL -> $SITE_URL"
echo "OS_NAME -> $OS_NAME"
echo "OS_VERSION -> $OS_VERSION"
echo "BROWSER_NAME -> $BROWSER_NAME"
echo "BROWSER_VERSION -> $BROWSER_VERSION"
echo "CONFIG_FILE -> $CONFIG_FILE"
echo "CUCUMBER_OPTION_TAGS ->$CUCUMBER_OPTION_TAGS"
echo "IDENTIFIER ->$IDENTIFIER"
echo "MAX_SESSIONS ->$MAX_SESSIONS"

# For local testing
[ $DOCKER_SP_AUTO == ":" ] && DOCKER_SP_AUTO="" # put path to local docker image here
[ -z $SITE_URL ] && SITE_URL="http://localhost:3000"
[ -z "$OS_NAME" ] && OS_NAME="Windows"
[ -z "$OS_VERSION" ] && OS_VERSION="10"
[ -z "$BROWSER_NAME" ] && BROWSER_NAME="Chrome"
[ -z "$BROWSER_VERSION" ] && BROWSER_VERSION="86.0"
[ -z "$CONFIG_FILE" ] && CONFIG_FILE="conf/conf.browserstack.js"
[ -z "$CUCUMBER_OPTION_TAGS" ] && CUCUMBER_OPTION_TAGS="--cucumberOpts.tags='@TEST'"
[ -z "$IDENTIFIER" ] && IDENTIFIER=$$
[ -z "$MAX_SESSIONS" ] && MAX_SESSIONS=1

# Generating .env file
echo OS_NAME=$OS_NAME > .env
echo BROWSER_NAME=$BROWSER_NAME >> .env
echo BROWSER_VERSION=$BROWSER_VERSION >> .env
echo START_TIME=$(date) >> .env
echo AUTOMATION_BUILD_NUMBER=${bamboo_buildNumber} >> .env
echo IDENTIFIER=$IDENTIFIER >> .env
echo MAX_SESSIONS=$MAX_SESSIONS >> .env

clean_docker_container(){
    # Stop & remove the running Docker container
    echo "Stopping -> $DOCKER_SP_AUTO_CONTAINER_NAME <- Docker Container"
    docker stop $DOCKER_SP_AUTO_CONTAINER_NAME
    echo "Removing -> $DOCKER_SP_AUTO_CONTAINER_NAME <- Docker Container"
    docker rm $DOCKER_SP_AUTO_CONTAINER_NAME
}

clean_docker_container

echo "Starting -> $DOCKER_SP_AUTO_CONTAINER_NAME <- Docker Container"
docker run --name $DOCKER_SP_AUTO_CONTAINER_NAME -e "SITE_URL=$SITE_URL" -e "OS_NAME=$OS_NAME" \
    -e "OS_VERSION=$OS_VERSION" -e "BROWSER_NAME=$BROWSER_NAME" -e "BROWSER_VERSION=$BROWSER_VERSION" -e "IDENTIFIER=$IDENTIFIER" -e "MAX_SESSIONS=$MAX_SESSIONS" -t -d $DOCKER_SP_AUTO
echo "Changing Timezone in Docker container to Sydney"
docker exec $DOCKER_SP_AUTO_CONTAINER_NAME sudo ln -sf /usr/share/zoneinfo/Australia/Sydney /etc/localtime
docker exec $DOCKER_SP_AUTO_CONTAINER_NAME sudo dpkg-reconfigure --frontend noninteractive tzdata
echo "Copying files to Docker container"
docker cp . $DOCKER_SP_AUTO_CONTAINER_NAME:/home/automation/
echo "Deleting node_modules folder"
docker exec $DOCKER_SP_AUTO_CONTAINER_NAME rm -rf node_modules  
echo "installing packages"
docker exec $DOCKER_SP_AUTO_CONTAINER_NAME npm install
echo "Executing Protractor tests"
docker exec $DOCKER_SP_AUTO_CONTAINER_NAME sh -c "./node_modules/protractor/bin/protractor $CONFIG_FILE $CUCUMBER_OPTION_TAGS"
echo "Recording end time"
echo END_TIME=$(date) >> .env
echo "Copying ENV file to Docker container"
docker cp ./.env $DOCKER_SP_AUTO_CONTAINER_NAME:/home/au/
echo "Get Docker Containers status after test execution"
docker ps -a
echo "Generating Cucumber HTML test results"
docker exec $DOCKER_SP_AUTO_CONTAINER_NAME node generateTestResults.js
echo "Generating JUnit test results"
docker exec $DOCKER_SP_AUTO_CONTAINER_NAME /home/automation/node_modules/junit-merge/bin/junit-merge -d reports/XML -o reports/TestResults.xml
echo "Get Docker Containers status before copying test result"
docker ps -a
echo "Copying the test results to the working directory"
docker cp $DOCKER_SP_AUTO_CONTAINER_NAME:/home/automation/reports/ .
echo "Listing pdf folder content"
docker exec $DOCKER_SP_AUTO_CONTAINER_NAME ls -R /home/automation/testData
# echo "Copying the PDF comparison results to the working directory"
docker cp $DOCKER_SP_AUTO_CONTAINER_NAME:/home/automation/testData/png/diff/ .

clean_docker_container