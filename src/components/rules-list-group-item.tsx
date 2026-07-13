import type { Rule, RuleGroup } from "../script/types";
import { useState } from "react";
import RulesListItemButton from "./rules-list-item-button";
import { canHaveDecorators } from "typescript";
import { normalizeRegexSource } from "./ruleEditorModes/assets/regex";
import { formatRemainingTime } from "./turn-on-timer";

export default function RulesListGroupItem({
  group,
  selected,
  onDelete,
  onSelected,
}: {
  group: RuleGroup;
  selected: boolean;
  onDelete: (id: bigint, deleteRules: boolean) => void;
  onSelected: (Rule: RuleGroup) => void;
}) {
  const [hovered, setHovered] = useState(false);

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
    cursor: "pointer",
    flexWrap: "wrap",
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
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "100%",
  };

  const regexStyle: React.CSSProperties = {
    fontStyle: "italic",
    color: "#555",
    fontSize: "clamp(0.85rem, 1.5vw, 0.95rem)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "100%",
  };

  const remainingTime = formatRemainingTime(
    Date.now() - group.disabled_at.getTime(),
  );

  return (
    <div
      style={containerStyle}
      onClick={() => onSelected(group)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={textContainerStyle}>
        <div style={labelStyle}>{group.name}</div>
        <div style={regexStyle}>
          {remainingTime[0]}:{remainingTime[1]}:{remainingTime[2]}
        </div>
      </div>
      <div>
        <RulesListItemButton
          square={true}
          onPressed={() => {
            onDelete(
              group.id,
              confirm(
                "Press OK to delete any rules associated with this group, otherwise press cancel.",
              ),
            );
          }}
        >
          x
        </RulesListItemButton>
      </div>
    </div>
  );
}
