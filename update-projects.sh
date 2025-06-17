#!/bin/bash

# Find all tsconfig.json files in docs/ and copy folders next to them
find "docs" -type f -name "tsconfig.json" | while read -r tsconfig_path; do
    target_dir=$(dirname "$tsconfig_path")
    echo "Copying to: $target_dir"

    cp -r "robutekLibrary/@types" "$target_dir"
    cp -r "robutekLibrary/src/libs" "$target_dir/src"
done
