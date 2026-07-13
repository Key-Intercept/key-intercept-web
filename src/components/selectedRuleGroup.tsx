import { useState, useEffect } from "react";
import type { Rule, RuleGroup } from "../script/types";
import Card from "./card";
import Separator from "./separator";
import { safeCreateRegex } from "./ruleEditorModes/assets/regex";
import Label from "./ruleEditorModes/assets/Label";
import Textbox from "./ruleEditorModes/assets/Textbox";
import Datebox from "./ruleEditorModes/assets/DateBox";

export default function SelectedRuleGroup({
  selectedGroup,
  defaultConfigId,
  setGroup,
}: {
  selectedGroup: RuleGroup | null;
  defaultConfigId: bigint;
  setGroup: (rule: RuleGroup | null) => void;
}) {
  const [localRule, setLocalRule] = useState<RuleGroup | null>(selectedGroup);

  useEffect(() => {
    setLocalRule(selectedGroup);
  }, [selectedGroup]);

  let _selectedGroup = localRule;
  if (!_selectedGroup) {
    _selectedGroup = {
      id: -1n,
      config_id: defaultConfigId,
      created_at: new Date(Date.now()),
      disabled_at: new Date(Date.now()),
      name: "New Rule Group",
      rules: [],
    },
  }
  const isNewGroup = !_selectedGroup || _selectedGroup.id === -1n;

  function setNameProp(label: string) {
    setLocalRule((prev) =>
      prev
        ? { ...prev, name: label }
        : ({
            id: -1n,
            config_id: defaultConfigId,
      created_at: new Date(Date.now()),
      disabled_at: new Date(Date.now()),
      name: label,
          } as RuleGroup),
    );
  }

  function setDisabledAtProp(disabled_at: number) {
    setLocalRule((prev) =>
      prev
        ? { ...prev, disabled_at: new Date(disabled_at) }
        : ({
            id: -1n,
            config_id: defaultConfigId,
      created_at: new Date(Date.now()),
      disabled_at: new Date(disabled_at),
      name: "New Rule Group",
          } as RuleGroup),
    );
  }

  const buttonContainerStyle: React.CSSProperties = {
    gap: "10px",
    marginBottom: "10px",
    width: "100%",
    maxWidth: "50vw",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(60px, 1fr))",
    minWidth: "280px",
  };

  const submitButtonStyle: React.CSSProperties = {
    padding: "10px",
    borderRadius: "4px",
    backgroundColor: "#7700ff",
    color: "#fff",
    cursor: "pointer",
    border: "2px solid transparent",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontWeight: "bold",
    transition: "all 0.2s ease",
    flexDirection: "row",
    textAlign: "center",
    justifyContent: "center",
    width: "100%",
  };

  const editorContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "100%",
  };

  const runsOutIn = Date.now() - (selectedGroup?.disabled_at.getTime() ?? Date.now())

  return (
    <Card title={isNewGroup ? "Add New Rule Group" : "Selected Rule Group"}>
      <div style={editorContainerStyle}>
      <Textbox placeholder="Group name" defaultValue={selectedGroup?.name ?? ""} onChange={setNameProp} />
      <Datebox placeholder="Runs Out in:" defaultValue={runsOutIn} onChange={(hour, min, sec) => {
	if (hour !== null) {
		setDisabledAtProp(Date.now() + (hour * 60 * 60 * 1000));
	}
	if (min !== null) {
		setDisabledAtProp(Date.now() + (min * 60 * 1000));
	}
	if (sec !== null) {
		setDisabledAtProp(Date.now() + (sec * 1000));
      }}}/>
        <Separator color="#333" />
        <button
          style={submitButtonStyle}
          onClick={() => {
            setGroup(selectedGroup);
          }}
        >
          {isNewGroup ? "Add Group" : "Edit Group"}
        </button>
      </div>
    </Card>
  );
}
