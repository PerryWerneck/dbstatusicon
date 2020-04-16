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

 G_DEFINE_TYPE(DbStatusIcon, DbStatusIcon, G_TYPE_OBJECT);

 static void dispose(GObject *object) {

    DbStatusIcon * icon = DB_STATUS_ICON(object);

    if(icon->embedded) {

        // Remove icon from tray


        icon->embedded = FALSE;
    }

    // Release resources
    if(icon->name) {
        g_free(icon->name);
        icon->name = NULL;
    }

    if(icon->icon_name) {
        g_free(icon->icon_name);
        icon->icon_name = NULL;
    }

    if(icon->title) {
        g_free(icon->title);
        icon->name = NULL;
    }

 }

 static void DbStatusIcon_class_init(DbStatusIconClass *klass) {

    GObjectClass * gobject_class = G_OBJECT_CLASS(klass);

    gobject_class->dispose = dispose;
    gobject_class->set_property = db_status_icon_set_property;
    gobject_class->get_property = db_status_icon_get_property;

    // Create properties
    GParamSpec * spec;

    spec = g_param_spec_string(
                "name",
                "name",
                _("The status icon name"),
                NULL,
                G_PARAM_READWRITE|G_PARAM_CONSTRUCT_ONLY|G_PARAM_STATIC_NAME
            );

    g_object_class_install_property(
            gobject_class,
            DB_STATUS_ICON_PROPERTY_NAME,
            spec
    );

    spec = g_param_spec_boolean(
            "embedded",
            "embedded",
            _("True if the icon is embedded in the status bar"),
            FALSE,
            G_PARAM_READABLE
    );

   g_object_class_install_property(
            gobject_class,
            DB_STATUS_ICON_PROPERTY_EMBEDDED,
            spec
    );

    klass->properties.icon_name = g_param_spec_string(
                "icon-name",
                "icon-name",
                _("The name of the status icon"),
                NULL,
                G_PARAM_READWRITE|G_PARAM_STATIC_NAME
            );

    g_object_class_install_property(
            gobject_class,
            DB_STATUS_ICON_PROPERTY_ICON_NAME,
            klass->properties.icon_name
    );


 }

 static void DbStatusIcon_init(DbStatusIcon *object) {

    // Just in case
    object->embedded = FALSE;
    object->name = NULL;


 }

 GObject * db_status_icon_new(const gchar *name) {

    if(name && *name)
        return g_object_new(G_TYPE_DB_STATUS_ICON, "name", name, NULL);

    return NULL;

 }


 DbStatusIcon * db_status_icon_try_embed(GObject *object) {

    g_return_val_if_fail(IS_DB_STATUS_ICON(object),NULL);

    DbStatusIcon * icon = DB_STATUS_ICON(object);

    if(icon->embedded)
        return icon;

    // Icon isn't registered, call service.
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
				"add",
				g_variant_new(
					"(ssb)",
						icon->name,
						icon->title ? icon->title : "",
						TRUE
				),
				NULL,
				G_DBUS_CALL_FLAGS_NONE,
				-1,
				NULL,
				&error
			);

    }

	if(error) {
		g_warning("%s",error->message);
		g_error_free(error);
		icon->embedded = FALSE;
		return NULL;
	}

	if(response) {
		// Get response.

		g_variant_unref(response);
	}

    return icon;

 }

