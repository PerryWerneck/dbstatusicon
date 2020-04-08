 
/*
 * 
 * This file is part of dbstatusicon.
 * 
 * dbstatusicon is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * dbstatusicon is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with dbstatusicon.  If not, see <https://www.gnu.org/licenses/>.
 * 
 */

/* jshint -W100 */
/* history */
/* exported init */
/* exported deinit */
/* exported enable */
/* exported disable */

const Lang = imports.lang;
const Main = imports.ui.main;
const Gio = imports.gi.Gio;

// https://github.com/GNOME/gnome-shell/blob/master/js/ui/panelMenu.js
const PanelMenu = imports.ui.panelMenu;

// https://stackoverflow.com/questions/20394840/how-to-set-a-png-file-in-a-gnome-shell-extension-for-st-icon
const Me = imports.misc.extensionUtils.getCurrentExtension();

// Indicator
class Indicator extends PanelMenu.Button {

	constructor(menuAlignment, nameText, dontCreateMenu) {
		super(menuAlignment, nameText, dontCreateMenu);
	}	

	set_icon_name(icon_name) {

	}

	set_from_file(file) {

	}

}

// Main controller
let controller = null

class Controller {

	constructor() {

		this.icons = { }	// Indicator list
		this.service = { 'id': null }

	}

	init() {

		// Load Interface description
		let interface = Gio.file_new_for_path(Me.path + '/interface.xml').load_contents();

		this.service.id = 
			Gio.DBus.user.own_name(
				'br.eti.werneck.statusicon',
				Gio.BusNameOwnerFlags.NONE,
				function() {
					global.log('br.eti.werneck.statusicon');
				},
				function() {
					global.log('Error getting br.eti.werneck.statusicon');
				}
			);

		this.service.wrapper = Gio.DBusExportedObject.wrapJSObject(interface, this);
		this.service.wrapper.export(Gio.DBus.user, '/controller');
	
	}

	deinit() {


	}

	enable() {

	}

	disable() {

	}

	// Add status icon to bar
	add(name) {
		global.log("Adding status icon " + name)
		return false;
	}

	// Remove status icon from bar 
	remove(name) {
		global.log("Removing status icon " + name)
		return false;
	}

}

function init() {

	global.log('Initializing status icon controller');

	if(controller === null) {
		controller = new Controller();
		controller.init()
	}

}

function deinit() {

	global.log('Deinitializing status icon controller');

	if(controller !== null) {
		controller.deinit()
		controller = null;
	}

}

function enable() {

	global.log('Enabling status icon controller');

	if(controller !== null) {
		controller.enable();
	}

}

function disable() {

	global.log('Enabling status icon controller');

	if(controller !== null) {
		controller.disable();
	}

}
