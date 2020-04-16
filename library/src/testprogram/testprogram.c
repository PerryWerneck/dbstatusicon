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

static void activate(GtkApplication* app, G_GNUC_UNUSED gpointer user_data) {

	GtkWidget	* window	= gtk_application_window_new(app);


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

	status = g_application_run (G_APPLICATION (app), argc, argv);
	g_object_unref (app);

	g_message("rc=%d",status);

	return 0;

}


