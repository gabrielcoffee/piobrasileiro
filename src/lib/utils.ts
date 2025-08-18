
export async function getApiData(route: string) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return { success: false, error: 'No token found', data: null };
        }
    
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${route}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    
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