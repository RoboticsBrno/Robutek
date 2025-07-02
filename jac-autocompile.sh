#!/bin/bash

# Exit on any error
set -e

# Find all tsconfig.json files in docs/ and run command in those directories
find "docs" -type f -name "tsconfig.json" | while read -r tsconfig_path; do
    target_dir=$(dirname "$tsconfig_path")
    
    # Change to the directory containing tsconfig.json and run your command
    echo "Running command in: $target_dir"
    cd "$target_dir"
    
    npx jac build
    
    # Return to the original directory
    cd - > /dev/null
done
