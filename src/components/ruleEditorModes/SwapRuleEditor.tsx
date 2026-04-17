import { useState } from "react";
import type { Rule } from "../../script/types";
import Checkbox from "./assets/Checkbox";
import Label from "./assets/Label";
import Textbox from "./assets/Textbox";

export default function SwapRuleEditor({ rule, setRegex, setReplacement }: { rule: Rule, setRegex: (regex: RegExp) => void, setReplacement: (replacement: string) => void }) {
    const isNewRule = rule.id === -1n;

    const [wholeWord, setWholeWord] = useState(rule.rule_regex.source.startsWith('\\b') && rule.rule_regex.source.endsWith('\\b'));

    function handleRegexChange(value: string) {
        if (wholeWord) {
            value = `\\b${value}\\b`;
        }
        const newRegex = new RegExp(value);
        setRegex(newRegex);
    }

    function handleReplacementChange(value: string) {
        setReplacement(value);
    }

    const textboxContainerStyle: React.CSSProperties = {
        display: 'flex',
        gap: '10px',
        marginTop: '10px',
        width: '100%',
    };

    const checkboxStyle: React.CSSProperties = {
        width: '100%',
        marginTop: '10px',
    };

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    };

    return <div style={containerStyle}>
        <Label>Find and Replace</Label>
        <div style={textboxContainerStyle}>
            <Textbox placeholder="Find..." defaultValue={rule.rule_regex.source.replace(/^\\b|\\b$/g, '').replace('(?:)', '')} onChange={handleRegexChange} />
            <Textbox placeholder="Replace with..." defaultValue={rule.rule_replacement} onChange={handleReplacementChange} />
        </div>
        <div style={checkboxStyle}>
            <Checkbox checked={wholeWord} onChange={(checked) => setWholeWord(checked)} >
                Whole word only
            </Checkbox>
        </div>
    </div>
}