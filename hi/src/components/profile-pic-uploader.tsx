
"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, AlertCircle } from "lucide-react";

// Placeholder function to simulate a server upload
const uploadImageToServer = async (file: File) => {
  console.log("Simulating upload for:", file.name);
  // Simulate network delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a random failure
      if (Math.random() > 0.9) {
        reject(new Error("Simulated server upload failed!"));
      } else {
        resolve({ success: true, url: URL.createObjectURL(file) });
      }
    }, 1500);
  });
};

export default function ProfilePicUploader() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setError(null);
    setIsUploading(true);

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      await uploadImageToServer(file);
      // In a real app, you might set the final image URL from the server response here
    } catch (err: any) {
      setError(err.message);
      setImagePreview(null); // Clear preview on failure
    } finally {
      setIsUploading(false);
    }
  };

  const handleAreaClick = () => {
    // Trigger the hidden file input if not uploading
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-background">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />
      <div
        className="relative w-48 h-48 flex items-center justify-center"
        onClick={handleAreaClick}
      >
        <AnimatePresence>
          {imagePreview ? (
            <motion.div
              key="image"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <motion.div
                className="w-full h-full rounded-full"
                // Neon-pulsing glow animation only when uploading
                animate={isUploading ? {
                  boxShadow: [
                    "0 0 15px 2px hsl(var(--accent) / 0.5)",
                    "0 0 25px 8px hsl(var(--accent) / 0.7)",
                    "0 0 15px 2px hsl(var(--accent) / 0.5)",
                  ],
                } : {
                  boxShadow: "0 0 0px 0px hsl(var(--accent) / 0)"
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover rounded-full"
                />
              </motion.div>
              {isUploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
                  <p className="text-white font-bold animate-pulse text-lg">
                    Uploading...
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="w-full h-full border-2 border-dashed border-muted-foreground rounded-full flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:border-primary hover:text-primary transition-colors"
            >
              <UploadCloud className="w-12 h-12 mb-2" />
              <span className="text-sm font-semibold">Upload Photo</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-4 flex items-center gap-2 text-destructive"
        >
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{error}</span>
        </motion.div>
      )}
    </div>
  );
}
