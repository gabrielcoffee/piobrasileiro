import { PencilLine, User } from "lucide-react";
import styles from "./styles/ImageSelector.module.css";

interface ImageSelectorProps {
  imageUrl?: string;
  onImageChange?: (file: File) => void;
}

export default function ImageSelector({ 
  imageUrl, 
  onImageChange
}: ImageSelectorProps) {
  
  const handleImageClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && onImageChange) {
        onImageChange(file);
      }
    };
    input.click();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          {imageUrl ? (
            <img 
              src={imageUrl} 
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