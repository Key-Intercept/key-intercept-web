import { createClient } from '@supabase/supabase-js';
import errorOccurred from './reactError';
import Card from './card.astro';
import type { Rule } from '../script/types';
import RulesListItem from './rules-list-item';
import { useState } from 'react';

export default async function RulesList({ rules, setRules,selectedRule,  setSelectedRule }: { rules: Rule[], setRules: (rules: Rule[]) => void, selectedRule: Rule, setSelectedRule: (rule: Rule) => void }) {
    function DeleteRule(id: bigint) {
        let output: Rule[] = [];

        rules.forEach((a) => {
            if (a.id != id) {
                output.push(a)
            }
        });

        setRules(output);
    }

    function IncrementPriority(id: bigint) {
        let output = rules;
        for (let i = 0; i < output.length; i++) {
            if (output[i].id == id) {
                output[i].order = output[i - 1] ? output[i - 1].order - 1 : output[i].order - 1;
            }
        }
        output.sort((a, b) => { return a.order - b.order });
        setRules(output);
    }

    function DecrementPriority(id: bigint) {
        let output = rules;
        for (let i = 0; i < output.length; i++) {
            if (output[i].id == id) {
                output[i].order = output[i + 1] ? output[i - 1].order + 1 : output[i].order + 1;
            }
        }
        output.sort((a, b) => { return a.order - b.order });
        setRules(output);
    }

    function toggleEnabled(id: bigint) {
        let output = rules;
        for (let i = 0; i < output.length; i++) {
            if (output[i].id == id) {
                output[i].enabled = false;
            }
        }
        setRules(output);
    }

    return <Card title="Rules">
        {rules.length === 0 ? (
            <p>No rules found for this configuration.</p>
        ) : (
            <ul>
                {rules.map((rule) => (
                    <RulesListItem rule={rule} onDelete={DeleteRule} onIncrement={IncrementPriority} onDecrement={DecrementPriority} onToggled={toggleEnabled} />
                ))}
            </ul>
        )}
    </Card>
}