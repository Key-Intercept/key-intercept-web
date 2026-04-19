export default function Textbox({ placeholder, defaultValue, onChange }: { placeholder: string, defaultValue: string, onChange: (value: string) => void }) {
    const style: React.CSSProperties = {
        padding: '10px',
        borderRadius: '10px',
        border: '1px solid #ccc',
        width: '100%',
        backgroundColor: '#222222',
        color: 'white',
    }

    return <input
        type="text"
        placeholder={placeholder}
        defaultValue={defaultValue}
        onInput={(e) => onChange((e.target as HTMLInputElement).value)}
        style={style} />
}