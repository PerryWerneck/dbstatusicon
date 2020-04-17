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

 #include "private.h"
 #include <dbstatusicon.h>

 static GObject * status_icon = NULL;

 static void set_string_property(GtkButton *button, GtkEntry *entry) {
 	const gchar * property	= g_object_get_data(G_OBJECT(entry),"status_icon_property");
	GValue 		  value		= G_VALUE_INIT;

	g_value_init (&value, G_TYPE_STRING);
	g_value_set_static_string(&value,gtk_entry_get_text(entry));

 	g_print("%s=%s\n",property,g_value_get_string(&value));

 	g_object_set_property(status_icon,property,&value);

	g_value_unset(&value);
 }

 static void toggle_boolean_property(GtkToggleButton *togglebutton, const gchar *property) {

	GValue 		  value		= G_VALUE_INIT;

	g_value_init (&value, G_TYPE_BOOLEAN);
	g_value_set_boolean(&value,gtk_toggle_button_get_active(togglebutton));

 	g_print("%s=%s\n",property,g_value_get_boolean(&value) ? "ON" : "OFF");

 	g_object_set_property(status_icon,property,&value);

	g_value_unset(&value);

 }

 static void activate(GtkApplication* app, G_GNUC_UNUSED gpointer user_data) {

	size_t		  ix;
	GtkWidget   * window	= gtk_application_window_new(app);
	GtkGrid		* grid		= GTK_GRID(gtk_grid_new());

	// Create labels
	static const gchar * labels[] = {
		"Title",
		"Standard icon name",
		"Icon file name"
	};

	for(ix = 0; ix < G_N_ELEMENTS(labels); ix++) {
		GtkWidget *widget = gtk_label_new(labels[ix]);
		gtk_label_set_xalign(GTK_LABEL(widget),1);
		gtk_grid_attach(grid,widget,0,ix,1,1);
	}

	// Create inputs
	static const gchar *properties[] = {
		"title",
		"icon-name",
		"icon-file"
	};

	for(ix = 0; ix < G_N_ELEMENTS(properties); ix++) {

		GtkWidget *entry = gtk_entry_new();
		gtk_widget_set_hexpand(entry,TRUE);
		gtk_grid_attach(grid,entry,1,ix,2,1);
		g_object_set_data(G_OBJECT(entry),"status_icon_property",(gpointer) properties[ix]);

		GtkWidget *button = gtk_button_new_with_label("Set");
		g_signal_connect(button,"clicked",G_CALLBACK(set_string_property),entry);

		gtk_grid_attach(grid,button,3,ix,1,1);
	}

	{
		GtkWidget * toggle = gtk_toggle_button_new_with_label("Visible");
		gtk_grid_attach(grid,toggle,1,3,1,1);
		g_signal_connect(toggle,"toggled",G_CALLBACK(toggle_boolean_property),"visible");
	}

	gtk_container_add(GTK_CONTAINER(window),GTK_WIDGET(grid));
	gtk_widget_show_all(window);

 }

 int main (int argc, char **argv) {

	GtkApplication *app;
	int status;

	// Setup locale
#ifdef LC_ALL
	setlocale( LC_ALL, "" );
#endif

//	textdomain("dbstatusicons");

	app = gtk_application_new ("br.eti.werneck.statusicons.testprogram",G_APPLICATION_FLAGS_NONE);

	g_signal_connect (app, "activate", G_CALLBACK(activate), NULL);

    status_icon = db_status_icon_new("test");

    db_status_icon_set_from_icon_name(status_icon,"microphone-sensitivity-high");

	status = g_application_run (G_APPLICATION (app), argc, argv);
	g_object_unref (app);

    g_object_unref(status_icon);
    status_icon = NULL;

	g_message("rc=%d",status);

	return 0;

}


