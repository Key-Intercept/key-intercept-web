import type { Rule } from "../../script/types";
import Label from "./assets/Label";
import { normalizeRegexSource } from "./assets/regex";
import Textbox from "./assets/Textbox";

export default function ItalicRuleEditor({
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
            setRegex(new RegExp(`${value}`, "g"));
        }
        setReplacement("*$1*");
        setLabel("Italic: " + value);
    }

    const containerStyle: React.CSSProperties = {
        width: "100%",
    };

    let defaultValue = normalizeRegexSource(rule.rule_regex.source);
    if (defaultValue === "(.*)") defaultValue = "";
    defaultValue = defaultValue.replace(/^\(|\)$/g, "");

    return (
        <div style={containerStyle}>
            <Label>Text to Make Italic (Leave blank for whole message)</Label>
            <Textbox
                placeholder="Text..."
                defaultValue={defaultValue}
                onChange={handleRegexChange}
            />
        </div>
    );
}
