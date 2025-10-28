import { useEffect } from 'react';

export const useViewportHeight = () => {
    useEffect(() => {
        const setViewportHeight = () => {
            // Get the viewport height
            const vh = window.innerHeight * 0.01;
            
            // Set CSS custom property for viewport height
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            
            // For iOS Safari, also set a more reliable height
            const actualHeight = window.innerHeight;
            document.documentElement.style.setProperty('--actual-vh', `${actualHeight}px`);
        };

        // Set initial height
        setViewportHeight();

        // Listen for resize events
        window.addEventListener('resize', setViewportHeight);
        window.addEventListener('orientationchange', setViewportHeight);

        // Cleanup
        return () => {
            window.removeEventListener('resize', setViewportHeight);
            window.removeEventListener('orientationchange', setViewportHeight);
        };
    }, []);
};
