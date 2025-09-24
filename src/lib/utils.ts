export async function queryApi(method: string, route: string, body?: any) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, error: 'No token found', data: null };
        }
    
        const fetchOptions: RequestInit = {
            method: method.toUpperCase(),
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        // Add body for POST/PUT requests
        if (body && (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT' || method.toUpperCase() === 'DELETE')) {
            fetchOptions.headers = {
                ...fetchOptions.headers,
                'Content-Type': 'application/json'
            };
            fetchOptions.body = JSON.stringify(body);
        }
    
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${route}`, fetchOptions);
        const json = await response.json();

        if (response.ok) {
            const data = json.data || null;
            return {
                success: true,
                data, 
                error: null,
                message: json.message || null
            };
        } else {

            return { 
                success: false, 
                error: json.error || null, 
                status: response.status,
                data: null,
                message: json.error || null
            };
        }
    } catch (error) {
        console.error('API request failed:', error);
        return { 
            success: false, 
            error: 'Network error', 
            data: null 
        };
    } 
}

export function getCurrentWeekInfo() {

    // Getting Week number
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);

    // Calculate Monday of current week
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Days to go back to Monday
    
    const monday = new Date(now);
    monday.setDate(now.getDate() - daysToMonday);
    
    // Generate array of 7 consecutive days starting from Monday
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        weekDates.push(date);
    }
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    return {
        weekNumber,
        weekDates,
        monday,
        sunday
    }
}

// Same as get current week info but starts on sunday and ends on next sunday
export function getCurrentWeekInfoRegular() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysToSunday = dayOfWeek === 0 ? 0 : dayOfWeek; // Days to go back to Sunday
    
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - daysToSunday);

    const weekDates = [];
    for (let i = 0; i < 8; i++) {
        const date = new Date(sunday);
        date.setDate(sunday.getDate() + i);
        weekDates.push(date);
    }

    const nextSunday = new Date(sunday);
    nextSunday.setDate(sunday.getDate() + 7);

    return {
        weekNumber,
        weekDates,
    }
}

export function normalizeDateString(date: any): string {
    if (date instanceof Date) {
        return date.toISOString().split('T')[0];
    }
    if (typeof date === 'string' && date.includes('T')) {
        return new Date(date).toISOString().split('T')[0];
    }
    return date;
};

export function getDateString(date: any, format: string = 'DD/MM/YYYY'): string {

    if (format === 'DD/MM/YYYY HH:mm') {
        const selectedDate = new Date(date);
        return selectedDate.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } else {

        if (date.includes('T')) {
            const selectedDate = new Date(date);
            return selectedDate.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric' 
            });
        }

        // Parse YYYY-MM-DD as local date to avoid timezone issues
        const [year, month, day] = date.split('-').map(Number);
        const selectedDate = new Date(year, month - 1, day);

        return selectedDate.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric' 
        });
    }
};


export function convertBufferToBase64(buffer: Buffer) {
    const base64String = Buffer.from(buffer).toString('base64');
    return `data:image/jpeg;base64,${base64String}`;
}


async function checkFileSize(imageFile: File): Promise<boolean> {
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB in bytes
    if (imageFile.size > maxSizeInBytes) {
        console.error('File size exceeds 10MB limit');
        return false;
    }
    return true;
}

export async function uploadAvatar(imageFile: File) {
    // Check file size first
    const isValidSize = await checkFileSize(imageFile);
    if (!isValidSize) {
        return;
    }

    // Create canvas for image processing
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Failed to get canvas context');
        return;
    }

    // Set canvas size to 500x500
    canvas.width = 500;
    canvas.height = 500;

    // Create image object
    const img = new Image();

    try {
        // Load image
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = URL.createObjectURL(imageFile);
        });

        // Draw and resize image to canvas
        ctx.drawImage(img, 0, 0, 500, 500);

        // Convert to JPEG blob
        const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.8);
        });

        // Create FormData for binary upload
        const formData = new FormData();
        formData.append('avatar_image', blob, 'avatar.jpg');

        // Get base64 for ProfileImage compatibility
        const base64String = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result!.toString().replace("data:image/jpeg;base64,", ""));
            reader.readAsDataURL(blob);
        });

        // Clean up
        URL.revokeObjectURL(img.src);

        // Send to API
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/perfil/avatar`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Avatar updated successfully');
            return base64String;
        } else {
            const errorData = await response.json();
            console.error('Failed to update avatar:', errorData.message || 'Request failed');
        }
    } catch (error) {
        console.error('Error processing image:', error);
    }
}

export async function uploadAvatarAdmin(imageFile: File, userId: string) {
    // Check file size first
    const isValidSize = await checkFileSize(imageFile);
    if (!isValidSize) {
        return;
    }

    // Create canvas for image processing
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Failed to get canvas context');
        return;
    }

    // Set canvas size to 500x500
    canvas.width = 500;
    canvas.height = 500;

    // Create image object
    const img = new Image();

    try {
        // Load image
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = URL.createObjectURL(imageFile);
        });

        // Draw and resize image to canvas
        ctx.drawImage(img, 0, 0, 500, 500);

        // Convert to JPEG blob
        const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.8);
        });

        // Create FormData for binary upload
        const formData = new FormData();
        formData.append('avatar_image', blob, 'avatar.jpg');

        // Get base64 for ProfileImage compatibility
        const base64String = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result!.toString().replace("data:image/jpeg;base64,", ""));
            reader.readAsDataURL(blob);
        });

        // Clean up
        URL.revokeObjectURL(img.src);

        // Send to API
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/avatar`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Avatar updated successfully');
            return base64String;
        } else {
            const errorData = await response.json();
            console.error('Failed to update avatar:', errorData.message || 'Request failed');
        }
    } catch (error) {
        console.error('Error processing image:', error);
    }
}
