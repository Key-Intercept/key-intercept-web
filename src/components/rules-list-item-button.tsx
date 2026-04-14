import { useState } from "react";

export default function RulesListItemButton({ onPressed, onHovered, square, children }: { onPressed?: () => void, onHovered?: (hovered: boolean, property?: any) => void, square?: boolean, children: React.ReactNode }) {
    const [hovered, setHovered] = useState(false);
    const [pressed, setPressed] = useState(false);

    const handleMouseEnter = () => {
        setHovered(true);
        onHovered && onHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
        onHovered && onHovered(false);
    };

    const handleClick = () => {
        setPressed(true);
        onPressed && onPressed();
        setTimeout(() => setPressed(false), 200); // Reset pressed state after a short delay
    };

    const buttonStyle = {
        backgroundColor: pressed ? 'darkgrey' : hovered ? 'lightgrey' : 'grey',
        color: 'white',
        borderRadius: '5px',
        border: 'none',
        padding: '5px 5px',
        cursor: 'pointer',
        width: square ? '30px' : 'auto',
        height: square ? '30px' : 'auto',
    };

    return <button
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={buttonStyle}
    >
        {children}
    </button>

}