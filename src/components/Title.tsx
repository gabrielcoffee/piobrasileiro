export default function Title({children, className}: {children: React.ReactNode, className?: string}) {
    return (
        <h1 style={styles.title}>
            {children}
        </h1>
    )
}

const styles = {
    title: {
        fontSize: '24px',
        fontWeight: 'normal',
        lineHeight: '32px',
        color: '#1e293b',
    }
}