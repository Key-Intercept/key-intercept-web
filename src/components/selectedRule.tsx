import { useState, useEffect } from "react";
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
import CustomRuleEditor from "./ruleEditorModes/CustomRuleEditor";
import CharsetRuleEditor from "./ruleEditorModes/CharsetRuleEditor";
import LookaroundRuleEditor from "./ruleEditorModes/LookaroundRuleEditor";
import BoldRuleEditor from "./ruleEditorModes/BoldRuleEditor";
import ItalicRuleEditor from "./ruleEditorModes/ItalicRuleEditor";
import BoltItalicRuleEditor from "./ruleEditorModes/BoltItalicRuleEditor";
import UnderlineRuleEditor from "./ruleEditorModes/UnderlineRuleEditor";
import StrikethroughRuleEditor from "./ruleEditorModes/StrikethroughRuleEditor";
import CodeRuleEditor from "./ruleEditorModes/CodeRuleEditor";
import SpoilerRuleEditor from "./ruleEditorModes/SpoilerRuleEditor";
import QuoteRuleEditor from "./ruleEditorModes/QuoteRuleEditor";
import SubRuleEditor from "./ruleEditorModes/SubRuleEditor";
import SuperRuleEditor from "./ruleEditorModes/SuperRuleEditor";

export default function SelectedRule({
    i_selectedRule,
    setRule,
}: {
    i_selectedRule: Rule | null;
    setRule: (rule: Rule | null) => void;
}) {
    const [localRule, setLocalRule] = useState<Rule | null>(i_selectedRule);
    const [editorMode, setEditorMode] = useState(RuleType.Custom);

    useEffect(() => {
        setLocalRule(i_selectedRule);
        setEditorMode(RuleType.Custom);
    }, [i_selectedRule]);

    let selectedRule = localRule;
    if (!selectedRule) {
        selectedRule = {
            id: -1n,
            config_id: -1n,
            rule_regex: /(?:)/,
            rule_replacement: "",
            enabled: true,
            order: 0,
        } as Rule;
    }
    const isNewRule = !i_selectedRule || i_selectedRule.id === -1n;

    const editorComponent = () => {
        const rule = selectedRule;
        switch (editorMode) {
            case RuleType.Swap:
                return (
                    <SwapRuleEditor rule={rule}
                        setRegex={(regex) => setLocalRule(selectedRule ? { ...selectedRule, rule_regex: regex } : null)}
                        setReplacement={(replacement) => setLocalRule(selectedRule ? { ...selectedRule, rule_replacement: replacement } : null)}
                    />
                );
            case RuleType.Letters:
                return (
                    <LettersRuleEditor rule={rule}
                        setRegex={(regex) => setLocalRule(selectedRule ? { ...selectedRule, rule_regex: regex } : null)}
                        setReplacement={(replacement) => setLocalRule(selectedRule ? { ...selectedRule, rule_replacement: replacement } : null,)}
                    />
                );
            case RuleType.Prefix:
                return (
                    <PrefixRuleEditor rule={rule}
                        setRegex={(regex) => setLocalRule(selectedRule ? { ...selectedRule, rule_regex: regex } : null)}
                        setReplacement={(replacement) => setLocalRule(selectedRule ? { ...selectedRule, rule_replacement: replacement } : null)}
                    />
                );
            case RuleType.Suffix:
                return (
                    <SuffixRuleEditor rule={rule}
                        setRegex={(regex) => setLocalRule(selectedRule ? { ...selectedRule, rule_regex: regex } : null)}
                        setReplacement={(replacement) => setLocalRule(selectedRule ? { ...selectedRule, rule_replacement: replacement } : null)}
                    />
                );
            case RuleType.WordPrefix:
                return (
                    <WordPrefixRuleEditor rule={rule}
                        setRegex={(regex) => setLocalRule(selectedRule ? { ...selectedRule, rule_regex: regex } : null)}
                        setReplacement={(replacement) => setLocalRule(selectedRule ? { ...selectedRule, rule_replacement: replacement } : null)}
                    />
                );
            case RuleType.WordSuffix:
                return (
                    <WordSuffixRuleEditor rule={rule}
                        setRegex={(regex) => setLocalRule(selectedRule ? { ...selectedRule, rule_regex: regex } : null)}
                        setReplacement={(replacement) => setLocalRule(selectedRule ? { ...selectedRule, rule_replacement: replacement } : null)}
                    />
                );
            case RuleType.Custom:
                return (
                    <CustomRuleEditor
                        key={rule.id.toString()}
                        rule={rule}
                        setRegex={(regex) => setLocalRule(selectedRule ? { ...selectedRule, rule_regex: regex } : null)}
                        setReplacement={(replacement) => setLocalRule(selectedRule ? { ...selectedRule, rule_replacement: replacement } : null)}
                    />
                );
            case RuleType.Charset:
                return (
                    <CharsetRuleEditor rule={rule}
                        setRegex={(regex) => setLocalRule(selectedRule ? { ...selectedRule, rule_regex: regex } : null)}
                        setReplacement={(replacement) => setLocalRule(selectedRule ? { ...selectedRule, rule_replacement: replacement } : null)}
                    />
                );
            case RuleType.Lookaround:
                return (
                    <LookaroundRuleEditor rule={rule}
                        setRegex={(regex) => setLocalRule(selectedRule ? { ...selectedRule, rule_regex: regex } : null)}
                        setReplacement={(replacement) => setLocalRule(selectedRule ? { ...selectedRule, rule_replacement: replacement } : null)}
                    />
                );
            case RuleType.Bold:
                return (
                    <BoldRuleEditor rule={rule}
                        setRegex={(regex) => setLocalRule(selectedRule ? { ...selectedRule, rule_regex: regex } : null)}
                        setReplacement={(replacement) => setLocalRule(selectedRule ? { ...selectedRule, rule_replacement: replacement } : null)}
                    />
                );
            case RuleType.Italic:
                return (
                    <ItalicRuleEditor rule={rule}
                        setRegex={(regex) => setLocalRule(selectedRule ? { ...selectedRule, rule_regex: regex } : null)}
                        setReplacement={(replacement) => setLocalRule(selectedRule ? { ...selectedRule, rule_replacement: replacement } : null)}
                    />
                );
            case RuleType.BoltItalic:
                return (
                    <BoltItalicRuleEditor rule={rule}
                        setRegex={(regex) => setLocalRule(selectedRule ? { ...selectedRule, rule_regex: regex } : null)}
                        setReplacement={(replacement) => setLocalRule(selectedRule ? { ...selectedRule, rule_replacement: replacement } : null)}
                    />
                );
            case RuleType.Underline:
                return (
                    <UnderlineRuleEditor rule={rule}
                        setRegex={(regex) => setLocalRule(selectedRule ? { ...selectedRule, rule_regex: regex } : null)}
                        setReplacement={(replacement) => setLocalRule(selectedRule ? { ...selectedRule, rule_replacement: replacement } : null)}
                    />
                );
            case RuleType.Strikethrough:
                return (
                    <StrikethroughRuleEditor rule={rule}
                        setRegex={(regex) => setLocalRule(selectedRule ? { ...selectedRule, rule_regex: regex } : null)}
                        setReplacement={(replacement) => setLocalRule(selectedRule ? { ...selectedRule, rule_replacement: replacement } : null)}
                    />
                );
            case RuleType.Code:
                return (
                    <CodeRuleEditor rule={rule}
                        setRegex={(regex) => setLocalRule(selectedRule ? { ...selectedRule, rule_regex: regex } : null)}
                        setReplacement={(replacement) => setLocalRule(selectedRule ? { ...selectedRule, rule_replacement: replacement } : null)}
                    />
                );
            case RuleType.Spoiler:
                return (
                    <SpoilerRuleEditor rule={rule}
                        setRegex={(regex) => setLocalRule(selectedRule ? { ...selectedRule, rule_regex: regex } : null)}
                        setReplacement={(replacement) => setLocalRule(selectedRule ? { ...selectedRule, rule_replacement: replacement } : null)}
                    />
                );
            case RuleType.Quote:
                return (
                    <QuoteRuleEditor rule={rule}
                        setRegex={(regex) => setLocalRule(selectedRule ? { ...selectedRule, rule_regex: regex } : null)}
                        setReplacement={(replacement) => setLocalRule(selectedRule ? { ...selectedRule, rule_replacement: replacement } : null)}
                    />
                );
            case RuleType.Sub:
                return (
                    <SubRuleEditor rule={rule}
                        setRegex={(regex) => setLocalRule(selectedRule ? { ...selectedRule, rule_regex: regex } : null)}
                        setReplacement={(replacement) => setLocalRule(selectedRule ? { ...selectedRule, rule_replacement: replacement } : null)}
                    />
                );
            case RuleType.Super:
                return (
                    <SuperRuleEditor rule={rule}
                        setRegex={(regex) => setLocalRule(selectedRule ? { ...selectedRule, rule_regex: regex } : null)}
                        setReplacement={(replacement) => setLocalRule(selectedRule ? { ...selectedRule, rule_replacement: replacement } : null)}
                    />
                );
            default:
                return (
                    <CustomRuleEditor
                        key={rule.id.toString()}
                        rule={rule}
                        setRegex={(regex) => setLocalRule(selectedRule ? { ...selectedRule, rule_regex: regex } : null)}
                        setReplacement={(replacement) => setLocalRule(selectedRule ? { ...selectedRule, rule_replacement: replacement } : null)}
                    />
                );
        }
    };

    const buttonContainerStyle: React.CSSProperties = {
        gap: "10px",
        marginBottom: "10px",
        width: "50vw",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
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
                    key={RuleType.Custom}
                    mode={RuleType.Custom}
                    icon="⚙"
                    currentMode={editorMode}
                    setMode={setEditorMode}
                />
                <RuleEditorModeButton
                    key={RuleType.Swap}
                    mode={RuleType.Swap}
                    icon="🔁"
                    currentMode={editorMode}
                    setMode={setEditorMode}
                />
                <RuleEditorModeButton
                    key={RuleType.Letters}
                    mode={RuleType.Letters}
                    icon="🔤"
                    currentMode={editorMode}
                    setMode={setEditorMode}
                />
                <RuleEditorModeButton
                    key={RuleType.Charset}
                    mode={RuleType.Charset}
                    icon="🔣"
                    currentMode={editorMode}
                    setMode={setEditorMode}
                />
                <RuleEditorModeButton
                    key={RuleType.Lookaround}
                    mode={RuleType.Lookaround}
                    icon="👀"
                    currentMode={editorMode}
                    setMode={setEditorMode}
                />
                <RuleEditorModeButton
                    key={RuleType.Prefix}
                    mode={RuleType.Prefix}
                    icon="<<"
                    currentMode={editorMode}
                    setMode={setEditorMode}
                />
                <RuleEditorModeButton
                    key={RuleType.Suffix}
                    mode={RuleType.Suffix}
                    icon=">>"
                    currentMode={editorMode}
                    setMode={setEditorMode}
                />
                <RuleEditorModeButton
                    key={RuleType.WordPrefix}
                    mode={RuleType.WordPrefix}
                    icon="<"
                    currentMode={editorMode}
                    setMode={setEditorMode}
                />
                <RuleEditorModeButton
                    key={RuleType.WordSuffix}
                    mode={RuleType.WordSuffix}
                    icon=">"
                    currentMode={editorMode}
                    setMode={setEditorMode}
                />
                <RuleEditorModeButton
                    key={RuleType.Bold}
                    mode={RuleType.Bold}
                    icon="𝐁"
                    currentMode={editorMode}
                    setMode={setEditorMode}
                />
                <RuleEditorModeButton
                    key={RuleType.Italic}
                    mode={RuleType.Italic}
                    icon="𝐼"
                    currentMode={editorMode}
                    setMode={setEditorMode}
                />
                <RuleEditorModeButton
                    key={RuleType.BoltItalic}
                    mode={RuleType.BoltItalic}
                    icon="𝑩"
                    currentMode={editorMode}
                    setMode={setEditorMode}
                />
                <RuleEditorModeButton
                    key={RuleType.Underline}
                    mode={RuleType.Underline}
                    icon="𝑈"
                    currentMode={editorMode}
                    setMode={setEditorMode}
                />
                <RuleEditorModeButton
                    key={RuleType.Strikethrough}
                    mode={RuleType.Strikethrough}
                    icon="S"
                    currentMode={editorMode}
                    setMode={setEditorMode}
                />
                <RuleEditorModeButton
                    key={RuleType.Code}
                    mode={RuleType.Code}
                    icon="</>"
                    currentMode={editorMode}
                    setMode={setEditorMode}
                />
                <RuleEditorModeButton
                    key={RuleType.Spoiler}
                    mode={RuleType.Spoiler}
                    icon="S"
                    currentMode={editorMode}
                    setMode={setEditorMode}
                />
                <RuleEditorModeButton
                    key={RuleType.Quote}
                    mode={RuleType.Quote}
                    icon="❝"
                    currentMode={editorMode}
                    setMode={setEditorMode}
                />
                <RuleEditorModeButton
                    key={RuleType.Sub}
                    mode={RuleType.Sub}
                    icon="-#"
                    currentMode={editorMode}
                    setMode={setEditorMode}
                />
                <RuleEditorModeButton
                    key={RuleType.Super}
                    mode={RuleType.Super}
                    icon="#"
                    currentMode={editorMode}
                    setMode={setEditorMode}
                />
            </div>
            <Separator color="#333" />
            <div style={editorContainerStyle}>
                <div>{editorComponent()}</div>
                <Separator color="#333" />
                <button style={submitButtonStyle} onClick={() => setRule(selectedRule)}>
                    {isNewRule ? "Add Rule" : "Edit Rule"}
                </button>
            </div>
        </Card>
    );
}
