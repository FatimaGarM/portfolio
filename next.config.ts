import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Los PDF (el CV) se pueden descargar, pero los buscadores no los indexan ni guardan copia
  async headers() {
    return [
      {
        source: "/:file(.+\\.pdf)",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
    ];
  },
};

export default nextConfig;
