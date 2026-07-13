import Card from "./card";
import type { Rule, RuleGroup } from "../script/types";
import RulesListItem from "./rules-list-item";
import RulesListGroupItem from "./rules-list-group-item";

export default function RulesList({
  ruleGroups,
  setRuleGroups,
  looseRules,
  setLooseRules,
  selectedRule,
  selectedRuleGroup,
  setSelectedRule,
  setSelectedRuleGroup,
  updateRule,
  deleteRule,
  deleteRuleGroup,
}: {
  ruleGroups: RuleGroup[];
  setRuleGroups: (ruleGroup: RuleGroup[]) => void;
  looseRules: Rule[];
  setLooseRules: (rule: Rule[]) => void;
  selectedRule: Rule | null;
  selectedRuleGroup: RuleGroup | null;
  setSelectedRule: (rule: Rule | null) => void;
  setSelectedRuleGroup: (group: RuleGroup | null) => void;
  updateRule: (rule: Rule) => void;
  updateRuleGroup: (ruleGroup: RuleGroup) => void;
  deleteRule: (id: bigint) => void;
  deleteRuleGroup: (id: bigint) => void;
}) {
  async function DeleteRule(rule_id: bigint, group_id: bigint | null) {
    if (group_id == null) {
      let output: Rule[] = [];
      looseRules.forEach((a) => {
        if (rule_id != a.id) {
          output.push(a);
        }
      });
      await deleteRule(rule_id);
      setLooseRules(output);
    } else {
      let output: RuleGroup[] = [];
      for (var i of ruleGroups) {
        var newItem = i;
        if (i.id == group_id) {
          let temp: Rule[] = [];
          for (var j of i.rules) {
            if (j.id != rule_id) {
              temp.push(j);
            }
          }
          newItem.rules = temp;
        }
        output.push(newItem);
      }
      await deleteRule(rule_id);
      setRuleGroups(output);
    }
  }

  async function DeleteRuleGroup(id: bigint, deleteRules: boolean) {
    var output: RuleGroup[] = [];
    for (var i of ruleGroups) {
      if (i.id != id) {
        output.push(i);
      }
    }
    if (deleteRules) {
      for (var i of ruleGroups) {
        if (i.id == id) {
          for (var j of i.rules) {
            DeleteRule(j.id, i.id);
          }
        }
      }
    } else {
      var newLooseRules = looseRules;
      for (var i of ruleGroups) {
        if (i.id == id) {
          for (var j of i.rules) {
            looseRules.push(j);
          }
        }
      }
      setLooseRules(newLooseRules);
    }
    await deleteRuleGroup(id);
    setRuleGroups(output);
  }

  async function IncrementPriority(id: bigint) {
    let output = [...looseRules];

    for (let i = 0; i < output.length; i++) {
      if (output[i].id == id) {
        output[i].order = output[i - 1]
          ? output[i - 1].order - 1
          : output[i].order - 1;
      }
    }
    output.sort((a, b) => {
      return a.order - b.order;
    });

    await updateRule(output.find((a) => a.id == id)!);
    setLooseRules(output);
  }

  async function DecrementPriority(id: bigint) {
    let output = [...looseRules]; // CREATE A COPY

    for (let i = 0; i < output.length; i++) {
      if (output[i].id == id) {
        output[i].order = output[i + 1]
          ? output[i + 1].order + 1
          : output[i].order + 1;
      }
    }
    output.sort((a, b) => {
      return a.order - b.order;
    });
    await updateRule(output.find((a) => a.id == id)!);
    setLooseRules(output);
  }

  async function toggleEnabled(id: bigint) {
    let output = [...looseRules];

    for (let i = 0; i < output.length; i++) {
      if (output[i].id == id) {
        output[i].enabled = !output[i].enabled;
      }
    }
    await updateRule(output.find((a) => a.id == id)!);
    setLooseRules(output);
  }

  async function setChance(id: bigint, chance: number) {
    let output = [...looseRules]; // CREATE A COPY

    for (let i = 0; i < output.length; i++) {
      if (output[i].id == id) {
        output[i].chance_to_apply = chance;
      }
    }
    await updateRule(output.find((a) => a.id == id)!);
    setLooseRules(output);
  }

  function selectRule(rule: Rule) {
    if (selectedRule?.id === rule.id) {
      setSelectedRule(null);
      return;
    }
    setSelectedRule(rule);
    for (var i of ruleGroups) {
      for (var j of i.rules) {
        if (j.id === rule.id) {
          selectRuleGroup(i);
        }
      }
    }
  }

  function selectRuleGroup(group: RuleGroup) {
    if (selectedRuleGroup?.id === group.id) {
      setSelectedRuleGroup(null);
      setSelectedRule(null);
      return;
    }
    setSelectedRuleGroup(group);
    let inRule = false;
    for (var i of group.rules) {
      if (i.id === selectedRule?.id) {
        inRule = true;
      }
    }
    if (!inRule) {
      setSelectedRule(null);
    }
  }

  return (
    <Card title="Rules">
      {looseRules?.length === 0 && ruleGroups?.length === 0 ? (
        <p>No rules found for this configuration.</p>
      ) : (
        <ul>
          {looseRules ? (
            looseRules.map((rule) => (
              <RulesListItem
                key={rule.id}
                selected={selectedRule?.id === rule.id}
                onSelected={selectRule}
                rule={rule}
                onDelete={(rule) => DeleteRule(rule, null)}
                onIncrement={IncrementPriority}
                onDecrement={DecrementPriority}
                onToggled={toggleEnabled}
                onSetChance={setChance}
              />
            ))
          ) : (
            <></>
          )}
          {ruleGroups ? (
            ruleGroups.map((group) => (
              <RulesListGroupItem
                key={group.id}
                selected={selectedRuleGroup?.id === group.id}
                onSelected={selectRuleGroup}
                group={group}
                onDelete={DeleteRuleGroup}
              />
            ))
          ) : (
            <></>
          )}
        </ul>
      )}
    </Card>
  );
}
