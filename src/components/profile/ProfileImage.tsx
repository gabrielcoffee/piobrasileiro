import { useCallback } from "react";
import { Pencil } from "lucide-react";
import styles from "./styles/ProfileImage.module.css";

interface ProfileImageProps {
  avatarImage: string | null;
  uploadAvatar: (imageFile: File) => Promise<void>;
}

export default function ProfileImage({ avatarImage, uploadAvatar }: ProfileImageProps) {

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

  return (
    <div className={styles.container}>
        <div className={styles.profileImageContainer}>
            <img
            src={avatarImage ? `data:image/jpeg;base64,${avatarImage}` : "/user.png"}
            alt="Profile"
            className={styles.profileImage}
        />
        <button onClick={handleProfilePictureChange} className={styles.editButton}>
            <Pencil className={styles.pencilIcon} />
        </button>
        </div>
    </div>
  );
}