 
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

const { Gio, St, GObject, GLib } = imports.gi;
const Lang = imports.lang;

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

		this.actor.add_child(this.box);

		// APP Binding
		// this.subscription_id = null;
		// this.application_id = null;
		// this.object_path = null;
		// this.items = { }
	
		Main.panel.addToStatusArea('status-icon-' + name, this);
	}

	destroy() {

		super.destroy();
	}

	set_icon(name) {
		this.icon.set_gicon(Gio.ThemedIcon.new_from_names([name]));
		return true;
	}

});

const DBStatusIconExtension =
class DBStatusIconExtension {

	constructor() {

		// ExtensionUtils.initTranslations();

		log('Loading dbstatus icons');
		this.childen = { };

	}

	enable() {

		log('Enabling dbstatus icons');

		this.add('br.com.bb.pw3270.unstable','Icon test');
		

	}

	disable() {

		log('Disabling dbstatus icons');

		this.remove('br.com.bb.pw3270.unstable');
		
	}

	add(name, text) {

		if(name in this.childen) {
			log("Icon " + name + " was already registered");
			return false;
		}
	
		log("Creating indicator \"" + name + "\".");
		
		this.childen[name] = {
			
			'widget': new Indicator(this, name, text)
		}
	
		Main.panel.addToStatusArea(name, this.childen[name].widget);

		return true;
	}

	remove(name) {

		if(name in this.childen) {
	
			log("Removing indicator \"" + name + "\".");
			
			if(this.childen[name].widget) {
				this.childen[name].widget.destroy();
			}

			delete this.childen[name];

			return true;

		}

		log('Indicator ' + name + ' is not registered');

		return false;
	}

}


function init() {
	return new DBStatusIconExtension();
}
