export default function Separator({color}: {color: string}) {
    return <svg
        width="100%"
        height="10"
        xmlns="http://www.w3.org/2000/svg"
    >
        <line
            x1="0"
            y1="5"
            x2="100%"
            y2="5"
            stroke={color}
            stroke-width="2"
        />
    </svg>
}