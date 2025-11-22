import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sistem Peminjaman Ruangan Polinela",
    short_name: "Peminjaman Polinela",
    description: "Sistem manajemen peminjaman ruangan gedung Politeknik Negeri Lampung",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/assets/android-icon-36x36.png",
        sizes: "36x36",
        type: "image/png",
      },
      {
        src: "/assets/android-icon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/assets/android-icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        src: "/assets/android-icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "/assets/android-icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: "/assets/android-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}
