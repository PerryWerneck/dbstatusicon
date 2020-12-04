 
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

const { Gio, St, GObject, GLib, Clutter } = imports.gi;
const Lang = imports.lang;

// https://stackoverflow.com/questions/20394840/how-to-set-a-png-file-in-a-gnome-shell-extension-for-st-icon
const Me = imports.misc.extensionUtils.getCurrentExtension();

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

// /usr/share/gnome-shell/extensions/Panel_Favorites@rmy.pobox.com/extension.js 

// Adicionando no painel:
//
// let PlacesMenu = GObject.registerClass(
// class PlacesMenu extends PanelMenu.Button {
//
// Main.panel.addToStatusArea('places-menu', _indicator, 1, 'left');

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
	_init(controller, name, text) {
        super._init(0.0, text, false);

		log('Creating indicator ' + name + ': ' + text)

		this.controller = controller;
		this.icon = new St.Icon();
		this.icon.set_icon_size(20);
		this.icon.set_gicon(Gio.ThemedIcon.new_from_names([name]));

		this.box = new St.BoxLayout();
		this.box.add_child(this.icon);

		// TODO: This is deprecated.
		this.actor.add_child(this.box);

		// APP Binding
		this.application = {
			'id': null,
			'path': null,
			'signal': null,
			'actions': { }
		};

		Main.panel.addToStatusArea('status-icon-' + name, this);

	}

	destroy() {

		if(this.application.signal) {
			Gio.DBus.system.signal_unsubscribe(this.application.signal);			
			this.application.signal = null;
		}		

		super.destroy();
	}

	set_icon_name(name) {
		this.icon.set_gicon(Gio.ThemedIcon.new_from_names([name]));
		return true;
	}

	_subscribe_to_application() {

		if(this.application.signal) {
			Gio.DBus.system.signal_unsubscribe(this.application.signal);			
			this.application.signal = null;
		}		

		if(this.application.id && this.application.path) {

			this.application.signal = 
			Gio.DBus.session.signal_subscribe(
				null,									// sender name to match on (unique or well-known name) or null to listen from all senders
				null,									// D-Bus interface name to match on or null to match on all interfaces
				'Changed',								// D-Bus signal name to match on or null to match on all signals
				this.application.path,					// object path to match on or null to match on all object paths
				null,									// contents of first string argument to match on or null to match on all kinds of arguments
				Gio.DBusSignalFlags.NONE,				// flags describing how to subscribe to the signal (currently unused)
				Lang.bind(this, function(conn, sender, object_path, interface_name, signal_name, args) {
			
					try {

						if(interface_name == 'org.gtk.Actions') {

							for(let item in this.application.actions) {

								let action = args.get_child_value(1).lookup_value(item,null);
								
								if(action in this.application.actions) {
									this.application.actions[action].widget.setSensitive(value.get_boolean());
								}

							}
	
						}

					} catch(e) {

						log(e);
						log(e.stack);

					}
			
				})
			);

			return true;
		}

		return false;
	}

	set_application(application_id, object_path) {

		if(this.application.id == application_id && this.application.path == object_path)
			return false;

		this.application.id = application_id;
		this.application.path = object_path;

		return this._subscribe_to_application();
	}	

	set_application_id(application_id) {
		if(this.application.id == application_id)
			return false;
		
		this.application.id = application_id;
		return this._subscribe_to_application();
	}

	set_object_path(object_path) {
		it(this.application.path == object_path)
			return false;

		this.application.path = object_path;
		return this._subscribe_to_application();
	}

	append_action(name, text) {

		if(name in this.application.actions) {
			return false;
		}

		this.application.actions[name] =  {
			'name': name, 
			'application': this.application,
			'widget': new PopupMenu.PopupBaseMenuItem(),
		};

		this.application.actions[name].widget.actor.add(		
			new St.Label({
				text: text,
				y_expand: false,
				y_align: Clutter.ActorAlign.START,
				x_align: Clutter.ActorAlign.START
			})
		);
		
		this.menu.addMenuItem(this.application.actions[name].widget);

		this.application.actions[name].widget.connect('activate', Lang.bind(this.application.actions[name], function() {
		
			log(`Activating action '${this.name}'`);

			Gio.DBus.session.call(
				this.application.id,									// bus_name
				this.application.path,									// path
				'org.gtk.Actions',										// Interface
				'Activate',												// method
				new GLib.Variant('(sava{sv})', [this.name, [], {}]),	// Parameters
				null,													// Reply_type
				Gio.DBusCallFlags.NONE,									// Flags
				-1,														// timeout_msec
				null,													// Cancelable
				Lang.bind(this, function(connection, res) {

					try {

						log('Got D-Bus response');
						connection.call_finish(res);

					} catch(e) {

						log(e);
						log(e.stack);

					}

				}));			

		}));

		return true;
	}

	enable() {
		this.box.show();
	}

	disable() {
		this.box.hide();
	}

});

