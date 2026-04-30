import { useState } from "react";

export default function EditingArea({ value, setValue }: { value: string, setValue: (value: string) => void }) {
    const [editing, setEditing] = useState(false);

    const toggleEditing = (e?: React.MouseEvent) => { 
        if (e) {
            e.stopPropagation();
        }
        setEditing(!editing);
    }

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        minHeight: '1.5rem',
        cursor: 'pointer'
    };

    return (
        <div style={containerStyle} onClick={toggleEditing}>
            {
            editing ? 
                <input 
                    autoFocus
                    value={value} 
                    onChange={(e) => setValue(e.target.value)} 
                    onClick={(e) => e.stopPropagation()}
                    onBlur={() => setEditing(false)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            setEditing(false);
                        }
                    }}
                /> :
                <p style={{ margin: 0 }}>{value || <span style={{color: '#888', fontStyle: 'italic'}}>Click to edit</span>}</p>
            }
        </div>
    )
}