"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import Image from "next/image";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

type UploadItem = {
  id: string;
  file: File;
  preview: string;
  status: "uploading" | "success" | "error";
  progress: number;
  url?: string;
  publicId?: string;
  error?: string;
};

export default function UploadPage() {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = (file: File) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    // Create preview
    const preview = URL.createObjectURL(file);
    const newItem: UploadItem = {
      id,
      file,
      preview,
      status: "uploading",
      progress: 0,
    };

    setItems((prev) => [newItem, ...prev]);

    // Upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", UPLOAD_URL);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = (e.loaded / e.total) * 100;
        setItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, progress } : i))
        );
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        setItems((prev) =>
          prev.map((i) =>
            i.id === id
              ? { ...i, status: "success", progress: 100, url: data.secure_url, publicId: data.public_id }
              : i
          )
        );
      } else {
        setItems((prev) =>
          prev.map((i) =>
            i.id === id ? { ...i, status: "error", error: "Upload failed" } : i
          )
        );
      }
    };

    xhr.onerror = () => {
      setItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, status: "error", error: "Network error" } : i
        )
      );
    };

    xhr.send(formData);
  };

  const handleFiles = (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );
    imageFiles.forEach(uploadFile);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) handleFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((i) => i.id !== id);
    });
  };

  const clearCompleted = () => {
    setItems((prev) => {
      prev.filter((i) => i.status === "success").forEach((i) => URL.revokeObjectURL(i.preview));
      return prev.filter((i) => i.status !== "success");
    });
  };

  const completed = items.filter((i) => i.status === "success").length;
  const uploading = items.filter((i) => i.status === "uploading").length;

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">Upload Photos</h1>
        <p className="text-neutral-400 mt-2">
          Drop multiple images — they upload in parallel
        </p>
      </header>

      <div className="max-w-3xl mx-auto">
        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed cursor-pointer p-10 flex flex-col items-center justify-center transition ${
            dragging
              ? "border-white bg-white/5"
              : "border-neutral-700 bg-neutral-900 hover:bg-neutral-900/70"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onFileSelect}
            className="hidden"
          />

          <svg
            className="w-12 h-12 text-neutral-500 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.9 5 5 0 019.9-1.18A4.5 4.5 0 0117 16H7z M12 12v6 M9 15l3-3 3 3"
            />
          </svg>
          <p className="text-neutral-300 font-medium">
            Drop images here or click to browse
          </p>
          <p className="text-neutral-500 text-sm mt-1">
            Multiple files supported • JPG, PNG, WebP
          </p>
        </div>

        {/* Stats bar */}
        {items.length > 0 && (
          <div className="flex items-center justify-between mt-6 mb-3 px-1">
            <p className="text-sm text-neutral-400">
              {uploading > 0 && `${uploading} uploading • `}
              {completed} of {items.length} completed
            </p>
            {completed > 0 && (
              <button
                onClick={clearCompleted}
                className="text-sm text-neutral-400 hover:text-white underline"
              >
                Clear completed
              </button>
            )}
          </div>
        )}

        {/* Upload list */}
        <div className="space-y-3 mt-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-3 bg-neutral-900 rounded-xl border border-neutral-800"
            >
              {/* Thumbnail */}
              <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-800">
                <Image
                  src={item.preview}
                  alt={item.file.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info + progress */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {item.file.name}
                </p>
                <p className="text-xs text-neutral-500">
                  {(item.file.size / 1024 / 1024).toFixed(2)} MB
                </p>

                {item.status === "uploading" && (
                  <div className="mt-2 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}

                {item.status === "success" && (
                  <p className="mt-1 text-xs text-green-400">✓ Uploaded</p>
                )}

                {item.status === "error" && (
                  <p className="mt-1 text-xs text-red-400">✕ {item.error}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1">
                {item.status === "success" && item.url && (
                  <button
                    onClick={() => navigator.clipboard.writeText(item.url!)}
                    className="px-2 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 rounded"
                  >
                    Copy URL
                  </button>
                )}
                <button
                  onClick={() => removeItem(item.id)}
                  className="px-2 py-1 text-xs text-neutral-400 hover:text-white"
                  aria-label="Remove"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}