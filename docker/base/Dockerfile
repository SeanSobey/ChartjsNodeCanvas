FROM node:21.7.3-slim

LABEL maintainer = "sean.m.sobey@gmail.com"

RUN apt-get update && apt-get install -y --no-install-recommends \
	# - For node-gyp
	# python2 make g++ \
	# - For canvas
	fontconfig build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev 

WORKDIR /usr/server

COPY package.json package-lock.json ./

RUN npm ci --production --no-color

CMD ["/bin/bash", "-c", "echo base image complete"]