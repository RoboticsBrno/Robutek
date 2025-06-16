#!/bin/bash
set -e

echo "Deploying v1..."
mike build v1 --config-file mkdocs.v1.yml

echo "Deploying v2..."
mike build v2 --config-file mkdocs.v2.yml

echo "Setting v2 as default..."
mike set-default v2 --config-file mkdocs.v2.yml
