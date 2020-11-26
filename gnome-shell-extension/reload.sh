#!/bin/bash
EXTENSION_ID=$(cat metadata.json | grep uuid | cut -d: -f2)
gnome-extensions reset ${EXTENSION_ID}

