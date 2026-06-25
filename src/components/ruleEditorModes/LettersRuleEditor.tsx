import type { Rule } from "../../script/types";
import Label from "./assets/Label";
import { normalizeRegexSource, safeCreateRegex } from "./assets/regex";
import Textbox from "./assets/Textbox";

export default function LettersRuleEditor({
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
        const newRegex = safeCreateRegex(value);
        setRegex(newRegex);
        setLabel(value + " -> " + rule.rule_replacement);
    }

    function handleReplacementChange(value: string) {
        setReplacement(value);
        setLabel(rule.rule_regex.source + " -> " + value);
    }

    const containerStyle: React.CSSProperties = {
        width: "100%",
    };

    const inputContainerStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexDirection: "row",
    };

    return (
        <div style={containerStyle}>
            <Label>Letter Replacements</Label>
            <div style={inputContainerStyle}>
                <Textbox
                    placeholder="a"
                    defaultValue={normalizeRegexSource(rule.rule_regex.source).replace(/^\^|\$$/g, "")}
                    onChange={handleRegexChange}
                />
                →
                <Textbox
                    placeholder="@"
                    defaultValue={rule.rule_replacement}
                    onChange={handleReplacementChange}
                />
            </div>
        </div>
    );
}
