
const { GLib, Gtk, Gio } = imports.gi;
const Extension = imports.extension;
const PanelMenu = imports.ui.panelMenu;

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
            application: app,
            defaultHeight: 600,
            defaultWidth: 800
		});	

		activeWindow.set_title('Extension test');
		
	}

    activeWindow.present();
});

//
// Load extension
//
let controller = Extension.get_controller()

controller.log = function(msg) {
	print(msg)
}

controller.init();
controller.enable();
controller.add("test","Sample indicator",false);

application.run(null);

