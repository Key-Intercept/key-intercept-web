export default function Label({ children }: { children: React.ReactNode }) {
    const style: React.CSSProperties = {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#ffffffbb',
    }

    return <div style={style}>{children}</div>
}