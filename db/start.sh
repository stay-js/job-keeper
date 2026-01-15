#!/bin/bash

if [ ! -f ".env" ]; then
    echo ".env file does not exist. Copying from .env.example..."
    cp .env.example .env
fi

docker compose up -d
