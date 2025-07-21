import styles from "./Title.module.css"

export default function Title({children, className}: {children: React.ReactNode, className?: string}) {
    return (
        <h1 className={`${styles.title} ${className || ''}`}>
            {children}
        </h1>
    )
}