#!/bin/bash

# Tool for updating robutek.ts files in all repository
# Default location of robutek.ts is in docs/robutekLibrary/Robutek-library/src/libs/robutek.ts

ROBUTEK_FILE="robutek.ts"
DEFAULT_ROBOTEK_PATH="docs/robutekLibrary/Robutek-library/src/libs/"$ROBUTEK_FILE

# Check if exist DEFAULT_ROBOTEK_PATH
if [ ! -f "$DEFAULT_ROBOTEK_PATH" ]; then
    echo "File $DEFAULT_ROBOTEK_PATH does not exist."
    exit 1
fi


echo "Updating robutek.ts in all repositories"
# Find ROBOTEK_FILE in all repositories an replace it with DEFAULT_ROBOTEK_PATH
for d in */ ; do
    if [ -d "$d" ]; then
        find $d -type f -name $ROBUTEK_FILE -exec echo "Updating $ROBUTEK_FILE in $d" \; -exec cp $DEFAULT_ROBOTEK_PATH $d$ROBUTEK_FILE \;
    fi
done