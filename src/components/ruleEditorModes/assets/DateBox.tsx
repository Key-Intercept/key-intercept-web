export default function Datebox({
  placeholder,
  defaultValue,
  onChange,
}: {
  placeholder: string;
  defaultValue: number;
  onChange: (
    hour: number | null,
    mins: number | null,
    secs: number | null,
  ) => void;
}) {
  const style: React.CSSProperties = {
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    width: "100%",
    backgroundColor: "#222222",
    color: "white",
  };
  return (
    <>
      <input
        type="number"
        placeholder={placeholder}
        defaultValue={Math.floor(
          Math.floor(Math.max(0, defaultValue) / 1000) / 3600,
        )}
        onInput={(e) => {
          onChange(parseInt((e.target as HTMLInputElement).value), null, null);
        }}
        style={style}
      />
      <input
        type="number"
        placeholder={placeholder}
        defaultValue={Math.floor(
          Math.floor(Math.floor(Math.max(0, defaultValue) / 1000) % 3600) / 60,
        )}
        onInput={(e) => {
          onChange(null, parseInt((e.target as HTMLInputElement).value), null);
        }}
        style={style}
      />
      <input
        type="number"
        placeholder={placeholder}
        defaultValue={Math.floor(Math.max(0, defaultValue) / 1000) % 60}
        onInput={(e) => {
          onChange(null, null, parseInt((e.target as HTMLInputElement).value));
        }}
        style={style}
      />
    </>
  );
}
