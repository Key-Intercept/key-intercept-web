import { useState } from "react";
import type { Rule, RuleGroup } from "../script/types";
import { isGroupEnabled } from "../script/types";
import RulesListGroupItem from "./rules-list-group-item";
import RulesListItem from "./rules-list-item";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function RulesListGroup({
  group,
  selectedRule,
  selectedGroup,
  onSelectGroup,
  onSelectRule,
  onDeleteRule,
  onDeleteGroup,
  onIncrementRulePriority,
  onDecrementRulePriority,
  onToggleRuleEnabled,
  onSetRuleChance,
}: {
  group: RuleGroup;
  selectedRule: Rule | null;
  selectedGroup: RuleGroup | null;
  onSelectGroup: (group: RuleGroup) => void;
  onSelectRule: (rule: Rule) => void;
  onDeleteRule: (id: bigint) => void;
  onDeleteGroup: (id: bigint, deleteRules: boolean) => void;
  onIncrementRulePriority: (id: bigint) => void;
  onDecrementRulePriority: (id: bigint) => void;
  onToggleRuleEnabled: (id: bigint) => void;
  onSetRuleChance: (id: bigint, chance: number) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const isEnabled = isGroupEnabled(group);

  const {
    setNodeRef,
    isOver,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({
    id: `group-${group.id}`,
    data: { type: "Group", group },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isOver ? 0.9 : 1,
  };

  const groupContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "15px",
    borderLeft: "4px solid #7700ff",
    paddingLeft: "12px",
    borderRadius: "4px",
  };

  const rulesContainerStyle: React.CSSProperties = {
    display: isExpanded ? "flex" : "none",
    flexDirection: "column",
    gap: "8px",
    paddingLeft: "12px",
    borderLeft: "2px solid #444",
    marginLeft: "8px",
    marginTop: "8px",
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, ...groupContainerStyle }}
      {...attributes}
    >
      <RulesListGroupItem
        group={group}
        selected={selectedGroup?.id === group.id}
        isExpanded={isExpanded}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
        onDelete={onDeleteGroup}
        onSelected={onSelectGroup}
        isEnabled={isEnabled}
      />
      <div style={rulesContainerStyle}>
        {group.rules?.map((rule) => (
          <RulesListItem
            key={rule.id}
            rule={rule}
            selected={selectedRule?.id === rule.id}
            indented={true}
            isGroupDisabled={!isEnabled}
            onDelete={(ruleId) => onDeleteRule(ruleId)}
            onToggled={onToggleRuleEnabled}
            onIncrement={onIncrementRulePriority}
            onDecrement={onDecrementRulePriority}
            onSetChance={onSetRuleChance}
            onSelected={onSelectRule}
          />
        ))}
      </div>
    </div>
  );
}
