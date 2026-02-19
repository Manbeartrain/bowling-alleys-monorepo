import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { nanoid } from "nanoid";

interface ImageUploaderProps {
  currentImageUrl?: string;
  onImageUrlChange: (url: string) => void;
  label?: string;
  className?: string;
  uploadType?: "venue" | "profile";
}

export function ImageUploader({
  currentImageUrl,
  onImageUrlChange,
  label = "Venue Image",
  className = "",
  uploadType = "venue",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select a valid image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10485760) {
      toast({
        title: "Error", 
        description: "Image file must be less than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Upload to Firebase Storage
      const storage = getStorage();
      
      // Determine storage path based on upload type
      const fileExtension = file.name.split('.').pop();
      const fileName = `${nanoid()}.${fileExtension}`;
      const storagePath = uploadType === "profile" 
        ? `users/${user.uid}/profile/${fileName}`
        : `venue-images/${fileName}`;
      
      const storageRef = ref(storage, storagePath);
      
      // Upload file
      await uploadBytes(storageRef, file, {
        contentType: file.type,
      });
      
      // Get download URL
      const imageUrl = await getDownloadURL(storageRef);
      
      setPreviewUrl(imageUrl);
      onImageUrlChange(imageUrl);

      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = () => {
    setPreviewUrl("");
    onImageUrlChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Label>{label}</Label>
      
      {previewUrl ? (
        <Card className="relative">
          <CardContent className="p-4">
            <div className="relative">
              <img
                src={previewUrl}
                alt="Venue preview"
                className="w-full h-48 object-cover rounded-md"
                onError={() => {
                  setPreviewUrl("");
                  onImageUrlChange("");
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={removeImage}
                className="absolute top-2 right-2"
                data-testid="button-remove-image"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center space-y-3">
              <ImageIcon className="w-12 h-12 text-muted-foreground" />
              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="gap-2"
                  data-testid="button-upload-image"
                >
                  <Upload className="w-4 h-4" />
                  {isUploading ? "Uploading..." : "Upload Image"}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        data-testid="input-file-upload"
      />
    </div>
  );
}