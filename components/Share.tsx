/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";

interface UploadResponse {
  secure_url: string;
  public_id: string;
}

interface FileItem {
  id: string;
  file: File;
  preview: string;
  status: "pending" | "uploading" | "success" | "error";
  result?: UploadResponse;
  error?: string;
}

export default function CloudinaryMultiUploader() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Process selected/dropped files
  const processFiles = (fileList: FileList) => {
    const newFiles: FileItem[] = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (!file.type.startsWith("image/")) continue; // Skip non-images

      const id = Math.random().toString(36).substring(2, 9);
      // Create a local blob URL for instant preview (avoids next/image errors)
      const preview = URL.createObjectURL(file); 
      
      newFiles.push({ id, file, preview, status: "pending" });
    }

    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = ""; // Reset input so same file can be re-selected
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  // 2. Remove a single file and free memory
  const removeFile = (id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove) URL.revokeObjectURL(fileToRemove.preview); // Prevent memory leaks
      return prev.filter((f) => f.id !== id);
    });
  };

  const clearAll = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
  };

  // 3. Handle Concurrent Uploads
  const handleUpload = async () => {
    const pendingFiles = files.filter((f) => f.status === "pending");
    if (pendingFiles.length === 0) return;

    setIsUploading(true);

    // Mark all pending files as uploading immediately
    setFiles((prev) =>
      prev.map((f) => (f.status === "pending" ? { ...f, status: "uploading" } : f))
    );

    // Create an array of upload promises to run concurrently
    const uploadPromises = pendingFiles.map(async (item) => {
      const formData = new FormData();
      formData.append("file", item.file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: formData }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || "Upload failed");

        // Mark this specific file as success
        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id ? { ...f, status: "success", result: data } : f
          )
        );
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : typeof err === "string" ? err : "Upload failed";

        // Mark this specific file as error
        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id ? { ...f, status: "error", error: errorMessage } : f
          )
        );
      }
    });

    // Wait for all uploads to finish (whether they succeeded or failed)
    await Promise.allSettled(uploadPromises);
    setIsUploading(false);
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;

  return (
    <div className="w-full h-[50vh] max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Upload Photos</h2>
        {files.length > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400 bg-gray-50"}`}
      >
        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="mt-2 text-sm text-gray-600">
          <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500">PNG, JPG, GIF (Multiple allowed)</p>

        {/* The 'multiple' attribute enables selecting more than one file */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Preview Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {files.map((item) => (
            <div
              key={item.id}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100"
            >
              {/* Using native <img> for local blob previews avoids next/image config errors */}
              <img
                src={item.preview}
                alt={item.file.name}
                className="w-full h-full object-cover"
              />
              
              {/* Status Overlays */}
              {item.status === "uploading" && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {item.status === "success" && (
                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              {item.status === "error" && (
                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center" title={item.error}>
                  <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}

              {/* Remove Button (Only visible on hover for pending files) */}
              {item.status === "pending" && (
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(item.id); }}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {pendingCount > 0 && (
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium 
                     hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          {isUploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Uploading...
            </>
          ) : (
            `Upload ${pendingCount} Photo${pendingCount > 1 ? "s" : ""}`
          )}
        </button>
      )}
    </div>
  );
}