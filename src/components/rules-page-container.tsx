import { useState, useMemo } from "react";
import type { Rule } from "../script/types";
import RulesList from "./rules-list";
import Card from "./card";
import SelectedRule from "./selectedRule";

export default function RulesPageContainer({ initialRules }: { initialRules: Rule[] }) {
    const [rules, setRules] = useState(initialRules.sort((a, b) => a.order - b.order));
    const [selectedRule, setSelectedRule] = useState<Rule | null>(null);

    async function deleteRuleDatabase(id: bigint) {
        const res = await fetch(`/api/rules?id=${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) {
            console.error("Error deleting rule:", await res.text());
            await alert("An error occurred while deleting the rule. Please try again.");
        }
    }

    async function updateRuleDatabase(rule: Rule) {
        const payload = {
            ...rule,
            rule_regex: rule.rule_regex.source,
            id: rule.id.toString(), // Convert BigInt to string for JSON serialization
            config_id: rule.config_id.toString()
        };

        const res = await fetch('/api/rules', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            console.error("Error updating rule:", await res.text());
            await alert("An error occurred while updating the rule. Please try again.");
        }
    }

    async function addNewRuleDatabase(rule: Rule) {
        // Prepare rule for JSON
        const payload = {
            ...rule,
            rule_regex: rule.rule_regex.source,
            id: rule.id.toString(),
            config_id: rule.config_id.toString()
        };

        const res = await fetch('/api/rules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            console.error("Error adding new rule:", await res.text());
            await alert("An error occurred while adding the rule. Please try again.");
        }
    }

    return (
        <>
            <SelectedRule i_selectedRule={selectedRule || null} setRule={setSelectedRule} />
            <RulesList
                rules={rules}
                setRules={setRules}
                selectedRule={selectedRule}
                setSelectedRule={setSelectedRule}
                updateRule={updateRuleDatabase}
                deleteRule={deleteRuleDatabase}
            />
        </>
    );
}