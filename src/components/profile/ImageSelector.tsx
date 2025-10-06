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
    
    // Process image: center-crop to square. If larger than 500x500, downscale to 500x500.
    // If smaller, crop to square without upscaling.
    const resizeImage = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                if (!ctx) return;

                const sourceWidth = img.width;
                const sourceHeight = img.height;

                // Determine square crop on source (center crop)
                const side = Math.min(sourceWidth, sourceHeight);
                const sx = (sourceWidth - side) / 2;
                const sy = (sourceHeight - side) / 2;

                // Determine output size: 500 if image is larger than 500 on both sides, otherwise keep side (no upscaling)
                const outputSize = side > 500 ? 500 : side;

                canvas.width = outputSize;
                canvas.height = outputSize;

                // Draw cropped square; scale down to 500 if needed
                ctx.drawImage(img, sx, sy, side, side, 0, 0, outputSize, outputSize);

                const fullDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                const base64Data = fullDataUrl.split(',')[1];
                resolve(base64Data);
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