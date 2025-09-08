'use client'
import { useCallback, useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import styles from "./styles/ProfileImage.module.css";

interface ProfileImageProps {
  avatarImage: string | null;
  uploadAvatar: (imageFile: File) => Promise<void>;
}

export default function ProfileImage({ avatarImage, uploadAvatar }: ProfileImageProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const handleImageError = useCallback(() => {
        setImageSrc("/user.png");
    }, []);

    const handleProfilePictureChange = useCallback(() => {
        // Create a hidden file input element
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*'; // Accept all image types

        // Handle file selection
        input.onchange = async (event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (file) {
            try {
            await uploadAvatar(file);
            } catch (error) {
            console.error('Error uploading profile picture:', error);
            }
        }
        };

        // Trigger the file input click
        input.click();
    }, [uploadAvatar]);

    useEffect(() => {
        // Set the initial image source
        if (avatarImage) {
            setImageSrc(`data:image/jpeg;base64,${avatarImage}`);
        } else {
            setImageSrc("/user.png");
        }
    }, [avatarImage]);

    return (
        <div className={styles.container}>
            <div className={styles.profileImageContainer}>
                <img
                src={imageSrc || "/user.png"}
                alt="Profile"
                width={100}
                height={100}
                className={styles.profileImage}
                onError={handleImageError}
            />
            <button onClick={handleProfilePictureChange} className={styles.editButton}>
                <Pencil className={styles.pencilIcon} />
            </button>
            </div>
        </div>
    );
}