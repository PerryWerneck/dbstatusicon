#!/bin/bash
EXTENSION_ID=statusicons@werneck.eti.br

rm -f *.zip

gnome-extensions disable ${EXTENSION_ID}
gnome-extensions enable ${EXTENSION_ID}

gnome-extensions info ${EXTENSION_ID}

