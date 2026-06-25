import { useState } from "react";
import type { Rule } from "../script/types";
import RulesList from "./rules-list";
import SelectedRule from "./selectedRule";
import TurnOnTimer from "./turn-on-timer";

export default function RulesPageContainer({ initialRules, initialConfigId, initialRulesEnd }: { initialRules: Rule[]; initialConfigId: string; initialRulesEnd: string }) {
	const [rules, setRules] = useState([...initialRules].sort((a, b) => a.order - b.order));
	const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
	const currentConfigId = BigInt(initialConfigId);

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
			// convert RegExp source '(?:)' (from new RegExp('')) to empty string
			rule_regex: rule.rule_regex.source === '(?:)' ? '' : rule.rule_regex.source,
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
		setRules(prevRules => {
			const updatedRules = prevRules.map(r => r.id === rule.id ? rule : r);
			return updatedRules.sort((a, b) => a.order - b.order);
		});
	}

	async function addNewRuleDatabase(rule: Rule) {
		// Prepare rule for JSON
		const { id: _id, config_id: _configId, ...ruleData } = rule;
		const payload = {
			...ruleData,
			// convert RegExp source '(?:)' (from new RegExp('')) to empty string
			rule_regex: rule.rule_regex.source === '(?:)' ? '' : rule.rule_regex.source,
			config_id: currentConfigId.toString()
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

		setRules(prevRules => {
			const newRule = { ...rule, id: BigInt(-1) }; // Temporary ID until we get the real one from the server
			return [...prevRules, newRule].sort((a, b) => a.order - b.order);
		});
	}

	return (
		<>
		<TurnOnTimer title={"Rules End After"} configId={currentConfigId} endField={"rules_end"} initialEnd={initialRulesEnd} />
			<SelectedRule i_selectedRule={selectedRule || null} defaultConfigId={currentConfigId} setRule={(rule) => {
				setSelectedRule(rule)
				if (rule!.id === -1n) {
					addNewRuleDatabase(rule!);
				}
				else {
					updateRuleDatabase(rule!);
				}
			}} />
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
