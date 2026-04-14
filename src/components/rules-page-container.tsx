import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import type { Rule } from "../script/types";
import errorOccurred from "./reactError";
import Card from "./card.astro";
import SelectedRule from "./selectedRule";
import RulesList from "./rules-list";

export default async function RulesPageContainer({ configID }: { configID: number }) {
    const supabase = createClient(import.meta.env.SUPABASE_URL, import.meta.env.SUPABASE_SERVICE_KEY);
    const { data: rulesData, error } = await supabase
        .from('Rules')
        .select('*')
        .eq('config_id', configID);

    const rulesDatabase: Rule[] = rulesData ? rulesData.map((rule) => ({
        id: rule.id,
        created_at: new Date(rule.created_at),
        updated_at: new Date(rule.updated_at),
        config_id: rule.config_id,
        rule_regex: new RegExp(rule.rule_regex),
        rule_replacement: rule.rule_replacement,
        enabled: rule.enabled,
        chance_to_apply: rule.chance_to_apply,
        label: rule.label,
        order: rule.order,
    })) : [];

    if (error) {
        console.error('[supabase] Error fetching rules:', error);
        console.error('Config ID:', configID);
        return errorOccurred("--- Error loading rules ---");
    }

    const [rules, setRules] = useState(rulesDatabase.sort((a, b) => { return a.order - b.order }))



    return <><Card><SelectedRule /></Card><Card><RulesList rules={rules} setRules={setRules}/></Card></>
}