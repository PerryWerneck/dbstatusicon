 
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
/*
class Indicator extends PanelMenu.Button {

	constructor(name, nameText, dontCreateMenu) {
		super(0.0, nameText, dontCreateMenu);
	}	

	set_icon(icon) {
	}
	
}
*/

// Main controller
class Controller {

	constructor() {

		this.icons = { };
		this.service = { 'id': null };
		this.icon_names = { };

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
					<method name="set_visible"> \
						<arg type="s" direction="in" /> \
						<arg type="b" direction="in" /> \
						<arg type="b" direction="out" /> \
					</method> \
					<method name="set_icon_name"> \
						<arg type="s" direction="in" /> \
						<arg type="s" direction="in" /> \
						<arg type="b" direction="out" /> \
					</method> \
					<method name="set_icon_from_file"> \
						<arg type="s" direction="in" /> \
						<arg type="s" direction="in" /> \
						<arg type="b" direction="out" /> \
					</method> \
					<method name="set_title"> \
						<arg type="s" direction="in" /> \
						<arg type="s" direction="in" /> \
						<arg type="b" direction="out" /> \
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

	enable() {
		this.log("Enabling status icon controller");
	}

	disable() {
		this.log("Enabling status icon controller");
	}

	// Add status icon to bar
	add(name, nameText, dontCreateMenu) {
		return false;
	}

	// Remove status icon from bar 
	remove(name) {
		return false;
	}

	get_indicator(name) {

		if(!this.icons.hasOwnProperty(name)) {
			throw new Error(`Indicator ${name} is not available`);
		}

		return this.icons[name]
	}

	set_visible(name, visible) {
		this.get_indicator(name).set_visible(visible);
		return true;
	}

	set_icon_name(name, icon_name) {

		if(!this.icon_names.hasOwnProperty(icon_name)) {
			this.icon_names[icon_name] = Gio.ThemedIcon.new_from_names([icon_name]);
		}

		this.get_indicator(name).set_icon(this.icon_names[icon_name]);

		return true;
	}

	set_icon_from_file(name, file) {

		let icon = Gio.icon_new_for_string(file);
		this.get_indicator(name).set_icon(icon);
		return true;

	}

	set_title(name, title) {
		this.get_indicator(name).set_title(title);
		return true;
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
