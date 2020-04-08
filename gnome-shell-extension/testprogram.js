
const GLib = imports.gi.GLib;
const Extension = imports.extension;

Extension.init();
Extension.enable();

(new GLib.MainLoop(null, false)).run();

