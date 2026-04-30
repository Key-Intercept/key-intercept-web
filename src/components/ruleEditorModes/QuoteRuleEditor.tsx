import type { Rule } from "../../script/types";
import Label from "./assets/Label";
import { normalizeRegexSource } from "./assets/regex";
import Textbox from "./assets/Textbox";

export default function QuoteRuleEditor({
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
        if (value === "") {
            setRegex(new RegExp(".*"));
        } else {
            setRegex(new RegExp(`${value}`));
        }
        setReplacement("> $1");
        setLabel(`Quote: "${value}"`);
    }

    const containerStyle: React.CSSProperties = {
        width: "100%",
    };

    let defaultValue = normalizeRegexSource(rule.rule_regex.source);
    if (defaultValue === "(.*)") defaultValue = "";
    defaultValue = defaultValue.replace(/^\(|\)$/g, "");

    return (
        <div style={containerStyle}>
            <Label>Text to Quote (Leave blank for whole message)</Label>
            <Textbox
                placeholder="Text..."
                defaultValue={defaultValue}
                onChange={handleRegexChange}
            />
        </div>
    );
}
