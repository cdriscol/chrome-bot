#!/bin/bash

zip -r chrome-bot * && aws lambda update-function-code --function-name chrome-bot --zip-file fileb://./chrome-bot.zip
