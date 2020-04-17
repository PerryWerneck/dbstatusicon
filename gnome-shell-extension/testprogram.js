
const { GLib, Gtk, Gio } = imports.gi;
const Extension = imports.extension;
const PanelMenu = imports.ui.panelMenu;

//
// Load extension
//
let controller = Extension.get_controller()

controller.log = function(msg) {
	print(msg)
}

class indicator {

	constructor() {
		this.button = new Gtk.Button();
		this.image = new Gtk.Image();
		this.button.set_image(this.image);
	}	

	set_icon(icon) {
		this.image.set_from_gicon(icon,Gtk.IconSize.BUTTON);
	}

	set_visible(visible) {
		if(visible) {
			this.button.show_all();
		} else {
			this.button.hide();
		}
	}

	set_title(title) {

	}

}

controller.add = function(name, nameText, dontCreateMenu) {

	if(this.icons.hasOwnProperty(name)) {
		print("Icon " + name + " was already registered");
		return true;
	}

	this.icons[name] = new indicator();
	this.button_box.pack_start(this.icons[name].button, false, false, 0);

	return true;
}


//
// Create a GTK Application
//
const application = new Gtk.Application({
    application_id: 'br.eti.werneck.extensions.test',
    flags: Gio.ApplicationFlags.FLAGS_NONE
});

application.connect('activate', app => {
    let activeWindow = app.activeWindow;

    if (!activeWindow) {
		
		// No window, create a new one
		// http://gjs.guide/guides/gtk/gtk-tutorial/10-building-app.html#creating-a-new-application
		activeWindow = new Gtk.ApplicationWindow({
            application: app
		});	

		activeWindow.set_title('Extension test');

		controller.button_box = new Gtk.ButtonBox({
            orientation: Gtk.Orientation.HORIZONTAL
		});

//		controller.button_box.pack_start(new Gtk.Button({ 'label': 'test'}), false, false, 0);
		
		activeWindow.add(controller.button_box);
		activeWindow.show_all();

		controller.add("test","Sample indicator",false);
		controller.set_icon_name("test","network-offline");
		controller.set_visible("test",true)
		
	}

    activeWindow.present();
});

controller.init();
controller.enable();

application.run(null);

