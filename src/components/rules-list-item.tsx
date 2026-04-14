import type { Rule } from "../script/types";
import { useState } from "react";
import RulesListItemButton from "./rules-list-item-button";

export default function RulesListItem({ rule, onDelete }: { rule: Rule, onDelete: () => void }) {

    const [enabled, setEnabled] = useState(rule.enabled);
    const [order, setOrder] = useState(rule.order);

    const toggleEnabled = () => {
        setEnabled(!enabled);
    };

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px',
        borderBottom: '1px solid #ccc',
        flexDirection: 'row',
    }

    const textContainerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        flex: 1,
        marginLeft: '10px',
    }

    const labelStyle: React.CSSProperties = {
        fontWeight: 'bold',
        fontSize: '16px',
    }

    const regexStyle: React.CSSProperties = {
        fontStyle: 'italic',
        color: '#555',
    }

    const setDeleteHover = (hovered: boolean, style: React.CSSProperties) => {
        style.backgroundColor = hovered ? 'red' : 'grey';
    }

    return <div style={containerStyle}>
        <RulesListItemButton square={true} onPressed={toggleEnabled}>
            {enabled ? rule.order : 'x'}
        </RulesListItemButton>
        <div style={textContainerStyle}>
            <div style={labelStyle}>
                {rule.label}
            </div>
            <div style={regexStyle}>
                {rule.rule_regex.source} → {rule.rule_replacement}
            </div>
        </div>
        <div>
            <RulesListItemButton square={true}>↑</RulesListItemButton>
            <RulesListItemButton square={true}>↓</RulesListItemButton>
            <RulesListItemButton onHovered={setDeleteHover} square={true} onPressed={onDelete}>
                x
            </RulesListItemButton>
        </div>
    </div>
}