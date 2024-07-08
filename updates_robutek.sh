#!/bin/bash

# Tool for updating robutek.ts from lib to all folders from running location
# Default location of robutek.ts is in docs/robutekLibrary/Robutek-library/src/libs/robutek.ts

ROBUTEK_FILE="robutek.ts"
DEFAULT_ROBOTEK_PATH="docs/robutekLibrary/Robutek-library/src/libs/$ROBUTEK_FILE"

# Check if the default Robutek file exists
if [ ! -f "$DEFAULT_ROBOTEK_PATH" ]; then
    echo "File $DEFAULT_ROBOTEK_PATH does not exist."
    exit 1
fi

echo "Updating robutek.ts in all repositories - replacing all files with the new one"

# Find and replace all instances of robutek.ts
find . -type f -name "$ROBUTEK_FILE" -exec cp "$DEFAULT_ROBOTEK_PATH" {} \;

echo "Update completed."
