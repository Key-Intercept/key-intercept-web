export default function DropDown({values, onSetValue}: {values: string[], onSetValue: (value: string) => void}) {
const style: React.CSSProperties = {
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    width: '100%',
    backgroundColor: '#222222',
    color: 'white',
}

const selectStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#222222',
    color: 'white',
    border: 'none',
    outline: 'none',
}


return <div style={style}>
    <select style={selectStyle} onChange={(e) => onSetValue(e.target.value)}>
        {values.map((v) => {
            return <option value={v}>{v}</option>
        })}
    </select>
</div>
}