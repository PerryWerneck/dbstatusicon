#!/bin/bash
EXTENSION_ID=$(cat metadata.json | grep uuid | cut -d: -f2 | sed 's/"//g' | tr -d '[:space:]')
EXTENSION_FOLDER="${HOME}/.local/share/gnome-shell/extensions/${EXTENSION_ID}"

echo "Extension folder is ${EXTENSION_FOLDER}"

rm -fr ${EXTENSION_FOLDER}
mkdir -p ${EXTENSION_FOLDER}

ln -sf $(readlink -f .)/*.js ${EXTENSION_FOLDER}
ln -sf $(readlink -f .)/*.xml ${EXTENSION_FOLDER}
ln -sf $(readlink -f .)/metadata.json ${EXTENSION_FOLDER}

#sudo ln -sf $(readlink -f .)/stylesheet.css /usr/share/gnome-shell/extensions/statusicons@werneck.eti.br

ls -l ${EXTENSION_FOLDER}

