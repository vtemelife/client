# Vteme react client

## Clone repository

Install git on your system https://git-scm.com/book/en/v2/Getting-Started-Installing-Git

```
git clone git@github.com:vtemelife/client.git
cd client
```

## Run using docker

Install docker on your system https://runnable.com/docker/getting-started/

### Activate environment:

Depends on your environment (staging at default) run the following

```
cp envsets/docker_staging.env .docker.env 
```

### Build and Run

```
docker-compose build
docker-compose up
```

## Run without docker

### Install system dependencies (Ubuntu / OSX)

Install nvm, see instruction here: https://github.com/nvm-sh/nvm

```
nvm install 13.3.0
nvm use 13.3.0
node --version
```

### Activate environment:

Depends on your environment (staging at default) run the following

```
cp envsets/local_staging.env .local.env 
source .local.env
```

### Install project requirements:

```
yarn install
```

### Start dev server:

```
make start
```

## Run tests

### Run all tests:

```
make test
```

### Run one test:

```
NODE_ENV=test yarn run jest app/containers/Rest/tests/reducer.test.js
```
