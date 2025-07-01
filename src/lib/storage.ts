'use client';
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const UPLOAD_TIMEOUT = 30000; // 30 seconds

// A helper promise that rejects after a certain time
const timeout = (ms: number, message: string): Promise<never> => {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error(message)), ms);
    });
};

export const uploadFile = async (file: File, path: string): Promise<string> => {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  const storageRef = ref(storage, path);

  try {
    // The actual upload operation
    const uploadOperation = async () => {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    };
    
    // Race the upload against a timeout
    const downloadURL = await Promise.race([
        uploadOperation(),
        timeout(UPLOAD_TIMEOUT, `Upload timed out after ${UPLOAD_TIMEOUT / 1000} seconds. This could be due to a network issue or Firebase Storage security rules.`)
    ]);

    return downloadURL;

  } catch (error: any) {
    console.error("Detailed upload error:", error);
    
    // Provide more specific error messages based on Firebase error codes
    switch (error.code) {
      case 'storage/unauthorized':
        throw new Error('Permission denied. Please check your Firebase Storage security rules.');
      case 'storage/unauthenticated':
        throw new Error('Authentication required. Please sign in again.');
      case 'storage/object-not-found':
          throw new Error('File not found. This can happen if the upload was interrupted.');
      case 'storage/quota-exceeded':
        throw new Error('Storage quota exceeded. Please contact the site administrator.');
      case 'storage/unknown':
        throw new Error('An unknown storage error occurred. Please check your network connection.');
      default:
        // Re-throw the original error if it's not a known Firebase error (like our timeout)
        throw error;
    }
  }
};
