
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

		let box = new Gtk.ButtonBox({
            orientation: Gtk.Orientation.HORIZONTAL
		});

		box.pack_start(new Gtk.Button({ 'label': 'test'}), false, false, 0);
		
		PanelMenu.set_button_box(box);

		activeWindow.add(box);
		activeWindow.show_all();

		controller.add("test","Sample indicator",false);
		controller.set_visible("test",true)
		
	}

    activeWindow.present();
});

controller.init();
controller.enable();

application.run(null);

