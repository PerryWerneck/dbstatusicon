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

#ifndef PRIVATE_H_INCLUDED

    #define PRIVATE_H_INCLUDED

    #define ENABLE_NLS

    #ifndef GETTEXT_PACKAGE
        #define GETTEXT_PACKAGE "dbstatusicon"
    #endif

    #include <libintl.h>
    #include <glib/gi18n-lib.h>

    #include <dbstatusicon.h>

    // not really I18N-related, but also a string marker macro
    #define I_(string) g_intern_static_string(string)

    enum _db_status_icon_property {

        DB_STATUS_PROPERTY_NONE,

        DB_STATUS_ICON_PROPERTY_NAME,
        DB_STATUS_ICON_PROPERTY_EMBEDDED,
        DB_STATUS_ICON_PROPERTY_ICON_NAME,
    };

    struct _DbStatusIcon {

        GObject       parent;
        gchar       * name;
        gboolean      embedded;

        gchar       * icon_name;

    };

   struct _DbStatusIconClass {

        GObjectClass parent_class;

        struct {
            GParamSpec * icon_name;
        } properties;

    };

    #define replace(ptr,value) g_free(ptr); ptr = g_strdup(value)

    G_GNUC_INTERNAL void db_status_icon_set_property(GObject *object, guint prop_id, const GValue *value, GParamSpec *pspec);
    G_GNUC_INTERNAL void db_status_icon_get_property(GObject *object, guint prop_id, GValue *value, GParamSpec *pspec);

    G_GNUC_INTERNAL DbStatusIcon * db_status_icon_try_embed(GObject *object);


#endif // PRIVATE_H_INCLUDED
