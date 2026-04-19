import { useState } from "react";
import type { Rule } from "../../script/types";
import Checkbox from "./assets/Checkbox";
import Label from "./assets/Label";
import Textbox from "./assets/Textbox";
import DropDown from "./assets/Dropdown";

export default function CharsetRuleEditor({ rule, setRegex, setReplacement }: { rule: Rule, setRegex: (regex: RegExp) => void, setReplacement: (replacement: string) => void }) {
    const [matchType, setMatchType] = useState("Match ANY of these characters");

    function handleRegexChange(value: string) {
        const newRegex = new RegExp(value.split("").join("|"));
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

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    };

    return <div style={containerStyle}>
        <div>
            <Label>Match any of these characters</Label>
            <Textbox placeholder="Characters (e.g. aeiou, 0123456789)" defaultValue={rule.rule_regex.source.replaceAll("|", "")} onChange={handleRegexChange} />
        </div>
        <div>
            <Label>Match Type</Label>
            <DropDown values={["Match ANY of these characters", "Match anything EXCEPT these characters"]} onSetValue={setMatchType} />
        </div>
        <div>
            <Label>Replacement</Label>
            <Textbox placeholder="Replacement character(s)" defaultValue={rule.rule_replacement} onChange={handleReplacementChange} />
        </div>
    </div>
}