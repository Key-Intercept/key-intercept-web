import { useState } from "react";
import type { RuleType } from "../../../script/ruleTypes";

export default function RuleEditorModeButton({ mode, icon, currentMode, setMode }: { mode: RuleType, icon: React.ReactNode, currentMode: RuleType, setMode: (mode: RuleType) => void }) {
    const [isHovered, setIsHovered] = useState(false);

    const isActive = currentMode === mode;

    const style: React.CSSProperties = {
        padding: isHovered || isActive ? '6px' : '8px',
        borderRadius: '4px',
        backgroundColor: '#010101',
        color: isActive ? '#fff' : '#888',
        cursor: 'pointer',
        border: isHovered && !isActive ? '2px solid #888' : isActive ? '2px solid #8800ff' : '2px solid transparent',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontWeight: isActive ? 'bold' : 'normal',
        transition: 'all 0.2s ease',
        flexDirection: 'row',
        textAlign: 'center',
        justifyContent: 'center',
    }

    let textMode: string;
    textMode = mode.charAt(0).toUpperCase() + mode.slice(1).replace(/([A-Z])/g, ' $1').trim();


    return <button style={style} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={() => setMode(mode)}>
        {icon}
        {textMode}
    </button>
}