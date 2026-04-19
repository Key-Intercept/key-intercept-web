import type { Rule } from "../script/types";
import { useState } from "react";
import RulesListItemButton from "./rules-list-item-button";
import { canHaveDecorators } from "typescript";

export default function RulesListItem({ rule, selected, onDelete, onToggled, onIncrement, onDecrement, onSetChance, onSelected }: { rule: Rule, selected: boolean, onDelete: (id: bigint) => void, onToggled: (id: bigint) => void, onIncrement: (id: bigint) => void, onDecrement: (id: bigint) => void, onSetChance: (id: bigint, chance: number) => void, onSelected: (Rule: Rule) => void }) {
const [hovered, setHovered] = useState(false);
const [EditChancePressed, setEditChancePressed] = useState(false);


    const containerStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${selected || hovered ? '10px' : '12px'}`,
        marginBottom: '10px',
        border: `${selected || hovered ? '2px' : '0px'} solid ${hovered ? '#ccc' : '#7700ff'}`,
        borderRadius: '20px',
        flexDirection: 'row',
        gap: '10px',
        width: '40vw',
        backgroundColor:'#111111',
        cursor: 'pointer',
    }

    const textContainerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        flex: 1,
        marginLeft: '10px',
        marginRight: '10px',
    }

    const labelStyle: React.CSSProperties = {
        fontWeight: 'bold',
        fontSize: '16px',
        textDecoration: rule.enabled ? 'none' : 'line-through',
    }

    const regexStyle: React.CSSProperties = {
        fontStyle: 'italic',
        color: '#555',
        textDecoration: rule.enabled ? 'none' : 'line-through',
    }

    const setDeleteHover = (hovered: boolean, style: React.CSSProperties) => {
        style.backgroundColor = hovered ? 'red' : 'grey';
    }

    const setButtonHover = (hovered: boolean, style: React.CSSProperties) => {
        style.backgroundColor = hovered ? "lightgray" : 'grey'
        style.color = hovered ? 'black' : 'white'
    }

    const EditChanceInputStyle: React.CSSProperties = {
        width: '60px',
        padding: '5px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        backgroundColor: '#222222',
        color: 'white',
    }

    return <div style={containerStyle} onClick={() => onSelected(rule)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <RulesListItemButton onHovered={setButtonHover} square={true} onPressed={() => onToggled(rule.id)}>
            {rule.enabled ? rule.order : 'x'}
        </RulesListItemButton>
        <div style={textContainerStyle}>
            <div style={labelStyle}>
                {rule.label}
            </div>
            <div style={regexStyle}>
                {rule.rule_regex.source} → {rule.rule_replacement}
            </div>
        </div>
        {EditChancePressed && (
            <input
                type="number"
                min="0"
                max="100"
                value={rule.chance_to_apply * 100}
                onChange={(e) => onSetChance(rule.id, parseFloat(e.target.value) / 100)}
                style={EditChanceInputStyle}
            />
        )}
        <RulesListItemButton onHovered={setButtonHover} square={false} onPressed={() => setEditChancePressed(!EditChancePressed)}>
            {rule.chance_to_apply * 100}%
        </RulesListItemButton>
        <div>
            <RulesListItemButton onHovered={setButtonHover} square={true} onPressed={() => onIncrement(rule.id)}>↑</RulesListItemButton>
            <RulesListItemButton onHovered={setButtonHover} square={true} onPressed={() => onDecrement(rule.id)}>↓</RulesListItemButton>
            <RulesListItemButton onHovered={setDeleteHover} square={true} onPressed={() => onDelete(rule.id)}>
                x
            </RulesListItemButton>
        </div>
    </div>
}