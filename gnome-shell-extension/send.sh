#!/bin/bash
#
# https://stackoverflow.com/questions/48648952/set-get-property-using-dbus-send
#

dbus-send \
	--session \
	--dest=br.eti.werneck.statusicon \
	--print-reply \
	"/br/eti/werneck/statusicon/controller" \
	"br.eti.werneck.statusicon.get_version"

