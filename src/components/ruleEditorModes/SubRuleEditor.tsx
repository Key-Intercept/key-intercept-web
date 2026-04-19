import type { Rule } from "../../script/types";
import Label from "./assets/Label";
import Textbox from "./assets/Textbox";

export default function SubRuleEditor({
    rule,
    setRegex,
    setReplacement,
}: {
    rule: Rule;
    setRegex: (regex: RegExp) => void;
    setReplacement: (replacement: string) => void;
}) {
    function handleRegexChange(value: string) {
        if (value === "") {
            setRegex(new RegExp("^([\\s\\S]*)$"));
        } else {
            setRegex(new RegExp(`^([\\s\\S]*${value}[\\s\\S]*)$`));
        }
        setReplacement("-#$1");
    }

    const containerStyle: React.CSSProperties = {
        width: "100%",
    };

    let defaultValue = rule.rule_regex.source;
    if (defaultValue === "(?:)") defaultValue = "";
    if (defaultValue === "^([\\s\\S]*)$") defaultValue = "";
    defaultValue = defaultValue.replace(/^\^\(\[\\s\\S\]\*/, "").replace(/\[\\s\\S\]\*\)\$$/, "");

    return (
        <div style={containerStyle}>
            <Label>Text to Make Subtext (Leave blank for whole message)</Label>
            <Textbox
                placeholder="Text..."
                defaultValue={defaultValue}
                onChange={handleRegexChange}
            />
        </div>
    );
}
