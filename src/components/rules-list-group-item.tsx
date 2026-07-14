import type { Rule, RuleGroup } from "../script/types";
import { useState } from "react";
import RulesListItemButton from "./rules-list-item-button";
import { normalizeRegexSource } from "./ruleEditorModes/assets/regex";
import { formatRemainingTime } from "./turn-on-timer";
import { useDroppable } from "@dnd-kit/core";

export default function RulesListGroupItem({
  group,
  selected,
  isExpanded,
  isEnabled,
  onToggleExpand,
  onDelete,
  onSelected,
  dragAttributes,
  dragListeners,
}: {
  group: RuleGroup;
  selected: boolean;
  isExpanded: boolean;
  isEnabled: boolean;
  onToggleExpand: () => void;
  onDelete: (id: bigint, deleteRules: boolean) => void;
  onSelected: (group: RuleGroup) => void;
  dragAttributes: any;
  dragListeners: any;
}) {
  const [hovered, setHovered] = useState(false);
  const [hoverDelete, setHoverDelete] = useState(false);

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `drop-group-${group.id}`,
    data: { type: "GroupDropZone", group },
  });

  const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `${selected || hovered ? "10px" : "12px"}`,
    marginBottom: "0px",
    border: `${selected || hovered ? "2px" : "1px"} solid ${
      hovered ? "#ccc" : isOver ? "#7700ff" : "#555"
    }`,
    borderRadius: "20px",
    flexDirection: "row",
    gap: "10px",
    width: "100%",
    maxWidth: "40vw",
    minWidth: "280px",
    backgroundColor: isOver ? "#1a0033" : "#111111",
    cursor: "pointer",
    flexWrap: "wrap",
    opacity: isEnabled ? 1 : 0.6,
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

  const chevronStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "24px",
    height: "24px",
    cursor: "pointer",
    transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
    transition: "transform 0.2s ease",
    fontSize: "16px",
    color: "#7700ff",
    fontWeight: "bold",
    userSelect: "none",
  };

  const dragHandleStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "22px",
    height: "22px",
    borderRadius: "4px",
    backgroundColor: "#2a2a2a",
    color: "#999",
    cursor: "grab",
    userSelect: "none",
    flexShrink: 0,
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: "bold",
    fontSize: "clamp(0.9rem, 2vw, 1rem)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "100%",
    textDecoration: isEnabled ? "none" : "line-through",
  };

  const ruleCountStyle: React.CSSProperties = {
    fontStyle: "italic",
    color: "#888",
    fontSize: "clamp(0.75rem, 1.5vw, 0.85rem)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "100%",
  };

  const timeStyle: React.CSSProperties = {
    fontStyle: "italic",
    color: "#555",
    fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "100%",
    opacity: isEnabled ? 1 : 0.6,
  };

  const remainingTime = formatRemainingTime(
    Date.now() - group.disabled_at.getTime(),
  );

  return (
    <div
      ref={setDropRef}
      style={containerStyle}
      onClick={(e) => {
        e.stopPropagation();
        onSelected(group);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={chevronStyle}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onToggleExpand();
        }}
      >
        ▶
      </div>
      <div
        {...dragListeners}
        style={dragHandleStyle}
        onClick={(e) => e.stopPropagation()}
        aria-label="Drag group"
      >
        ⋮⋮
      </div>
      <div style={textContainerStyle}>
        <div style={labelStyle}>{group.name}</div>
        <div style={ruleCountStyle}>{group.rules?.length ?? 0} rule(s)</div>
        <div style={timeStyle}>
          Expires: {remainingTime[0]}:{remainingTime[1]}:{remainingTime[2]}
        </div>
      </div>
      <div>
        <RulesListItemButton
          square={true}
          onPressed={(e: any) => {
            e?.stopPropagation();
            e?.preventDefault();
            setHoverDelete(true);
            setTimeout(() => {
              onDelete(
                group.id,
                confirm(
                  "Press OK to delete any rules associated with this group, otherwise press cancel.",
                ),
              );
              setHoverDelete(false);
            }, 0);
          }}
        >
          x
        </RulesListItemButton>
      </div>
    </div>
  );
}
