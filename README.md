# WebSocket Server for Battleship

## Clone repository

```bash
https://github.com/RVitaly1978/battleship.git
```

## Checkout to `develop` branch

```bash
git checkout develop
```

## Install dependencies

***Note***: Node.js required version is **20 LTS**

```bash
npm install
```

## Create a `.env` file (copy and rename `.env.example`) in the root directory with the following content:

```
HTTP_PORT=8181
WS_PORT=3000
```

## Run application

```bash
# in develop mode
npm run start

# in develop mode (tsx watch)
npm run start:dev
```

## Run Client

Open browser on http://localhost:8181

## Rules Notes

1. You cannot log in if a user with the same name is already logged in.
2. You cannot open more than one game room.
3. You will lose your turn if you hit a cell that has already been hit.
4. You will lose the game if you reload the page.
