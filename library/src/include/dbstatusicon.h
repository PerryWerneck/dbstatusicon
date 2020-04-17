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

#ifndef DBSTATUSICON_H_INCLUDED

    #define DBSTATUSICON_H_INCLUDED

    #include <glib.h>
    #include <gtk/gtk.h>

    G_BEGIN_DECLS

    #define G_TYPE_DB_STATUS_ICON DbStatusIcon_get_type()

    #define DB_STATUS_ICON(obj)                     (G_TYPE_CHECK_INSTANCE_CAST ((obj), G_TYPE_DB_STATUS_ICON, DbStatusIcon))
    #define DB_STATUS_ICON_CLASS(klass)             (G_TYPE_CHECK_CLASS_CAST ((klass), G_TYPE_DB_STATUS_ICON, DbStatusIconClass))
    #define IS_DB_STATUS_ICON(obj)                  (G_TYPE_CHECK_INSTANCE_TYPE ((obj), G_TYPE_DB_STATUS_ICON))
    #define IS_DB_STATUS_ICON_CLASS(klass)          (G_TYPE_CHECK_CLASS_TYPE ((klass), G_TYPE_DB_STATUS_ICON))
    #define DB_STATUS_ICON_GET_CLASS(obj)           (G_TYPE_INSTANCE_GET_CLASS ((obj), G_TYPE_DB_STATUS_ICON, DbStatusIconClass))

    typedef struct _DbStatusIcon        DbStatusIcon;
    typedef struct _DbStatusIconClass   DbStatusIconClass;

    GType            DbStatusIcon_get_type();
    GObject        * db_status_icon_new(const gchar *name);

    void             db_status_icon_set_from_icon_name(GObject *status_icon, const gchar *icon_name);
	void			 db_status_icon_set_from_file(GObject *status_icon, const gchar *filename);
	void			 db_status_icon_set_title(GObject *status_icon, const gchar *title);
	void			 db_status_icon_set_visible(GObject *status_icon, gboolean visible);

    G_END_DECLS

#endif // DBSTATUSICON_H_INCLUDED
