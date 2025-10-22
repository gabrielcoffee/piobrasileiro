'use client'
import { useCallback, useState } from "react";
import { Pencil } from "lucide-react";
import styles from "./styles/ProfileImage.module.css";

interface ProfileImageCreatingProps {
  onImageSelect: (imageFile: File) => void;
}

export default function ProfileImageCreating({ onImageSelect }: ProfileImageCreatingProps) {
    const [imageSrc, setImageSrc] = useState<string>("/user.png");

    const handleImageError = useCallback(() => {
        setImageSrc("/user.png");
    }, []);

    const handleProfilePictureChange = useCallback(() => {
        // Create a hidden file input element
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*'; // Accept all image types

        // Handle file selection
        input.onchange = (event) => {
            const target = event.target as HTMLInputElement;
            const file = target.files?.[0];

            if (file) {
                // Create a preview URL for immediate display
                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = e.target?.result as string;
                    setImageSrc(result);
                };
                reader.readAsDataURL(file);

                // Call the parent's onImageSelect function
                onImageSelect(file);
            }
        };

        // Trigger the file input click
        input.click();
    }, [onImageSelect]);

    return (
        <div className={styles.container}>
            <div className={styles.profileImageContainer} onClick={handleProfilePictureChange}>
                <img
                    src={imageSrc}
                    alt="Profile"
                    width={100}
                    height={100}
                    className={styles.profileImage}
                    onError={handleImageError}
                />
                <button onClick={(e) => { e.stopPropagation(); handleProfilePictureChange(); }} className={styles.editButton}>
                    <Pencil className={styles.pencilIcon} />
                </button>
            </div>
        </div>
    );
}
