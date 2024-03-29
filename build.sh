#! /usr/bin/bash

rm -rf ./dist/* 
cp ./manifest.json ./dist/manifest.json
cp -r ./src/frontend/styles/* ./dist
cp ./src/frontend/popups/default/popup.html ./dist/default_popup.html
cp ./src/frontend/popups/confirmation-credentials/popup.html ./dist/credentials_confirmation_popup.html
cp ./src/frontend/popups/confirmation-share-creds/popup.html ./dist/share_creds_confirmation_popup.html

cp ./src/frontend/img/* ./dist # copy icons

# Bundle
rollup --config rollup.config.js

# zip for production
printf "\nzipping ./dist\n"
zip -r ./prod-materials/dist.zip ./dist
