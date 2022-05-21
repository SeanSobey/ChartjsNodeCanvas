FROM node:16.15.0-slim

LABEL maintainer = "sean.m.sobey@gmail.com"

RUN apt-get update && apt-get install -y --no-install-recommends \
	# - For node-gyp
	python make g++ \
	# - For canvas
	fontconfig

WORKDIR /usr/server

ENV DOCKER_OS=debian

COPY package.json package-lock.json ./

RUN npm ci --production --no-color

CMD ["/bin/bash", "-c", "echo base image complete"]