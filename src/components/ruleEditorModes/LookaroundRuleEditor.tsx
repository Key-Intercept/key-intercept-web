import { useEffect, useState } from "react";
import type { Rule } from "../../script/types";
import Checkbox from "./assets/Checkbox";
import Label from "./assets/Label";
import Textbox from "./assets/Textbox";
import DropDown from "./assets/Dropdown";

export default function LookaroundRuleEditor({ rule, setRegex, setReplacement }: { rule: Rule, setRegex: (regex: RegExp) => void, setReplacement: (replacement: string) => void }) {
    const [lookaroundType, setLookaroundType] = useState("It Is followed by");
    const [followingText, setFollowingText] = useState("");

    useEffect(() => {
        handleRegexChange(rule.rule_regex.source);
    }, [lookaroundType, followingText]);

    function handleRegexChange(value: string) {
        let newRegex: RegExp;
        switch (lookaroundType) {
            case "It Is followed by":
                newRegex = new RegExp(`${value}(?=${followingText})`);
                break;
            case "It Is NOT followed by":
                newRegex = new RegExp(`${value}(?!${followingText})`);
                break;
            case "It Is preceded by":
                newRegex = new RegExp(`(?<=${followingText})${value}`);
                break;
            case "It Is NOT preceded by":
                newRegex = new RegExp(`(?<!${followingText})${value}`);
                break;
            default:
                newRegex = new RegExp(value);
        }
        setRegex(newRegex);
    }

    function handleLookaroundTypeChange(value: string) {
        setLookaroundType(value);
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
            <Label>Find this text</Label>
            <Textbox placeholder="Text to find" defaultValue={rule.rule_regex.source} onChange={handleRegexChange} />
        </div>
        <div>
            <Label>But only if...</Label>
            <DropDown values={["It Is followed by", "It Is NOT followed by", "It Is preceded by", "It Is NOT preceded by"]} onSetValue={handleLookaroundTypeChange} />
        </div>
        <div>
            <Label>This text</Label>
            <Textbox placeholder="Condition text" defaultValue={followingText} onChange={(value) => setFollowingText(value)} />
        </div>
        <div>
            <Label>Replace with</Label>
            <Textbox placeholder="Replacement text" defaultValue={rule.rule_replacement} onChange={handleReplacementChange} />
        </div>
    </div>
}