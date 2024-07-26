#!/bin/bash

# Tool for updating robutek.ts from lib to all folders from running location
# Default location of robutek.ts is in docs/robutekLibrary/Robutek-library/src/libs/robutek.ts

LIB_FILE="VL53L0X.ts"
DEFAULT_LIB_FILE="docs/robutekLibrary/Robutek-library/src/libs/$LIB_FILE"

# Check if the default VL53L0X file exists
if [ ! -f "$DEFAULT_LIB_FILE" ]; then
    echo "File $DEFAULT_LIB_FILE does not exist."
    exit 1
fi

echo "Updating VL53L0X.ts in all repositories - replacing all files with the new one"

# Find and replace all instances of VL53L0X.ts
find . -type f -name "$LIB_FILE" -exec cp "$DEFAULT_LIB_FILE" {} \;

echo "Update completed."
