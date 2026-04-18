import type { Rule } from "../../script/types";
import Label from "./assets/Label";
import Textbox from "./assets/Textbox";

export default function PrefixRuleEditor({
    rule,
    setRegex,
    setReplacement,
}: {
    rule: Rule;
    setRegex: (regex: RegExp) => void;
    setReplacement: (replacement: string) => void;
}) {
    function handleReplacementChange(value: string) {
        setReplacement(value);
        setRegex(new RegExp("^"));
    }

    const containerStyle: React.CSSProperties = {
        width: "100%",
    };

    return (
        <div style={containerStyle}>
            <Label>Add to start of message</Label>
            <Textbox placeholder="Start of message" defaultValue={rule.rule_replacement} onChange={handleReplacementChange} />
        </div>
    )
}
