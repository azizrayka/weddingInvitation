'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Define the shape of your image data
interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
}

export default function AlbumPage() {
  // Explicitly type the state as an array
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/images')
      .then((res) => res.json())
      .then((data) => {
        // 1. Check if the API returned an error object
        if (data.error) {
          setError(data.error);
        } 
        // 2. Check if the data is actually an array
        else if (Array.isArray(data)) {
          setImages(data);
        } 
        // 3. Fallback if the response format is unexpected
        else {
          setError('Unexpected response format from server.');
        }
        
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Failed to connect to the server.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">Loading images...</div>;
  
  if (error) return <div className="p-8 text-center text-red-500 font-bold">Error: {error}</div>;

  return (
    <div className="p-8 flex flex-col">
      <h1 className="text-3xl font-bold mb-6">My Cloudinary Images</h1>
      
      {images.length === 0 ? (
        <p className="text-gray-500">No images found. Make sure you have uploaded images to Cloudinary.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image) => (
            <div key={image.public_id} className="relative aspect-square">
              <Image
                src={image.secure_url}
                alt={image.public_id}
                fill
                className="object-cover rounded"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}