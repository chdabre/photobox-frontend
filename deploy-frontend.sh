#!/bin/sh

cd /home/pi/photobox-frontend
git pull
yarn run build
cd dist

sudo rm -rf /var/www/photobox
sudo mkdir /var/www/photobox
sudo cp -r * /var/www/photobox
