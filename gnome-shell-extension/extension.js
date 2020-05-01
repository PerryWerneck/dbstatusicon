 
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

const { Gio, St, GLib } = imports.gi;
const Lang = imports.lang;

// https://github.com/GNOME/gnome-shell/blob/master/js/ui/panelMenu.js
// https://github.com/GNOME/gnome-shell/blob/master/js/ui/panel.js
const PanelMenu = imports.ui.panelMenu;

// https://github.com/GNOME/gnome-shell/blob/master/js/ui/popupMenu.js
const PopupMenu = imports.ui.popupMenu;

const Main = imports.ui.main;

const Clutter = imports.gi.Clutter;
const Me = imports.misc.extensionUtils.getCurrentExtension();

/*
const Main = imports.ui.main;

const PanelMenu = imports.ui.panelMenu;

// https://stackoverflow.com/questions/20394840/how-to-set-a-png-file-in-a-gnome-shell-extension-for-st-icon
const Me = imports.misc.extensionUtils.getCurrentExtension();
*/

// Indicator
class Indicator extends PanelMenu.Button {

	constructor(nameText) {

		super(0.0, nameText, false);

		this.icon = new St.Icon();
		this.icon.set_icon_size(20);

		this.box = new St.BoxLayout();
		this.box.add_child(this.icon);

		this.actor.add_child(this.box);

		this.items = { }

	}	

	set_icon(icon) {
		this.icon.set_gicon(icon);
	}
	
	set_visible(visible) {

		if(visible) {
			this.box.show();
		} else {
			this.box.hide();
		}

	}

	set_title(title) {
	}

	append_action_menu_item(dest, path, action, text) {

		if(this.items.hasOwnProperty(action)) {
			return;
		}

		this.items[action] = {
			'container':  new PopupMenu.PopupBaseMenuItem(),
			'dest': dest,
			'path': path,
			'action': action,
			'label': new St.Label({
							text: text,
							y_expand: false,
							y_align: Clutter.ActorAlign.START,
							x_align: Clutter.ActorAlign.START
						})
		};

		this.items[action].container.actor.add(this.items[action].label);
		this.items[action].container.connect('activate', Lang.bind(this.items[action], function() {
		
			global.log('Activating action ' + this.action);

			// https://lazka.github.io/pgi-docs/Gio-2.0/classes/DBusConnection.html#Gio.DBusConnection.call
			Gio.DBus.session.call(
				this.dest,											// bus_name
				this.path,											// path
				'org.gtk.Actions',									// Interface
				'Activate',											// method
				new GLib.Variant('(sava{sv})', [this.action, [], {}]),	// Parameters
				null,												// Reply_type
				Gio.DBusCallFlags.NONE,								// Flags
				-1,													// timeout_msec
				null,												// Cancelable
				Lang.bind(this, function(connection, res) {

					try {

						global.log('Got D-Bus response');
						connection.call_finish(res);

					} catch(e) {

						global.log(e);
						global.log(e.stack);

					}

				}));
		
		}));

		this.menu.addMenuItem(this.items[action].container);

	}

	menu_item_set_enabled(item,enabled) {
		
	}

}

// Main controller
class Controller {

	constructor() {

		this.indicators = { };
		this.service = { 'id': null };
		this.icon_names = { };
		this.application_id = null;
		this.object_path = null;

	}

	init() {

		this.log("Initializing status icon controller");

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
					<method name="set_application_id"> \
						<arg type="s" direction="in" /> \
					</method> \
					<method name="set_object_path"> \
						<arg type="s" direction="in" /> \
					</method> \
					<method name="append_action_menu_item"> \
						<arg type="s" direction="in" /> \
						<arg type="s" direction="in" /> \
						<arg type="s" direction="in" /> \
					</method> \
					<method name="menu_item_set_enabled"> \
						<arg type="s" direction="in" /> \
						<arg type="s" direction="in" /> \
						<arg type="b" direction="in" /> \
					</method> \
				</interface> \
			</node>';

		this.service.wrapper = Gio.DBusExportedObject.wrapJSObject(intf, this);
		this.service.wrapper.export(Gio.DBus.session, '/controller');

	}

	deinit() {

		this.log("Deinitializing status icon controller");

		for(indicator in this.indicators) {
			this.indicators[indicator].destroy();
		}

		this.indicators = { };
	}

	log(msg) {
		global.log('[statusicons]', msg)
		print(msg)
	}

	enable() {
		this.log("Enabling status icon controller");

		for(indicator in this.indicators) {
			this.indicators[indicator].box.show();
		}

	}

	disable() {
		this.log("Disabling status icon controller");

		for(indicator in this.indicators) {
			this.indicators[indicator].box.hide();
		}

	}

	// Add status icon to bar
	add(name, nameText) {

		if(this.indicators.hasOwnProperty(name)) {
			this.log("Icon " + name + " was already registered");
			return true;
		}
	
		this.log("Creating indicator \"" + name + "\".");
		
		this.indicators[name] = new Indicator(nameText);
	
		Main.panel.addToStatusArea('status-icon-' + name, this.indicators[name]);

		return true;
	}

	// Remove status icon from bar 
	remove(name) {

		if(!this.indicators.hasOwnProperty(name)) {
			return false;
		}

		this.indicators[name].destroy();
		delete this.indicators[name];
		
		return true;
	}

	get_indicator(name) {

		if(!this.indicators.hasOwnProperty(name)) {
			throw new Error(`Indicator ${name} is not available`);
		}

		return this.indicators[name]
	}

	set_visible(name, visible) {
		global.log("Changing status to " + (visible ? "Visible" : "Non-visible"))
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

	set_application_id(application_id) {
		this.application_id = application_id;
	}

	set_object_path(object_path) {
		this.object_path = object_path;
	}

	append_action_menu_item(name,action_name,label) {

		this.get_indicator(name).append_action_menu_item(
			this.application_id,
			this.object_path,
			action_name,
			label
		);
	}

	menu_item_set_enabled(name,item,enabled) {
		this.get_indicator(name).menu_item_set_enabled(item,enabled);
	}	
}

let instance = null;

function get_controller() {

	if(!instance) {
		instance = new Controller();
	}

	return instance;

}

function init() {

	get_controller().init();

}

function deinit() {

	if(instance !== null) {
		instance.deinit()
		instance = null;
	}

}

function enable() {

	let controller = get_controller();

	controller.enable();

}

function disable() {

	get_controller().disable();

}
