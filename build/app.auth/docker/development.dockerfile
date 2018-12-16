FROM node:latest
RUN apt-get update && apt-get install -y --no-install-recommends vim && apt-get clean
WORKDIR /usr/src/app
RUN groupadd -r owner && useradd -m -r -g owner owner && chown -R owner:owner /usr/src/app
USER owner
RUN printf "alias ll=\"ls -alh\"\n" >> /home/owner/.bashrc

RUN chown -R owner:owner /usr/src/app
COPY ./build/package.json .
RUN npm install
COPY ./build/app.auth/ .
CMD [ "npm", "run", "dev" ]
