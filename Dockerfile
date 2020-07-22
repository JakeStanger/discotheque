FROM node:14

LABEL Maintainer = "Jake Stanger"
LABEL Name = "Discotheque Discord Bot"

# === RUST SETUP ===

RUN apt-get update && \
    apt-get install --no-install-recommends -y \
    ca-certificates curl file \
    build-essential \
    autoconf automake autotools-dev libtool xutils-dev && \
    rm -rf /var/lib/apt/lists/*

ENV SSL_VERSION=1.0.2k

RUN curl https://www.openssl.org/source/openssl-$SSL_VERSION.tar.gz -O && \
    tar -xzf openssl-$SSL_VERSION.tar.gz && \
    cd openssl-$SSL_VERSION && ./config && make depend && make install && \
    cd .. && rm -rf openssl-$SSL_VERSION*

ENV OPENSSL_LIB_DIR=/usr/local/ssl/lib \
    OPENSSL_INCLUDE_DIR=/usr/local/ssl/include \
    OPENSSL_STATIC=1

RUN curl https://sh.rustup.rs -sSf | \
    sh -s -- --default-toolchain nightly -y

ENV PATH=/root/.cargo/bin:$PATH

# === NODE SETUP ===

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock
COPY nodemon.json /app/nodemon.json
COPY ./tsconfig.json /app/tsconfig.json
COPY ./tsconfig.server.json /app/tsconfig.server.json
COPY ./tsconfig.client.json /app/tsconfig.client.json
COPY ./webpack.config.js /app/webpack.config.js
COPY ./types /app/types

RUN yarn install --frozen-lockfile
ENV PATH="./node_modules/.bin:${PATH}"

EXPOSE ${PORT}

CMD ["yarn", "start:dev"]
