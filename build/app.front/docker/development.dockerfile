FROM node:latest
RUN apt-get update && apt-get install -y --no-install-recommends vim && apt-get clean
WORKDIR /usr/src/app
RUN groupadd -r owner && useradd -m -r -g owner owner && chown -R owner:owner /usr/src/app
USER owner
RUN printf "alias ll=\"ls -alh\"\n" >> /home/owner/.bashrc

RUN chown -R owner:owner /usr/src/app
RUN mkdir /usr/src/app/public/
RUN mkdir /usr/src/app/template/
RUN chown -R owner:owner /usr/src/app/template/

# SERVER
# server is being changed way rearely, so it goes first
COPY ./build/package.json .
RUN npm install
COPY ./build/app.front.server/ .

# the client code is served through the volume

CMD [ "npm", "run", "dev" ]
