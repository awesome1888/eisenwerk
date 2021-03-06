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

# server is being changed way rearely, so it goes first
COPY ./server/package*.json ./
RUN npm install
COPY ./server/build/ .

# client assets, more frequent but still not so much
COPY ./client/public/ ./public/

# copy templates
COPY ./client/src/template/ ./template/

# now bundled client here comes
COPY ./client/build/ ./public/
RUN mv /usr/src/app/public/assets.html ./template/

CMD [ "npm", "run", "dev" ]
