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

 void db_status_icon_set_property(GObject *object, guint prop_id, const GValue *value, GParamSpec *pspec) {

    DbStatusIcon * icon = DB_STATUS_ICON(object);

    switch(prop_id) {
    case DB_STATUS_ICON_PROPERTY_NAME:
        if(icon->name) {
            g_free(icon->name);
        }
        icon->name = g_strdup(g_value_get_string(value));
        break;

    case DB_STATUS_ICON_PROPERTY_EMBEDDED:
        g_warning("Can't set embedded property");
        break;

    default:
        G_OBJECT_WARN_INVALID_PROPERTY_ID(object, prop_id, pspec);

    }

 }

 void db_status_icon_set_from_icon_name(GObject *object, const gchar *icon_name) {

    DbStatusIcon * icon = db_status_icon_try_embed(object);
    if(!icon)
        return;

    if(icon->icon_name && !strcmp(icon_name,icon->icon_name))
        return;



    replace(icon->icon_name,icon_name);
    g_object_notify_by_pspec(G_OBJECT(icon), DB_STATUS_ICON_GET_CLASS(icon)->properties.icon_name);

 }
