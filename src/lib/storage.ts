
'use client';
import { storage } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const UPLOAD_TIMEOUT = 30000; // 30 seconds

export const uploadFile = (file: File, path: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided for upload.'));
    }

    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    const timeoutId = setTimeout(() => {
        uploadTask.cancel();
        reject(new Error('Upload timed out after 30 seconds. Please try again.'));
    }, UPLOAD_TIMEOUT);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Can be used to display progress bar
      },
      (error) => {
        // Handle unsuccessful uploads
        clearTimeout(timeoutId);
        console.error("Detailed upload error:", error);
        
        switch (error.code) {
          case 'storage/unauthorized':
            reject(new Error('Permission denied. Please check your Storage security rules.'));
            break;
          case 'storage/unauthenticated':
            reject(new Error('Authentication required. Please sign in again.'));
            break;
          case 'storage/canceled':
            // The timeout handler will reject with a more specific message.
            // No need to reject again here unless it was a manual cancellation.
            break;
          case 'storage/quota-exceeded':
            reject(new Error('Storage quota exceeded. Please contact the site administrator.'));
            break;
          case 'storage/unknown':
            reject(new Error('An unknown storage error occurred. Please check the network connection.'));
            break;
          default:
            reject(new Error(`An unknown error occurred during upload: ${error.message}`));
        }
      },
      async () => {
        // Handle successful uploads on complete
        clearTimeout(timeoutId);
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (downloadError) {
          reject(new Error('File uploaded successfully, but failed to get download URL.'));
        }
      }
    );
  });
};
