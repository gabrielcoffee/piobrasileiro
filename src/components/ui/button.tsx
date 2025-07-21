import * as React from "react"
import styles from "./styles/button.module.css"

type ButtonVariant = 'full' | 'outline' | 'text';
type ButtonAlign = 'left' | 'center' | 'right';

interface ButtonProps extends React.ComponentProps<"button"> {
    available?: boolean;
    variant?: ButtonVariant
    align?: ButtonAlign
    iconLeft?: React.ReactNode
    iconRight?: React.ReactNode
    children: React.ReactNode
}

function Button({
    available = true,
    variant = 'full',
    className,
    align = 'center',
    iconLeft,
    iconRight,
    children,
    ...props
    }: ButtonProps) {

    const getVariantStyle = (variant: ButtonVariant) => {
        if (variant === 'outline') return styles.button_outline;
        if (variant === 'text') return styles.button_text;
        else return styles.button
    }

    const getAlignStyle = (align: ButtonAlign) => {
        if (align === 'left') return styles.button_left;
        if (align === 'right') return styles.button_right;
        else return styles.button_center;
    }

    const getAvailableStyle = (available: boolean) => {
        if (!available) return styles.not_available;
    }

    return (
        <button
        className={`
            ${styles.button} 
            ${getVariantStyle(variant)} 
            ${getAlignStyle(align)} 
            ${getAvailableStyle(available)} 
            ${className || ''}
        `}
        {...props}
        >
            {iconLeft && <div className={styles.icon}>{iconLeft}</div>}
                {children}
            {iconRight && <div className={styles.icon}>{iconRight}</div>}
        </button>
    )
}

export { Button }
