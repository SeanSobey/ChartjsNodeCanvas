#!/bin/bash

packageName=$(node -p "require('./package.json').name")
packageVersion=$(node -p "require('./package.json').version")
publishVersion=$(npm view "$packageName" version)
if [ "$packageVersion" != "$publishVersion" ]
then
	npm config set //registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN
	npm publish
else
	echo "Existing version $packageVersion for $packageName is already published...skipping"
fi