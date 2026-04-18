import Card from './card';
import type { Rule } from '../script/types';
import RulesListItem from './rules-list-item';

export default function RulesList({ rules, setRules, selectedRule, setSelectedRule, updateRule, deleteRule }: { rules: Rule[], setRules: (rules: Rule[]) => void, selectedRule: Rule | null, setSelectedRule: (rule: Rule | null) => void, updateRule: (rule: Rule) => void, deleteRule: (id: bigint) => void }) {
    async function DeleteRule(id: bigint) {
        let output: Rule[] = [];

        rules.forEach((a) => {
            if (a.id != id) {
                output.push(a)
            }
        });
        await deleteRule(id);
        setRules(output);
        
    }

    async function IncrementPriority(id: bigint) {
        // CREATE A COPY OF THE STATE SO REACT KNOWS TO TRIGGER A RE-RENDER
        let output = [...rules]; 

        for (let i = 0; i < output.length; i++) {
            if (output[i].id == id) {
                output[i].order = output[i - 1] ? output[i - 1].order - 1 : output[i].order - 1;
            }
        }
        output.sort((a, b) => { return a.order - b.order });

        // Await the API call first, then update local state
        await updateRule(output.find((a) => a.id == id)!);
        setRules(output);
    }

    async function DecrementPriority(id: bigint) {
        let output = [...rules]; // CREATE A COPY

        for (let i = 0; i < output.length; i++) {
            if (output[i].id == id) {
                output[i].order = output[i + 1] ? output[i + 1].order + 1 : output[i].order + 1;
            }
        }
        output.sort((a, b) => { return a.order - b.order });
        await updateRule(output.find((a) => a.id == id)!);
        setRules(output);
    }

    async function toggleEnabled(id: bigint) {
        let output = [...rules]; // CREATE A COPY

        for (let i = 0; i < output.length; i++) {
            if (output[i].id == id) {
                output[i].enabled = !output[i].enabled;
            }
        }
        await updateRule(output.find((a) => a.id == id)!);
        setRules(output);
    }

    async function setChance(id: bigint, chance: number) {
        let output = [...rules]; // CREATE A COPY

        for (let i = 0; i < output.length; i++) {
            if (output[i].id == id) {
                output[i].chance_to_apply = chance;
            }
        }
        await updateRule(output.find((a) => a.id == id)!);
        setRules(output);
    }

    function selectRule(rule: Rule) {
        if (selectedRule?.id === rule.id) {
            setSelectedRule(null);
            return;
        }
        setSelectedRule(rule);
    }

    return <Card title="Rules">
        {rules.length === 0 ? (
            <p>No rules found for this configuration.</p>
        ) : (
            <ul>
                {rules.map((rule) => (
                    <RulesListItem key={rule.id} selected={selectedRule?.id === rule.id} onSelected={selectRule} rule={rule} onDelete={DeleteRule} onIncrement={IncrementPriority} onDecrement={DecrementPriority} onToggled={toggleEnabled} onSetChance={setChance} />
                ))}
            </ul>
        )}
    </Card>
}