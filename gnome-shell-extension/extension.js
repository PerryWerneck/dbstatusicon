 
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

const { Gio } = imports.gi;
const Lang = imports.lang;

// https://github.com/GNOME/gnome-shell/blob/master/js/ui/panelMenu.js
const PanelMenu = imports.ui.panelMenu;

/*
const Main = imports.ui.main;

const PanelMenu = imports.ui.panelMenu;

// https://stackoverflow.com/questions/20394840/how-to-set-a-png-file-in-a-gnome-shell-extension-for-st-icon
const Me = imports.misc.extensionUtils.getCurrentExtension();
*/

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
class Controller {

	constructor() {

		this.icons = { }	// Indicator list
		this.service = { 'id': null }

	}

	init() {

		this.log("Initializing status icon controller");
		// let intf = Gio.file_new_for_path(Me.path + '/interface.xml').load_contents(null)];

		this.service.id = 
			Gio.DBus.session.own_name(
				'br.eti.werneck.statusicon',
				Gio.BusNameOwnerFlags.NONE,
				function() {
					print('Got br.eti.werneck.statusicon');
				},
				function() {
					print('Error getting br.eti.werneck.statusicon');
				}
			);

		const intf = 
			'<node> \
				<interface name="br.eti.werneck.statusicons"> \
					<method name="add"> \
						<arg type="s" direction="in" /> \
						<arg type="s" direction="in" /> \
						<arg type="b" direction="in" /> \
						<arg type="b" direction="out" /> \
					</method> \
					<method name="remove"> \
						<arg type="s" direction="in" /> \
						<arg type="b" direction="out" /> \
					</method> \
					<method name="abend"> \
					</method> \
				</interface> \
			</node>';

		this.service.wrapper = Gio.DBusExportedObject.wrapJSObject(intf, this);
		this.service.wrapper.export(Gio.DBus.session, '/controller');
	
	}

	deinit() {

		this.log("Deinitializing status icon controller");


	}

	log(msg) {
		global.log('[statusicons]', msg)
		print(msg)
	}

	// Quick and dirty hack to use gnome shell extension reload
	abend() {
		throw new Error('Abend!');
	}

	enable() {
		this.log("Enabling status icon controller");
	}

	disable() {
		this.log("Enabling status icon controller");
	}

	// Add status icon to bar
	add(name, nameText, dontCreateMenu) {

		if(this.icons.hasOwnProperty(name)) {
			this.log("Icon " + name + " was already registered");
			return true;
		}

		this.log("Adding status icon " + name)

		try {

			let icon = new Indicator(0.0, nameText, dontCreateMenu)

			icon.connect('destroy', Lang.bind(this, function(icon) {

				print(icon)
	
			}));

			// Store for future use.
			this.icons[name] = icon;

		} catch(e) {

			this.log("Can't add icon " + name + " - " + e.message);
			print(e.stack);

			return false;

		}

		return true;
	}

	// Remove status icon from bar 
	remove(name) {
		this.log("Removing status icon " + name)
		return false;
	}

}

function get_controller() {

	Controller.instance = new Controller();
	return Controller.instance;

}

function init() {

	if(Controller.instance === null) {
		Controller.instance = new Controller();
		Controller.instance.init()
	}

}

function deinit() {

	if(Controller.instance !== null) {
		Controller.instance.deinit()
		Controller.instance = null;
	}

}

function enable() {

	if(Controller.instance !== null) {
		Controller.instance.enable()
	}

}

function disable() {

	if(Controller.instance !== null) {
		Controller.instance.disable()
	}

}
