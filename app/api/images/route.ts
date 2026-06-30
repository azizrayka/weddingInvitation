import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const result = await cloudinary.search
      .expression('resource_type:image')
      .max_results(50)
      .execute();

    // Ensure we always return an array
    return NextResponse.json(result.resources || []);
  } catch (error) {
    // Log the error to your terminal so you can see what's wrong!
    console.error('Cloudinary API Error:', error); 
    
    return NextResponse.json(
      { error: 'Failed to fetch images. Check your terminal for details.' },
      { status: 500 }
    );
  }
}