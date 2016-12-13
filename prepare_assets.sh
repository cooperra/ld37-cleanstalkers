#!/bin/bash

# downscale
./convert_assets.sh

# make sprite sheets
echo assets/momsheet.png
rm assets/momsheet.png
convert assets/mom*.png +append assets/momsheet.png
echo assets/dadsheet.png
rm assets/dadsheet.png
convert assets/dad*.png +append assets/dadsheet.png
echo assets/gregsheet.png
rm assets/gregsheet.png
convert assets/greg*.png +append assets/gregsheet.png
