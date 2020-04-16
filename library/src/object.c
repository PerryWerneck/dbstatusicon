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
