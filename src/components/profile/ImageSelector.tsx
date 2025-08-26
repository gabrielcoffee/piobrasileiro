import { PencilLine, User } from "lucide-react";
import styles from "./styles/ImageSelector.module.css";

interface ImageSelectorProps {
    avatarImage?: string; // base64 bytea from database
    onImageChange?: (base64Data: string) => void;
}

export default function ImageSelector({ 
    avatarImage, 
    onImageChange
}: ImageSelectorProps) {
    
    // Function to resize image to 500x500 pixels
    const resizeImage = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                // Set canvas dimensions to 500x500
                canvas.width = 500;
                canvas.height = 500;
                
                if (ctx) {
                    // Calculate scaling to maintain aspect ratio
                    const scale = Math.max(500 / img.width, 500 / img.height);
                    const scaledWidth = img.width * scale;
                    const scaledHeight = img.height * scale;
                    
                    // Calculate position to center the image
                    const x = (500 - scaledWidth) / 2;
                    const y = (500 - scaledHeight) / 2;
                    
                    // Draw the resized image centered on canvas
                    ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
                    
                    // Convert to base64 with reduced quality for smaller size
                    const fullDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    // Extract only the base64 part (remove "data:image/jpeg;base64," prefix)
                    const base64Data = fullDataUrl.split(',')[1];
                    resolve(base64Data);
                }
            };
            
            img.src = URL.createObjectURL(file);
        });
    };
    
    const handleImageClick = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            
            if (file && onImageChange) {
                try {
                    // Resize image to 500x500 pixels
                    const resizedBase64 = await resizeImage(file);
                    
                    // Call the parent's onImageChange with the resized base64 data
                    onImageChange(resizedBase64);
                    
                } catch (error) {
                    console.error('Error processing image:', error);
                }
            }
        };
        
        input.click();
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.imageContainer}>
                    {avatarImage ? (
                        <img 
                            src={`data:image/jpeg;base64,${avatarImage}`}
                            alt="Profile" 
                            className={styles.profileImage}
                        />
                    ) : (
                        <div className={styles.placeholderImage}>
                            <User size={48} />
                        </div>
                    )}
                    
                    <button 
                        className={styles.editButton}
                        onClick={handleImageClick}
                        type="button"
                        aria-label="Change profile picture"
                    >
                        <PencilLine size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
} 