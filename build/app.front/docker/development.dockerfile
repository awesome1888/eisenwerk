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

# CLIENT
# copy templates
COPY ./build/app.front.client/template/ ./template/
# client assets, more frequent but still not so much
COPY ./build/app.front.client/public/ ./public/
# now bundled client here comes
COPY ./build/app.front.client/ ./public/
RUN mv /usr/src/app/public/assets.html ./template/

CMD [ "npm", "run", "dev" ]
