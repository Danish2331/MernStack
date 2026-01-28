const BACKEND_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';

export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/placeholder-hall.jpg';
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  return `${BACKEND_URL}/${cleanPath}`;
};

export default getImageUrl;
