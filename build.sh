#!/usr/bin/sh

mkdir -p build
cp manifest.json build/
cp -r scripts build/
cp -r styles build/
cd build || exit
zip -r ../build.zip *
cd ..
rm -rf build
