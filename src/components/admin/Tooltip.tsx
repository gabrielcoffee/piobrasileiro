'use client'

import { ReactNode, useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from './styles/Tooltip.module.css';

interface TooltipProps {
    text: string;
    color?: string;
    iconLeft?: ReactNode;
    children: ReactNode;
}

export default function Tooltip({ text, color = 'var(--color-text)', iconLeft, children }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isHiding, setIsHiding] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const wrapperRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const updatePosition = useCallback(() => {
        if (wrapperRef.current && tooltipRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + 8,
                left: rect.left + (rect.width / 2) - (tooltipRect.width / 2)
            });
        }
    }, []);

    useLayoutEffect(() => {
        if (isVisible && !isHiding && tooltipRef.current && wrapperRef.current) {
            // Use double RAF to ensure DOM has fully updated and tooltip is measured
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    updatePosition();
                });
            });
        }
    }, [isVisible, isHiding, text, updatePosition]);

    useEffect(() => {
        if (isVisible && !isHiding) {
            const handleResize = () => updatePosition();
            const handleScroll = () => updatePosition();
            window.addEventListener('resize', handleResize);
            window.addEventListener('scroll', handleScroll, true);
            return () => {
                window.removeEventListener('resize', handleResize);
                window.removeEventListener('scroll', handleScroll, true);
            };
        }
    }, [isVisible, isHiding, updatePosition]);

    const handleMouseEnter = () => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
        setIsHiding(false);
        setIsVisible(true);
    };

    const handleMouseLeave = () => {
        setIsHiding(true);
        hideTimeoutRef.current = setTimeout(() => {
            setIsVisible(false);
            setIsHiding(false);
        }, 150); // Match fade-out duration
    };

    const tooltipContent = (isVisible || isHiding) ? (
        <div 
            ref={tooltipRef}
            className={`${styles.tooltip} ${styles.tooltipFixed} ${isHiding ? styles.tooltipHiding : ''}`}
            style={{ 
                color,
                top: `${position.top}px`,
                left: `${position.left}px`
            }}
        >
            {iconLeft && <span className={styles.icon}>{iconLeft}</span>}
            <span>{text}</span>
        </div>
    ) : null;

    return (
        <>
            <div 
                ref={wrapperRef}
                className={styles.tooltipWrapper}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </div>
            {typeof window !== 'undefined' && tooltipContent && createPortal(tooltipContent, document.body)}
        </>
    );
}

