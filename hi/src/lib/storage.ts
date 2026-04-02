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
    console.error("Firebase upload error:", error.code, error.message);
    
    // Provide more specific, helpful error messages based on Firebase error codes.
    // This helps diagnose issues like misconfigured security rules.
    let userFriendlyMessage = `Upload failed: ${error.message}. Check the browser console and your Firebase Storage rules.`;
    
    if (error.code === 'storage/unauthorized') {
      userFriendlyMessage = 'Permission Denied. Please check your Firebase Storage security rules to ensure you have write permission.';
    } else if (error.code === 'storage/unauthenticated') {
      userFriendlyMessage = 'Authentication Required. You must be signed in to upload files.';
    }
    
    throw new Error(userFriendlyMessage);
  }
};
