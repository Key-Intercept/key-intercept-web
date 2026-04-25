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
        padding: 'clamp(4px, 1vw, 5px)',
        cursor: 'pointer',
        width: square ? 'clamp(28px, 5vw, 30px)' : 'auto',
        height: square ? 'clamp(28px, 5vw, 30px)' : 'auto',
        marginLeft: '5px',
        marginRight: '5px',
        minWidth: square ? '28px' : 'auto',
        minHeight: square ? '28px' : 'auto',
        fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
        transition: 'all 0.2s ease',
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