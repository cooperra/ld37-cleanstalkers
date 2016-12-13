#!/bin/bash

for i in raw_assets/*
do
    echo "$i" "->" "assets/$(basename $i)"
    convert "$i" -resize 60% "assets/$(basename $i)"
done
