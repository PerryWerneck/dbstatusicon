#!/bin/bash

EXTENSION_ID="statusicons@werneck.eti.br"

sudo rm -fr /usr/share/gnome-shell/extensions/statusicons@werneck.eti.br
sudo mkdir -p /usr/share/gnome-shell/extensions/statusicons@werneck.eti.br

sudo ln -sf $(readlink -f .)/*.js /usr/share/gnome-shell/extensions/statusicons@werneck.eti.br
sudo ln -sf $(readlink -f .)/*.xml /usr/share/gnome-shell/extensions/statusicons@werneck.eti.br
sudo ln -sf $(readlink -f .)/metadata.json /usr/share/gnome-shell/extensions/statusicons@werneck.eti.br

#sudo ln -sf $(readlink -f .)/stylesheet.css /usr/share/gnome-shell/extensions/statusicons@werneck.eti.br

ls -l /usr/share/gnome-shell/extensions/statusicons@werneck.eti.br

