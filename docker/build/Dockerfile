FROM chartjs-node-canvas-base

LABEL maintainer = "sean.m.sobey@gmail.com"

WORKDIR /usr/server

RUN npm ci --no-color

COPY . .

RUN npm run build

CMD ["/bin/bash", "-c", "echo base image complete"]