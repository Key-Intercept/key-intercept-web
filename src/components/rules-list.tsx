import Card from "./card";
import type { Rule, RuleGroup } from "../script/types";
import RulesListItem from "./rules-list-item";
import RulesListGroup from "./rules-list-group";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";

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
  updateRuleGroup,
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
  const [draggedItem, setDraggedItem] = useState<any>(null);

  // Create sortable IDs for all items
  const sortableIds = [
    ...looseRules.map((r) => `rule-${r.id}`),
    ...ruleGroups.map((g) => `group-${g.id}`),
  ];

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
    const groupToDelete = ruleGroups.find((g) => g.id === id);
    if (!groupToDelete) return;

    const newGroups = ruleGroups.filter((g) => g.id !== id);

    if (deleteRules) {
      // Delete all rules in the group
      for (const rule of groupToDelete.rules) {
        await deleteRule(rule.id);
      }
    } else {
      // Move rules to loose
      const movedRules = groupToDelete.rules.map((rule) => ({
        ...rule,
        group_id: null,
      }));

      for (const rule of movedRules) {
        await updateRule(rule);
      }

      setLooseRules([...looseRules, ...movedRules]);
    }

    await deleteRuleGroup(id);
    setRuleGroups(newGroups);
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
    let output = [...looseRules];

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
    let output = [...looseRules];

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
    // Always set to this group (don't toggle off)
    setSelectedRuleGroup(group);
    
    // Only keep selected rule if it's in this group
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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setDraggedItem(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle reordering loose rules
    if (
      activeId.startsWith("rule-") &&
      overId.startsWith("rule-") &&
      active.data.current?.type === "Rule" &&
      over.data.current?.type === "Rule"
    ) {
      const activeRule = active.data.current.rule as Rule;
      const overRule = over.data.current.rule as Rule;

      if (activeRule.group_id === null && overRule.group_id === null) {
        const activeIndex = looseRules.findIndex((r) => r.id === activeRule.id);
        const overIndex = looseRules.findIndex((r) => r.id === overRule.id);

        if (activeIndex !== overIndex) {
          const newRules = [...looseRules];
          const [removed] = newRules.splice(activeIndex, 1);
          newRules.splice(overIndex, 0, removed);

          // Recalculate order values
          newRules.forEach((rule, index) => {
            rule.order = index * 10;
            updateRule(rule);
          });

          setLooseRules(newRules);
        }
      }
    }

    // Handle moving rule into group
    if (
      activeId.startsWith("rule-") &&
      overId.startsWith("drop-group-") &&
      active.data.current?.type === "Rule"
    ) {
      const rule = active.data.current.rule as Rule;
      const targetGroupId = over.data.current?.group?.id as bigint | undefined;

      if (targetGroupId !== undefined && rule.group_id !== targetGroupId) {
        // Look up current group from state instead of using stale event data
        const currentTargetGroup = ruleGroups.find((g) => g.id === targetGroupId);
        if (!currentTargetGroup) return;

        // Create updated rule with new group_id
        const updatedRule = { ...rule, group_id: targetGroupId };

        // Find and remove from current location, then add to target group
        let newGroups = ruleGroups.map((g) => {
          // Remove from other groups if it was in one
          if (rule.group_id !== null && g.id === rule.group_id) {
            return { ...g, rules: g.rules.filter((r) => r.id !== rule.id) };
          }
          return g;
        });

        // Add to target group
        newGroups = newGroups.map((g) => {
          if (g.id === targetGroupId) {
            return {
              ...g,
              rules: [...g.rules.filter((r) => r.id !== rule.id), updatedRule],
            };
          }
          return g;
        });

        // Atomic state update
        setRuleGroups(newGroups);
        if (rule.group_id === null) {
          setLooseRules(looseRules.filter((r) => r.id !== rule.id));
        }

        // Update the rule in the database
        updateRule(updatedRule);
      }
    }
  }

  return (
    <Card title="Rules">
      {looseRules?.length === 0 && ruleGroups?.length === 0 ? (
        <p>No rules found for this configuration.</p>
      ) : (
        <DndContext
          onDragEnd={handleDragEnd}
          collisionDetection={closestCorners}
          onDragStart={(event) => {
            setDraggedItem(event.active.data.current);
          }}
        >
          <SortableContext
            items={sortableIds}
            strategy={verticalListSortingStrategy}
          >
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {/* Loose Rules Section */}
              {looseRules && looseRules.length > 0 && (
                <li style={{ marginBottom: "20px" }}>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                      color: "#7700ff",
                      marginBottom: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    Ungrouped Rules
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {looseRules.map((rule) => (
                      <li key={rule.id}>
                        <RulesListItem
                          selected={selectedRule?.id === rule.id}
                          onSelected={selectRule}
                          rule={rule}
                          onDelete={(rule) => DeleteRule(rule, null)}
                          onIncrement={IncrementPriority}
                          onDecrement={DecrementPriority}
                          onToggled={toggleEnabled}
                          onSetChance={setChance}
                        />
                      </li>
                    ))}
                  </ul>
                </li>
              )}

              {/* Rule Groups Section */}
              {ruleGroups && ruleGroups.length > 0 && (
                <li>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                      color: "#7700ff",
                      marginBottom: "10px",
                      marginTop: "20px",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    Rule Groups
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {ruleGroups.map((group) => (
                      <li key={group.id}>
                        <RulesListGroup
                          group={group}
                          selectedRule={selectedRule}
                          selectedGroup={selectedRuleGroup}
                          onSelectGroup={selectRuleGroup}
                          onSelectRule={selectRule}
                          onDeleteRule={(ruleId) =>
                            DeleteRule(ruleId, group.id)
                          }
                          onDeleteGroup={DeleteRuleGroup}
                          onIncrementRulePriority={IncrementPriority}
                          onDecrementRulePriority={DecrementPriority}
                          onToggleRuleEnabled={toggleEnabled}
                          onSetRuleChance={setChance}
                        />
                      </li>
                    ))}
                  </ul>
                </li>
              )}
            </ul>
          </SortableContext>
          <DragOverlay>
            {draggedItem?.type === "Rule" && (
              <div
                style={{
                  backgroundColor: "#1a0033",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "2px solid #7700ff",
                  minWidth: "200px",
                  opacity: 0.8,
                }}
              >
                Rule being dragged
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}
    </Card>
  );
}
