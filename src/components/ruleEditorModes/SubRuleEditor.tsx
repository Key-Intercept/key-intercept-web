import type { Rule } from "../../script/types";
import Label from "./assets/Label";
import { normalizeRegexSource, safeCreateRegex } from "./assets/regex";
import Textbox from "./assets/Textbox";

export default function SubRuleEditor({
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
    function handleRegexChange(value: string) {
            setRegex(safeCreateRegex(`^([\\s\\S]*${value}[\\s\\S]*)$`));
        setReplacement(`-#${value}`);
        setLabel(`Subtext: "${value}"`);
    }

    const containerStyle: React.CSSProperties = {
        width: "100%",
    };

    let defaultValue = normalizeRegexSource(rule.rule_regex.source);
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
