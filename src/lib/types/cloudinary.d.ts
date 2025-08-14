// types/cloudinary.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_UPLOAD_PRESET: string;
    CLOUDINARY_API_KEY?: string; // Only needed for signed uploads
  }
}

interface CloudinaryUploadOptions {
  folder?: string;
  transformation?: string;
  tags?: string[];
  // Add other Cloudinary upload options as needed
}