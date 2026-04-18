import type { Rule } from "../../script/types";
import Label from "./assets/Label";
import Textbox from "./assets/Textbox";

export default function WordSuffixRuleEditor({
    rule,
    setRegex,
    setReplacement,
}: {
    rule: Rule;
    setRegex: (regex: RegExp) => void;
    setReplacement: (replacement: string) => void;
}) {
    function handleReplacementChange(value: string) {
        setReplacement(value + "$1");
        setRegex(new RegExp("\b\w+\b"));
    }

    const containerStyle: React.CSSProperties = {
        width: "100%",
    };

    return (
        <div style={containerStyle}>
            <Label>Add to end of word</Label>
            <Textbox placeholder="End of word" defaultValue={rule.rule_replacement} onChange={handleReplacementChange} />
        </div>
    )
}
