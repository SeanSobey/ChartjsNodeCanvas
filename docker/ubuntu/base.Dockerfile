FROM ubuntu:22.10

LABEL maintainer = "sean.m.sobey@gmail.com"

RUN apt-get update && apt-get install -y --no-install-recommends \
	build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# TODO: move into above...
RUN apt-get install --yes curl

# nvm environment variables
ENV NVM_DIR /usr/local/nvm
#TODO read from .nvmrc
ENV NODE_VERSION 16.13.0

# install nvm
# https://github.com/creationix/nvm#install-script
RUN mkdir -p $NVM_DIR \
	&& curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# install node and npm
RUN . ~/.bashrc $NVM_DIR/nvm.sh \
	&& nvm install $NODE_VERSION \
	&& nvm alias default $NODE_VERSION \
	&& nvm use default

# add node and npm to path so the commands are available
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

WORKDIR /usr/server

ENV DOCKER_OS=ubuntu

COPY package.json package-lock.json ./

RUN npm ci --production --no-color

CMD ["/bin/bash", "-c", "echo base image complete"]