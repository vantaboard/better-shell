#!/usr/bin/sh

if [ "$1" != "chrome" ] && [ "$1" != "firefox" ]; then
  echo "Usage: ./build.sh chrome|firefox"
  exit 1
fi

rm build.zip
mkdir -p build
cp manifest.json build/
mkdir -p build/images
cp -r images/icon*.png build/images/
cp -r scripts build/
cp -r styles build/
cd build || exit

if [ "$1" = "chrome" ]; then
  sed -i 's/"manifest_version": 2,/"manifest_version": 3,/g' manifest.json
fi

zip -r ../build.zip *
cd ..
rm -rf build
