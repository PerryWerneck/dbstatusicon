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
 #include <unistd.h>
 #include <limits.h>
 #include <errno.h>

 static void replace_string(DbStatusIcon * icon, enum _db_status_icon_string ix, const gchar *value) {

	if(icon->strings[ix])
		g_free(icon->strings[ix]);

	icon->strings[ix] = g_strdup(value);

 }

 void db_status_icon_set_property(GObject *object, guint prop_id, const GValue *value, GParamSpec *pspec) {

    DbStatusIcon * icon = DB_STATUS_ICON(object);

    switch(prop_id) {
    case DB_STATUS_ICON_PROPERTY_NAME:
    	{
    		if(icon->name)
				g_free(icon->name);
			icon->name = g_strdup(g_value_get_string(value));
    	}
		break;

    case DB_STATUS_ICON_PROPERTY_EMBEDDED:
        g_warning("Can't set embedded property");
        break;

    default:
        G_OBJECT_WARN_INVALID_PROPERTY_ID(object, prop_id, pspec);

    }

 }

 static gboolean set_string_property(GObject *object, enum _db_status_icon_string ix, const gchar *value) {

	static const gchar *methods[DB_STATUS_ICON_STRINGS] = {
		"set_icon_name",
		"set_title",
		"set_icon_from_file",
	};

    DbStatusIcon * icon = db_status_icon_try_embed(object);
    if(!icon) {
        return FALSE;
    }

    if(icon->strings[ix] && !strcmp(value,icon->strings[ix])) {
        return FALSE;
    }

	//
	// Notify service
	//
    GError * error = NULL;
    GVariant * response = NULL;

    GDBusConnection * connection = g_bus_get_sync(G_BUS_TYPE_SESSION, NULL, &error);

    if(!error) {

		response =
			g_dbus_connection_call_sync(
				connection,
				DBUS_STATUS_ICON_BUS_NAME,
				DBUS_STATUS_ICON_CONTROLLER_PATH,
				DBUS_STATUS_ICON_CONTROLLER_INTERFACE,
				methods[ix],
				g_variant_new(
					"(ss)",
						icon->name,
						value
				),
				NULL,
				G_DBUS_CALL_FLAGS_NONE,
				-1,
				NULL,
				&error
			);

    }

	if(error) {
		g_warning("Error calling \"%s\": %s",methods[ix],error->message);
		g_error_free(error);
		return FALSE;
	}

	gboolean rc = FALSE;

	if(response) {
		g_variant_get(response, "(b)", &rc);
	}

	if(rc) {
		replace_string(icon, ix, value);
		g_object_notify_by_pspec(G_OBJECT(icon), DB_STATUS_ICON_GET_CLASS(icon)->properties.strings[ix]);
	}

	return rc;

 }

 void db_status_icon_set_from_icon_name(GObject *object, const gchar *icon_name) {
	set_string_property(object, DB_STATUS_ICON_ICON_NAME, icon_name);
 }

 void db_status_icon_set_from_file(GObject *object, const gchar *filename) {

	if(!(filename && *filename)) {
		return;
	}

    // Get real path
    char linkname[PATH_MAX+1];
    ssize_t bytes = readlink(filename, linkname, PATH_MAX);
	if(bytes < 0) {
		if(errno != EINVAL) {
			g_warning("Can't read link: %s",strerror(errno));
		}
	} else {
		linkname[bytes] = 0;
		filename = linkname;
	}

	set_string_property(object, DB_STATUS_ICON_FILENAME, filename);
 }

 void db_status_icon_set_title(GObject *object, const gchar *title) {
	set_string_property(object, DB_STATUS_ICON_TITLE, title);
 }
