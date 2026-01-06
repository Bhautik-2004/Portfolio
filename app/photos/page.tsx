import React from "react";
import type { Metadata } from "next";
import { ImageGrid } from "app/components/image-grid";

export const metadata: Metadata = {
  title: "Photos",
  description: "My Photos",
};

export default function Photos() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-medium">Photos</h1>

      <ImageGrid
        columns={2}
        images={[
          { src: "/photos/GDG-AHM-2025-1.jpeg", alt: "GDG Ahmedabad 2025" },
          { src: "/photos/GDG-AHM-2025-2.jpeg", alt: "GDG Ahmedabad 2025" },
          { src: "/photos/SSIP-2025.jpeg", alt: "SSIP 2025 Presentation" },
        ]}
      />
    </section>
  );
}
