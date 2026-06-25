import type { Rule } from "../../script/types";
import Label from "./assets/Label";
import Textbox from "./assets/Textbox";
import { safeCreateRegex } from "./assets/regex";

export default function SuffixRuleEditor({
    rule,
    setRegex,
    setReplacement,
    setLabel,
}: {
    rule: Rule;
    setRegex: (regex: RegExp) => void;
    setReplacement: (replacement: string) => void;
    setLabel: (label: string) => void;
}) {
    function handleReplacementChange(value: string) {
        setReplacement(value);
        setRegex(safeCreateRegex("&"));
        setLabel(`Add "${value}" to end of message`);
    }

    const containerStyle: React.CSSProperties = {
        width: "100%",
    };

    return (
        <div style={containerStyle}>
            <Label>Add to end of message</Label>
            <Textbox placeholder="End of message" defaultValue={rule.rule_replacement} onChange={handleReplacementChange} />
        </div>
    )
}
