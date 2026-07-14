import { useState } from "react";
import type { Rule, RuleGroup } from "../script/types";
import RulesList from "./rules-list";
import SelectedRule from "./selectedRule";
import TurnOnTimer from "./turn-on-timer";
import SelectedRuleGroup from "./selectedRuleGroup";

export default function RulesPageContainer({
  initialRules,
  initialGroups,
  initialConfigId,
  initialRulesEnd,
}: {
  initialRules: Rule[];
  initialGroups: RuleGroup[];
  initialConfigId: string;
  initialRulesEnd: string;
}) {
  const [looseRules, setLooseRules] = useState(
    [...initialRules]
      .filter((r, i, a) => r.group_id === null)
      .sort((a, b) => a.order - b.order),
  );
  const [groups, setGroups] = useState(() => {
    var temp = [...initialGroups];
    temp.forEach(
      (v, k, c) =>
        (v.rules = [...initialRules].filter((r, j, b) => r.group_id === v.id)),
    );
    return temp;
  });
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<RuleGroup | null>(null);
  const currentConfigId = BigInt(initialConfigId);

  async function deleteRuleDatabase(id: bigint) {
    const res = await fetch(`/api/rules?id=${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.error("Error deleting rule:", await res.text());
      await alert(
        "An error occurred while deleting the rule. Please try again.",
      );
    }
  }

  async function deleteGroupDatabase(id: bigint) {
    const res = await fetch(`/api/ruleGroups?id=${id}`, { method: "DELETE" });

    if (!res.ok) {
      console.error("Error deleting rule group:", await res.text());
      await alert(
        "An error has occured while deleting the group. Please try again.",
      );
    }
  }

  async function updateRuleDatabase(rule: Rule) {
    const payload = {
      ...rule,
      // convert RegExp source '(?:)' (from new RegExp('')) to empty string
      rule_regex:
        rule.rule_regex.source === "(?:)" ? "" : rule.rule_regex.source,
      id: rule.id.toString(), // Convert BigInt to string for JSON serialization
      config_id: rule.config_id.toString(),
      group_id: rule.group_id ? rule.group_id.toString() : null,
    };

    const res = await fetch("/api/rules", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Error updating rule:", await res.text());
      await alert(
        "An error occurred while updating the rule. Please try again.",
      );
    }
    if (rule.group_id === null) {
      setLooseRules((prevRules) => {
        // Remove rule from any group it was in and add/replace in loose
        const exists = prevRules.some((r) => r.id === rule.id);
        const next = exists
          ? prevRules.map((r) => (r.id === rule.id ? rule : r))
          : [...prevRules, rule];
        return next.sort((a, b) => a.order - b.order);
      });
      // Also remove from any group it might be in
      setGroups((prevGroups) =>
        prevGroups.map((g) => ({
          ...g,
          rules: g.rules.filter((r) => r.id !== rule.id),
        }))
      );
    } else {
      // Rule has a group_id, so add/replace into the target group and remove from loose
      setGroups((prevGroups) => {
        // First, remove the rule from any group
        const cleaned = prevGroups.map((g) => ({
          ...g,
          rules: g.rules.filter((r) => r.id !== rule.id),
        }));
        // Then add/replace into the target group
        const targetIndex = cleaned.findIndex((g) => g.id === rule.group_id);
        if (targetIndex !== -1) {
          const g = cleaned[targetIndex];
          const exists = g.rules.some((r) => r.id === rule.id);
          const newRules = exists
            ? g.rules.map((r) => (r.id === rule.id ? rule : r))
            : [...g.rules, rule];
          cleaned[targetIndex] = { ...g, rules: newRules };
        }
        return cleaned;
      });
      // Remove from loose rules if it was there
      setLooseRules((prevRules) =>
        prevRules.filter((r) => r.id !== rule.id)
      );
    }
  }

  async function updateGroupDatabase(group: RuleGroup) {
    const payload = {
      id: group.id.toString(),
      config_id: group.config_id.toString(),
      name: group.name,
      disabled_at: group.disabled_at.toISOString(),
      created_at: group.created_at.toISOString(),
    };

    const res = await fetch("/api/ruleGroups", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Error updating group:", await res.text());
      await alert(
        "An error occured while updating the group. Please try again.",
      );
    }
    setGroups((prevGroups) => {
      const updatedGroups = prevGroups.map((g) =>
        g.id === group.id ? group : g,
      );
      return updatedGroups;
    });
  }

  async function addNewRuleDatabase(rule: Rule) {
    // Prepare rule for JSON
    const { id: _id, config_id: _configId, ...ruleData } = rule;
    const payload = {
      ...ruleData,
      // convert RegExp source '(?:)' (from new RegExp('')) to empty string
      rule_regex:
        rule.rule_regex.source === "(?:)" ? "" : rule.rule_regex.source,
      config_id: currentConfigId.toString(),
      group_id: rule.group_id ? rule.group_id.toString() : null,
    };

    const res = await fetch("/api/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Error adding new rule:", await res.text());
      await alert("An error occurred while adding the rule. Please try again.");
    }
    if (rule.group_id === null) {
      setLooseRules((prevRules) => {
        const newRule = { ...rule, id: BigInt(-1) }; // Temporary ID until we get the real one from the server
        return [...prevRules, newRule].sort((a, b) => a.order - b.order);
      });
    } else {
      var output: RuleGroup[] = [...groups];
      for (let i = 0; i < output.length; i++) {
        if (output[i].id === rule.group_id) {
          output[i].rules.push({ ...rule, id: BigInt(-1) });
        }
      }
      setGroups(output);
    }
  }

  async function addNewGroupDatabase(group: RuleGroup) {
    const payload = {
      config_id: group.config_id.toString(),
      name: group.name,
      disabled_at: group.disabled_at.toISOString(),
      created_at: group.created_at.toISOString(),
    };

    const res = await fetch("/api/ruleGroups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Error adding new group:", await res.text());
      await alert("An error occured while adding the group. Please try again.");
    }
    setGroups((prevGroups) => {
      const newGroup = { ...group, id: BigInt(-1) };
      return [...prevGroups, newGroup];
    });
  }
  return (
    <>
      {/* <TurnOnTimer
        title={"Rules End After"}
        configId={currentConfigId}
        endField={"rules_end"}
        initialEnd={initialRulesEnd}
      /> */}
      <SelectedRule
        i_selectedRule={selectedRule || null}
        defaultConfigId={currentConfigId}
        setRule={(rule) => {
          setSelectedRule(rule);
          if (rule!.id === -1n) {
            addNewRuleDatabase(rule!);
          } else {
            updateRuleDatabase(rule!);
          }
        }}
      />
      <SelectedRuleGroup
        selectedGroup={selectedGroup}
        defaultConfigId={currentConfigId}
        setGroup={(group) => {
          setSelectedGroup(group);
          if (group!.id === -1n) {
            addNewGroupDatabase(group!);
          } else {
            updateGroupDatabase(group!);
          }
        }}
      />
      <RulesList
        looseRules={looseRules}
        setLooseRules={setLooseRules}
        ruleGroups={groups}
        setRuleGroups={setGroups}
        selectedRule={selectedRule}
        selectedRuleGroup={selectedGroup}
        setSelectedRuleGroup={setSelectedGroup}
        setSelectedRule={setSelectedRule}
        updateRule={updateRuleDatabase}
        updateRuleGroup={updateGroupDatabase}
        deleteRule={deleteRuleDatabase}
        deleteRuleGroup={deleteGroupDatabase}
      />
    </>
  );
}
