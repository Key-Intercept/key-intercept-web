import { useState } from "react";
import type { Rule } from "../../script/types";
import Checkbox from "./assets/Checkbox";
import Label from "./assets/Label";
import { normalizeRegexSource, safeCreateRegex } from "./assets/regex";
import Textbox from "./assets/Textbox";

export default function CustomRuleEditor({ rule, setRegex, setReplacement, setLabel }: { rule: Rule, setRegex: (regex: RegExp) => void, setReplacement: (replacement: string) => void, setLabel: (label: string) => void }) {
    function handleRegexChange(value: string) {
        const newRegex = safeCreateRegex(value);
        setRegex(newRegex);
        setLabel(value + " -> " + rule.rule_replacement);
    }

    function handleReplacementChange(value: string) {
        setReplacement(value);
        setLabel(rule.rule_regex.source + " -> " + value);
    }

    const textboxContainerStyle: React.CSSProperties = {
        display: 'flex',
        gap: '10px',
        marginTop: '10px',
        width: '100%',
    };

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    };

    return <div style={containerStyle}>
        <Label>Custom Rules</Label>
        <div style={textboxContainerStyle}>
            <Textbox placeholder="Find..." defaultValue={normalizeRegexSource(rule.rule_regex.source)} onChange={handleRegexChange} />
            <Textbox placeholder="Replace with..." defaultValue={rule.rule_replacement} onChange={handleReplacementChange} />
        </div>
    </div>
}