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

 void db_status_icon_get_property(GObject *object, guint prop_id, GValue *value, GParamSpec *pspec) {

    DbStatusIcon * icon = DB_STATUS_ICON(object);

    switch(prop_id) {
    case DB_STATUS_ICON_PROPERTY_NAME:
        g_value_set_string(value,icon->name);
        break;

    case DB_STATUS_ICON_PROPERTY_EMBEDDED:
        g_value_set_boolean(value,icon->embedded);
        break;

    default:
        G_OBJECT_WARN_INVALID_PROPERTY_ID(object, prop_id, pspec);

    }

 }