const DBStatusIconExtension =
class DBStatusIconExtension {

	constructor() {

		// ExtensionUtils.initTranslations();

		log('Loading dbstatus icons');
		this.children = { };

		this.service = {
			'id':
				Gio.DBus.session.own_name(
					'br.eti.werneck.statusicon',
					Gio.BusNameOwnerFlags.NONE,
					function() {
						log('Got br.eti.werneck.statusicon');
					},
					function() {
						log('Error getting br.eti.werneck.statusicon');
					}
				)

		};

		let file = Gio.file_new_for_path(Me.path + '/interface.xml');
		let [flag, data] = file.load_contents(null);
		if(flag) {

			this.service.wrapper = 
				Gio.DBusExportedObject.wrapJSObject(
					String.fromCharCode.apply(null, data), this
				);

			this.service.wrapper.export(Gio.DBus.session,'/br/eti/werneck/statusicon/controller');

		}

		// TODO:
		//
		// Subscribe path=/org/freedesktop/DBus; interface=org.freedesktop.DBus; member=NameLost
		// and use this signal to remove icon when application exits.
		//

	}

	enable() {

		log('Enabling dbstatus icons');

		for(let name in this.children) {
			this.children[name].widget.enable();
		}

	}

	disable() {

		log('Disabling dbstatus icons');

		for(let name in this.children) {
			this.children[name].widget.disable();
		}

	}

	add(name, text) {

		if(name in this.children) {
			log(`Indicator ${name} is registered`);
			return false;
		}
	
		log(`Adding indicator ${name}`);
		
		this.children[name] = {
			
			'icon_name': name,
			'visible': true,
			'widget': new Indicator(this, name, text)
		}
	
		Main.panel.addToStatusArea(name, this.children[name].widget);

		return true;
	}

	remove(name) {

		if(name in this.children) {
	
			log(`Removing indicator ${name}`);
			
			if(this.children[name].widget) {
				this.children[name].widget.destroy();
			}

			delete this.children[name];

			return true;

		}

		log(`Indicator ${name} is not registered`);

		return false;
	}

	get_version() {
		return "1.0";
	}

	get_child(name) {

		if(name in this.children) {
			return this.children[name]
		}
	
		throw new Error(`Indicator ${name} is not available`);
	
	}
	
	set_visible(name, visible) {
	
		let child = this.get_child(name);

		if(child.visible == visible)
			return false;

		child.visible = visible;

		return true;
	}

	set_icon_name(name, icon_name) {

		let child = this.get_child(name);

		if(child.icon_name == icon_name)
			return false;
		
		child.icon_name = icon_name;
		
		if(child.widget) {
			child.widget.set_icon_name(icon_name);
		}

		return true;

	}

	set_icon_from_file(name, file) {
		return false;
	}

	set_title(name, title) {
	}

	set_application(name, application_id, object_path) {
		this.get_child(name).widget.set_application(application_id, object_path);
	}	

	set_application_id(name, application_id) {
		this.get_child(name).widget.set_application_id(this.set_application_id);
	}

	set_object_path(name, object_path) {
		this.get_child(name).widget.set_object_path(object_path);
	}

	append_action_menu_item(name,action_name,label) {
		this.get_child(name).widget.append_action(action_name,label);
	}	

	menu_item_set_enabled(name,item,enabled) {
	}

}

function init() {
	return new DBStatusIconExtension();
}
