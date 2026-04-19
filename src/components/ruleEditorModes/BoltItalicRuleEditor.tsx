import type { Rule } from "../../script/types";
import Label from "./assets/Label";
import Textbox from "./assets/Textbox";

export default function BoltItalicRuleEditor({
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
            setRegex(new RegExp("(.*)"));
        } else {
            setRegex(new RegExp(`(${value})`, "g"));
        }
        setReplacement("***$1***");
    }

    const containerStyle: React.CSSProperties = {
        width: "100%",
    };

    let defaultValue = rule.rule_regex.source;
    if (defaultValue === "(?:)") defaultValue = "";
    if (defaultValue === "(.*)") defaultValue = "";
    defaultValue = defaultValue.replace(/^\(|\)$/g, "");

    return (
        <div style={containerStyle}>
            <Label>Text to Make Bold Italic (Leave blank for whole message)</Label>
            <Textbox
                placeholder="Text..."
                defaultValue={defaultValue}
                onChange={handleRegexChange}
            />
        </div>
    );
}
