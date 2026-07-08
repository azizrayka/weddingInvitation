"use client";

import { useState } from "react";
import Image from "next/image";

type Photo = { publicId: string; width: number; height: number };

export default function Lightbox({
  photo,
  getCldUrl,
}: {
  photo: Photo;
  getCldUrl: (id: string, w: number) => string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative aspect-square overflow-hidden rounded-xl bg-neutral-900 hover:opacity-90 transition"
      >
        <Image
          src={getCldUrl(photo.publicId, 400)}
          alt="Gallery image"
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
        />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white text-3xl font-light hover:text-gray-300"
          >
            &times;
          </button>
          <Image
            src={getCldUrl(photo.publicId, 1200)}
            alt="Full size"
            width={photo.width}
            height={photo.height}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}