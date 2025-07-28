import * as React from "react"
import styles from "./styles/Button.module.css"
import Link from "next/link";

type ButtonVariant = 'full' | 'outline' | 'text';
type ButtonAlign = 'left' | 'center' | 'right';

interface ButtonProps extends React.ComponentProps<"button"> {
    available?: boolean;
    variant?: ButtonVariant
    align?: ButtonAlign
    iconLeft?: React.ReactNode
    iconRight?: React.ReactNode
    children: React.ReactNode
    href?: string
}

function Button({
    available = true,
    variant = 'full',
    className,
    align = 'center',
    iconLeft,
    iconRight,
    children,
    href,
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
        href ? (
            <Link
            href={href}
            className={`
                ${styles.button} 
                ${getVariantStyle(variant)} 
                ${getAlignStyle(align)} 
                ${getAvailableStyle(available)} 
                ${className || ''}
            `}
            {...(props as React.ComponentProps<"a">)}
            >
                {iconLeft && <div className={styles.icon}>{iconLeft}</div>}
                    {children}
                {iconRight && <div className={styles.icon}>{iconRight}</div>}
            </Link>
        ) : (
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
    )
}

export { Button }
