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

/*
 * Fake panel menu for extension testing.
 *
 */

/* jshint -W100 */
/* history */
/* exported Button */

// https://github.com/GNOME/gnome-shell/blob/master/js/ui/panelMenu.js

/*
imports.gi.versions.Gtk = "3.0";
const { GObject, Gtk } = imports.gi;

var Button = GObject.registerClass({
    Signals: { 'menu-set': {}, 'destroy': {} },
}, class PanelMenuButton extends GObject.Object {
		_init(menuAlignment, nameText, dontCreateMenu) {
			super._init()

			this.actor = new Gtk.Button();
		}

		set_visible(visible) {

		}
	}
);

function set_button_box(box) {
	buttonbox = box;
}
*/