FROM chartjs-node-canvas-base

LABEL maintainer = "sean.m.sobey@gmail.com"

WORKDIR /usr/server

COPY --from=chartjs-node-canvas-build /usr/server/dist/ ./dist/

CMD ["/bin/bash", "-c", "echo production image complete"]