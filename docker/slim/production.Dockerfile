FROM chartjs-node-canvas-base-slim

LABEL maintainer = "sean.m.sobey@gmail.com"

WORKDIR /usr/server

COPY --from=chartjs-node-canvas-build-slim /usr/server/dist/ ./dist/

CMD ["/bin/bash", "-c", "echo production image complete"]