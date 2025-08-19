
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
        if (body && (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT')) {
            fetchOptions.headers = {
                ...fetchOptions.headers,
                'Content-Type': 'application/json'
            };
            fetchOptions.body = JSON.stringify(body);
        }
    
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${route}`, fetchOptions);
    
        if (response.ok) {
            const json = await response.json();
            const data = json.data || null;
            return {
                success: true,
                data, 
                error: null 
            };
        } else {
            // Handle different error statuses
            let errorMessage = 'Request failed';
            if (response.status === 401) {
                errorMessage = 'Unauthorized - please login again';
            } else if (response.status === 403) {
                errorMessage = 'Access forbidden';
            } else if (response.status === 500) {
                errorMessage = 'Server error';
            }
            
            return { 
                success: false, 
                error: errorMessage, 
                status: response.status,
                data: null 
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

export function normalizeDateString(date: any): string {
    if (date instanceof Date) {
        return date.toISOString().split('T')[0];
    }
    if (typeof date === 'string' && date.includes('T')) {
        return new Date(date).toISOString().split('T')[0];
    }
    return date;
};