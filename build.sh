#!/usr/bin/env sh

tsc;
find ./src ! -name "*.ts" -type f -exec cp -r {} ./dist/ \;
