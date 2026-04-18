import type { Rule } from "../../script/types";
import Label from "./assets/Label";
import Textbox from "./assets/Textbox";

export default function LettersRuleEditor({
    rule,
    setRegex,
    setReplacement,
}: {
    rule: Rule;
    setRegex: (regex: RegExp) => void;
    setReplacement: (replacement: string) => void;
}) {
    const isNewRule = rule.id === -1n;

    function handleRegexChange(value: string) {
        const newRegex = new RegExp(value);
        setRegex(newRegex);
    }

    function handleReplacementChange(value: string) {
        setReplacement(value);
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
                    defaultValue={rule.rule_regex.source.replace(/^\^|\$$/g, "")}
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
