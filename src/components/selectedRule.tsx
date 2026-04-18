import { useState } from "react";
import type { Rule } from "../script/types";
import Card from "./card";
import RuleEditorModeButton from "./ruleEditorModes/assets/RuleEditorModeButton";
import { RuleType } from "../script/ruleTypes";
import SwapRuleEditor from "./ruleEditorModes/SwapRuleEditor";
import Separator from "./separator";
import LettersRuleEditor from "./ruleEditorModes/LettersRuleEditor";
import PrefixRuleEditor from "./ruleEditorModes/PrefixRuleEditor";
import SuffixRuleEditor from "./ruleEditorModes/SuffixRuleEditor";
import WordPrefixRuleEditor from "./ruleEditorModes/WordPrefixRuleEditor";
import WordSuffixRuleEditor from "./ruleEditorModes/WordSuffixRuleEditor";

export default function SelectedRule({
    i_selectedRule,
    setRule,
}: {
    i_selectedRule: Rule | null;
    setRule: (rule: Rule | null) => void;
}) {
    var selectedRule = i_selectedRule;
    if (!i_selectedRule) {
        selectedRule = {
            id: -1n,
            config_id: -1n,
            rule_regex: /(?:)/,
            rule_replacement: "",
            enabled: true,
            order: 0,
        } as Rule;
    }
    const isNewRule = !selectedRule || selectedRule.id === -1n;
    const [editorMode, setEditorMode] = useState(RuleType.Swap);

    const editorComponent = () => {
        const rule =
            selectedRule ||
            ({
                id: -1n,
                config_id: -1n,
                rule_regex: /(?:)/,
                rule_replacement: "",
                enabled: true,
                order: 0,
            } as Rule);
        switch (editorMode) {
            case RuleType.Swap:
                return (
                    <SwapRuleEditor
                        rule={rule}
                        setRegex={(regex) =>
                            setRule(
                                selectedRule ? { ...selectedRule, rule_regex: regex } : null,
                            )
                        }
                        setReplacement={(replacement) =>
                            setRule(
                                selectedRule
                                    ? { ...selectedRule, rule_replacement: replacement }
                                    : null,
                            )
                        }
                    />
                );
            case RuleType.Letters:
                return (
                    <LettersRuleEditor
                        rule={rule}
                        setRegex={(regex) =>
                            setRule(
                                selectedRule ? { ...selectedRule, rule_regex: regex } : null,
                            )
                        }
                        setReplacement={(replacement) =>
                            setRule(
                                selectedRule
                                    ? { ...selectedRule, rule_replacement: replacement }
                                    : null,
                            )
                        }
                    />
                );
            case RuleType.Prefix:
                return (
                    <PrefixRuleEditor rule={rule}
                        setRegex={(regex) => setRule(selectedRule ? { ...selectedRule, rule_regex: regex } : null)}
                        setReplacement={(replacement) => setRule(selectedRule ? { ...selectedRule, rule_replacement: replacement } : null)}
                    />
                );
            case RuleType.Suffix:
                return (
                    <SuffixRuleEditor rule={rule}
                        setRegex={(regex) => setRule(selectedRule ? { ...selectedRule, rule_regex: regex } : null)}
                        setReplacement={(replacement) => setRule(selectedRule ? { ...selectedRule, rule_replacement: replacement } : null)}
                    />
                );
                case RuleType.WordPrefix:
                    return (
                        <WordPrefixRuleEditor rule={rule}
                            setRegex={(regex) => setRule(selectedRule ? { ...selectedRule, rule_regex: regex } : null)}
                            setReplacement={(replacement) => setRule(selectedRule ? { ...selectedRule, rule_replacement: replacement } : null)}
                        />
                    );
                case RuleType.WordSuffix:
                    return (
                        <WordSuffixRuleEditor rule={rule}
                            setRegex={(regex) => setRule(selectedRule ? { ...selectedRule, rule_regex: regex } : null)}
                            setReplacement={(replacement) => setRule(selectedRule ? { ...selectedRule, rule_replacement: replacement } : null)}
                        />
                    );
            default:
                return null;
        }
    };

    const buttonContainerStyle: React.CSSProperties = {
        gap: "10px",
        marginBottom: "10px",
        width: "50vw",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
    };

    const submitButtonStyle: React.CSSProperties = {
        padding: "10px",
        borderRadius: "4px",
        backgroundColor: "#7700ff",
        color: "#fff",
        cursor: "pointer",
        border: "2px solid transparent",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        fontWeight: "bold",
        transition: "all 0.2s ease",
        flexDirection: "row",
        textAlign: "center",
        justifyContent: "center",
        width: "100%",
    };

    const editorContainerStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "100%",
    };

    return (
        <Card title={isNewRule ? "Add New Rule" : "Selected Rule"}>
            <div style={buttonContainerStyle}>
                <RuleEditorModeButton
                    mode={RuleType.Swap}
                    icon="🔁"
                    currentMode={editorMode}
                    setMode={setEditorMode}
                />
                <RuleEditorModeButton
                    mode={RuleType.Letters}
                    icon="🔤"
                    currentMode={editorMode}
                    setMode={setEditorMode}
                />
                <RuleEditorModeButton
                    mode={RuleType.Prefix}
                    icon="<<"
                    currentMode={editorMode}
                    setMode={setEditorMode}
                />
                <RuleEditorModeButton
                    mode={RuleType.Suffix}
                    icon=">>"
                    currentMode={editorMode}
                    setMode={setEditorMode}
                />
                <RuleEditorModeButton
                mode={RuleType.WordPrefix}
                icon="<"
                currentMode={editorMode}
                setMode={setEditorMode}
                />
                <RuleEditorModeButton
                mode={RuleType.WordSuffix}
                icon=">"
                currentMode={editorMode}
                setMode={setEditorMode}
                />
            </div>
            <Separator color="#333" />
            <div style={editorContainerStyle}>
                <div>{editorComponent()}</div>
                <Separator color="#333" />
                <button style={submitButtonStyle}>
                    {isNewRule ? "Add Rule" : "Edit Rule"}
                </button>
            </div>
        </Card>
    );
}
