#!/bin/bash

if [ "$#" != "1" ] || [ ! -d "$1/ts-examples/@types" ]; then
    echo "Run this as $0 PATH_TO_JACULUS_REPO_ROOT"
    exit 1
fi

SRC_DIR="$1/ts-examples/@types"

for type_dir in $(find . -type d -name '@types'); do
    echo $type_dir
    cp -a "$SRC_DIR/"* "$type_dir/"
done
