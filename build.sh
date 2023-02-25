#!/usr/bin/env sh

tsc
rsync -a --exclude '*.ts' ./src/ ./dist/
