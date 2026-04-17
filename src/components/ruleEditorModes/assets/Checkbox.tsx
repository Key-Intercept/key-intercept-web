export default function Checkbox({ checked, onChange, children }: { checked: boolean, onChange: (checked: boolean) => void, children: React.ReactNode }) {
    const style: React.CSSProperties = {
        height: '20px',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'start',
        alignItems: 'center',
        marginBottom: '10px',
    }

    const labelStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    }

    const checkboxStyle: React.CSSProperties = {
        width: '16px',
        height: '16px',
        backgroundColor: checked ? '#7700ff' : 'transparent',
        borderRadius: '2px',
    }

    return <div style={style} onClick={() => onChange(!checked)}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={checkboxStyle} />
        <label style={labelStyle}>
            {children}
        </label>
    </div>
}