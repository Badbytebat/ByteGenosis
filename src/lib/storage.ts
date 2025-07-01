'use client';
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadFile = async (file: File, path: string): Promise<string> => {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  const storageRef = ref(storage, path);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;

  } catch (error: any) {
    console.error("Detailed upload error from Firebase:", error);
    
    // Provide more specific error messages based on Firebase error codes
    switch (error.code) {
      case 'storage/unauthorized':
        throw new Error('Permission Denied: Your Firebase Storage security rules are preventing this upload. Please ensure you are logged in and the rules allow writes to this path.');
      case 'storage/unauthenticated':
        throw new Error('Authentication Required: You must be signed in to upload files. Please sign in again.');
      case 'storage/retry-limit-exceeded':
        throw new Error('Network Error: The upload failed after multiple retries. Please check your internet connection.');
      case 'storage/canceled':
         throw new Error('Upload Canceled: The upload was canceled by the user or the browser.');
      case 'storage/unknown':
        throw new Error('An unknown storage error occurred. Please check the developer console and your Firebase setup.');
      default:
        // Re-throw a generic error but include the original code
        throw new Error(`Upload failed with an unexpected error. Code: ${error.code || 'N/A'}`);
    }
  }
};
