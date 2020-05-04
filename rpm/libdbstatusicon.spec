#
# spec file for package libdbstatusicon
#
# Copyright (c) 2019 SUSE LLC
# Copyright (c) <2008> <Banco do Brasil S.A.>
#
# All modifications and additions to the file contributed by third parties
# remain the property of their copyright owners, unless otherwise agreed
# upon. The license for this file, and modifications and additions to the
# file, is the same license as for the pristine package itself (unless the
# license for the pristine package is not an Open Source License, in which
# case the license is the MIT License). An "Open Source License" is a
# license that conforms to the Open Source Definition (Version 1.9)
# published by the Open Source Initiative.

# Please submit bugfixes or comments via https://bugs.opensuse.org/
#


Name:           libdbstatusicon
Version:        1.0
Release:        0
Summary:        D-Bus based replacement for the deprecated GtkStatusIcon
License:        LGPL-3.0-only
Group:          System/Libraries
URL:            https://github.com/PerryWerneck/dbstatusicon
Source:         dbstatusicon-%{version}.tar.xz
BuildRequires:  autoconf >= 2.61
BuildRequires:  automake
BuildRequires:  binutils
BuildRequires:  coreutils
BuildRequires:  fdupes
BuildRequires:  gcc-c++
BuildRequires:  gettext-devel
BuildRequires:  m4
BuildRequires:  pkgconfig
BuildRequires:  pkgconfig(gtk+-3.0)
BuildRequires:  pkgconfig(glib-2.0)
BuildRequires:  xz

%if 0%{?centos_version}
# CENTOS Requires gdb for debuginfo
BuildRequires:  gdb
%endif

%description

#---[ Library ]-------------------------------------------------------------------------------------------------------

%define MAJOR_VERSION %(echo %{version} | cut -d. -f1)
%define MINOR_VERSION %(echo %{version} | cut -d. -f2)
%define _libvrs %{MAJOR_VERSION}_%{MINOR_VERSION}

%package -n %{name}%{_libvrs}
Summary:        D-Bus based replacement for GtkStatusIcon
Group:          Development/Libraries/C and C++
Recommends:	gnome-shell-extension-dbstatusicons

%description -n %{name}%{_libvrs}
D-Bus based replacement for GtkStatusIcon - Main library

%package devel
Summary:        D-Bus based replacement for GtkStatusIcon
Group:          Development/Libraries/C and C++
Requires:       %{name}%{_libvrs} = %{version}

%description devel
D-Bus based replacement for GtkStatusIcon - development files

#---[ Gnome Shell Extension ]-----------------------------------------------------------------------------------------

%package -n gnome-shell-extension-dbstatusicons
Summary:        Gnome shell extension for %{name}
Group:          System/GUI/GNOME
Requires:       %{name}%{_libvrs} = %{version}

%description -n gnome-shell-extension-dbstatusicons

#---[ Build & Install ]-----------------------------------------------------------------------------------------------

%prep
%setup -n dbstatusicon-%{version}

NOCONFIGURE=1 \
	./autogen.sh

%configure

%build
make all %{?_smp_mflags}

%install

%make_install
%fdupes %{buildroot}/%{_prefix}

%files -n %{name}%{_libvrs}
%defattr(-,root,root)

# https://en.opensuse.org/openSUSE:Packaging_for_Leap#RPM_Distro_Version_Macros
%if 0%{?sle_version} > 120200
%doc AUTHORS README.md
%license LICENSE
%else
%doc LICENSE AUTHORS README.md
%endif

%{_libdir}/*.so.%{MAJOR_VERSION}.%{MINOR_VERSION}

%files devel
%defattr(-,root,root)

%{_includedir}/*.h
%{_libdir}/*.so

%files -n gnome-shell-extension-dbstatusicons
%defattr(-,root,root)

%dir %{_datadir}/gnome-shell
%dir %{_datadir}/gnome-shell/extensions
%dir %{_datadir}/gnome-shell/extensions/statusicons@werneck.eti.br

%{_datadir}/gnome-shell/extensions/statusicons@werneck.eti.br/*

%post -n %{name}%{_libvrs} -p /sbin/ldconfig
%postun -n %{name}%{_libvrs} -p /sbin/ldconfig

%changelog


