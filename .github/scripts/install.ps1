Invoke-WebRequest "http://ftp.gnome.org/pub/GNOME/binaries/win64/gtk+/2.22/gtk+-bundle_2.22.1-20101229_win64.zip" -OutFile "gtk.zip"
Expand-Archive gtk.zip -DestinationPath "C:\GTK"
Invoke-WebRequest "https://downloads.sourceforge.net/project/libjpeg-turbo/2.0.4/libjpeg-turbo-2.0.4-vc64.exe" -OutFile "libjpeg.exe" -UserAgent NativeHost .\libjpeg.exe /S