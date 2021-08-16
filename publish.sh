#!/bin/bash

error_exit()
{
  echo -e "$1"
  exit 1
}

echo -n "Detecting package version "
PACKAGE_VERSION=`grep -oh '"version":.*' package.json  | grep -o '[0-9]*\.[0-9]*\.[0-9]*'`

[[ $PACKAGE_VERSION =~ ^[0-9]*\.[0-9]*\.[0-9]*$ ]] \
  && echo "- OK" \
  || error_exit "- ERROR\nPlease check version value in package.json"

GIT_TAG="v$PACKAGE_VERSION"

echo "Creating a git tag"
git tag $GIT_TAG \
  && echo "Creating a git tag - OK" \
  || error_exit "Creating a git tag - ERROR"

echo "Pushing created tag to the remore repo"
git push origin $GIT_TAG \
  && echo "Pushing created tag to the remore repo - OK" \
  || error_exit "Pushing created tag to the remore repo - ERROR"
