import type { Rule } from "../script/types";
import { useState } from "react";
import RulesListItemButton from "./rules-list-item-button";
import { canHaveDecorators } from "typescript";

export default function RulesListItem({ rule, onDelete, onToggled, onIncrement, onDecrement }: { rule: Rule, onDelete: (id: bigint) => void, onToggled: (id: bigint) => void, onIncrement: (id: bigint) => void, onDecrement: (id: bigint) => void }) {

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

    const setButtonHover = (hovered: boolean, style: React.CSSProperties) => {
        style.backgroundColor = hovered ? "lightgray" : 'grey'
        style.color = hovered ? 'black' : 'white'
    }

    return <div style={containerStyle}>
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
        <div>
            <RulesListItemButton onHovered={setButtonHover} square={true} onPressed={() => onIncrement(rule.id)}>↑</RulesListItemButton>
            <RulesListItemButton onHovered={setButtonHover} square={true} onPressed={() => onDecrement(rule.id)}>↓</RulesListItemButton>
            <RulesListItemButton onHovered={setDeleteHover} square={true} onPressed={() => onDelete(rule.id)}>
                x
            </RulesListItemButton>
        </div>
    </div>
}