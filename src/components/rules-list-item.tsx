import type { Rule } from "../script/types";
import { useState } from "react";
import RulesListItemButton from "./rules-list-item-button";
import { normalizeRegexSource } from "./ruleEditorModes/assets/regex";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function RulesListItem({
  rule,
  selected,
  indented = false,
  isGroupDisabled = false,
  onDelete,
  onToggled,
  onIncrement,
  onDecrement,
  onSetChance,
  onSelected,
}: {
  rule: Rule;
  selected: boolean;
  indented?: boolean;
  isGroupDisabled?: boolean;
  onDelete: (id: bigint) => void;
  onToggled: (id: bigint) => void;
  onIncrement: (id: bigint) => void;
  onDecrement: (id: bigint) => void;
  onSetChance: (id: bigint, chance: number) => void;
  onSelected: (Rule: Rule) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [EditChancePressed, setEditChancePressed] = useState(false);

  // Rule is effectively enabled only if both the rule is enabled AND the group is not disabled
  const effectivelyEnabled = rule.enabled && !isGroupDisabled;

  const {
    setNodeRef,
    isDragging,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({
    id: `rule-${rule.id}`,
    data: { type: "Rule", rule },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `${selected || hovered ? "10px" : "12px"}`,
    marginBottom: "10px",
    border: `${selected || hovered ? "2px" : "0px"} solid ${hovered ? "#ccc" : "#7700ff"}`,
    borderRadius: "20px",
    flexDirection: "row",
    gap: "10px",
    width: "100%",
    maxWidth: "40vw",
    minWidth: "280px",
    backgroundColor: "#111111",
    cursor: isDragging ? "grabbing" : "grab",
    flexWrap: "wrap",
    marginLeft: indented ? "20px" : "0px",
    opacity: isGroupDisabled ? 0.6 : 1,
    transition: "all 0.2s ease",
  };

  const textContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    flex: 1,
    marginLeft: "10px",
    marginRight: "10px",
    minWidth: "150px",
    overflow: "hidden",
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: "bold",
    fontSize: "clamp(0.9rem, 2vw, 1rem)",
    textDecoration: effectivelyEnabled ? "none" : "line-through",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "100%",
    opacity: effectivelyEnabled ? 1 : 0.6,
  };

  const regexStyle: React.CSSProperties = {
    fontStyle: "italic",
    color: "#555",
    textDecoration: effectivelyEnabled ? "none" : "line-through",
    fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "100%",
    opacity: effectivelyEnabled ? 1 : 0.6,
  };

  const EditChanceInputStyle: React.CSSProperties = {
    width: "clamp(50px, 10vw, 80px)",
    padding: "5px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: "#222222",
    color: "white",
  };

  const dragHandleStyle: React.CSSProperties = {
    width: "22px",
    height: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    backgroundColor: "#2a2a2a",
    color: "#999",
    cursor: isDragging ? "grabbing" : "grab",
    userSelect: "none",
    flexShrink: 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, ...containerStyle }}
      onClick={(e) => {
        e.stopPropagation();
        onSelected(rule);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...attributes}
    >
      <div
        {...listeners}
        style={dragHandleStyle}
        onClick={(e) => e.stopPropagation()}
        aria-label="Drag rule"
      >
        ⋮⋮
      </div>
      <RulesListItemButton
        square={true}
        onPressed={(e: any) => {
          e?.stopPropagation();
          e?.preventDefault();
          onToggled(rule.id);
        }}
      >
        {effectivelyEnabled ? rule.order : "x"}
      </RulesListItemButton>
      <div style={textContainerStyle}>
        <div style={labelStyle}>{rule.label}</div>
        <div style={regexStyle}>
          {normalizeRegexSource(rule.rule_regex.source)} →{" "}
          {rule.rule_replacement}
        </div>
      </div>
      {EditChancePressed && (
        <input
          type="number"
          min="0"
          max="100"
          value={rule.chance_to_apply * 100}
          onChange={(e) => {
            e.stopPropagation();
            onSetChance(rule.id, parseFloat(e.target.value) / 100);
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
          onClick={(e) => e.stopPropagation()}
          style={EditChanceInputStyle}
        />
      )}
      <RulesListItemButton
        square={false}
        onPressed={() => setEditChancePressed(!EditChancePressed)}
      >
        {rule.chance_to_apply * 100}%
      </RulesListItemButton>
      <div>
        <RulesListItemButton
          square={true}
          onPressed={() => onIncrement(rule.id)}
        >
          ↑
        </RulesListItemButton>
        <RulesListItemButton
          square={true}
          onPressed={() => onDecrement(rule.id)}
        >
          ↓
        </RulesListItemButton>
        <RulesListItemButton square={true} onPressed={() => onDelete(rule.id)}>
          x
        </RulesListItemButton>
      </div>
    </div>
  );
}
