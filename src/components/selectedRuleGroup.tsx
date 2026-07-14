import { useState, useEffect } from "react";
import type { Rule, RuleGroup } from "../script/types";
import { isGroupEnabled } from "../script/types";
import Card from "./card";
import Separator from "./separator";
import { safeCreateRegex } from "./ruleEditorModes/assets/regex";
import { normalizeRegexSource } from "./ruleEditorModes/assets/regex";
import Label from "./ruleEditorModes/assets/Label";
import Textbox from "./ruleEditorModes/assets/Textbox";

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

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
  const [daysToSet, setDaysToSet] = useState("0");
  const [hoursToSet, setHoursToSet] = useState("0");
  const [minutesToSet, setMinutesToSet] = useState("0");
  const [secondsToSet, setSecondsToSet] = useState("0");

  useEffect(() => {
    setLocalRule(selectedGroup);
    if (selectedGroup) {
      const remainingMs = Math.max(0, selectedGroup.disabled_at.getTime() - Date.now());
      const totalSeconds = Math.floor(remainingMs / 1000);
      const days = Math.floor(totalSeconds / (24 * 3600));
      const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      setDaysToSet(days.toString());
      setHoursToSet(hours.toString());
      setMinutesToSet(minutes.toString());
      setSecondsToSet(seconds.toString());
    }
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
    } as RuleGroup;
  }
  const isNewGroup = !_selectedGroup || _selectedGroup.id === -1n;
  const isEnabled = !isNewGroup ? isGroupEnabled(_selectedGroup) : true;

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
            rules: [],
          } as RuleGroup),
    );
  }

  function updateDisabledAtFromDuration(days?: string, hours?: string, minutes?: string, seconds?: string) {
    const d = toNumber(days ?? daysToSet);
    const h = toNumber(hours ?? hoursToSet);
    const m = toNumber(minutes ?? minutesToSet);
    const s = toNumber(seconds ?? secondsToSet);
    
    const totalDurationMs =
      d * 24 * 60 * 60 * 1000 +
      h * 60 * 60 * 1000 +
      m * 60 * 1000 +
      s * 1000;
    const newDisabledAt = new Date(Date.now() + totalDurationMs);
    setLocalRule((prev) =>
      prev
        ? { ...prev, disabled_at: newDisabledAt }
        : ({
            id: -1n,
            config_id: defaultConfigId,
            created_at: new Date(Date.now()),
            disabled_at: newDisabledAt,
            name: "New Rule Group",
            rules: [],
          } as RuleGroup),
    );
  }

  const submitButtonStyle: React.CSSProperties = {
    padding: "12px 16px",
    borderRadius: "6px",
    backgroundColor: "#7700ff",
    color: "#fff",
    cursor: "pointer",
    border: "2px solid transparent",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "bold",
    transition: "all 0.2s ease",
    flexDirection: "row",
    textAlign: "center",
    justifyContent: "center",
    width: "100%",
    fontSize: "0.95rem",
  };

  const editorContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
  };

  const sectionLabelStyle: React.CSSProperties = {
    fontSize: "0.85rem",
    fontWeight: "bold",
    color: "#7700ff",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "8px",
  };

  const sectionContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "14px",
    backgroundColor: "#1a1a1a",
    borderLeft: "3px solid #7700ff",
    borderRadius: "4px",
  };

  const previewContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    maxHeight: "200px",
    overflowY: "auto",
    padding: "10px",
    backgroundColor: "#111",
    borderRadius: "4px",
    border: "1px solid #333",
  };

  const previewItemStyle: React.CSSProperties = {
    fontSize: "0.75rem",
    padding: "6px 8px",
    backgroundColor: "#1a1a1a",
    borderRadius: "3px",
    borderLeft: "2px solid #555",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const statusLabelStyle: React.CSSProperties = {
    fontSize: "0.75rem",
    color: isEnabled ? "#4ade80" : "#f87171",
    fontWeight: "bold",
    display: "inline-block",
    marginLeft: "8px",
  };

  const timeInputStyle: React.CSSProperties = {
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #444",
    backgroundColor: "#222222",
    color: "#fff",
    fontSize: "0.95rem",
    width: "100%",
  };

  const timeFieldsContainerStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "8px",
  };

  const previewRules = _selectedGroup.rules?.slice(0, 5) ?? [];
  const remainingRules = Math.max(0, (_selectedGroup.rules?.length ?? 0) - 5);

  return (
    <Card title={isNewGroup ? "Add New Rule Group" : "Selected Rule Group"}>
      <div style={editorContainerStyle}>
        {/* Group Settings Section */}
        <div style={sectionContainerStyle}>
          <div style={sectionLabelStyle}>Group Settings</div>
          <Textbox
            placeholder="Group name"
            defaultValue={_selectedGroup.name ?? ""}
            onChange={setNameProp}
          />
        </div>

        {/* Expiration Time Section */}
        <div style={sectionContainerStyle}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={sectionLabelStyle}>Expires In</div>
            <span style={statusLabelStyle}>
              {isEnabled ? "Active" : "Disabled"}
            </span>
          </div>
          <div style={timeFieldsContainerStyle}>
            <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.8rem", color: "#888" }}>Days</span>
              <input
                type="number"
                min="0"
                step="1"
                value={daysToSet}
                onChange={(e) => {
                  setDaysToSet(e.target.value);
                  updateDisabledAtFromDuration(e.target.value, hoursToSet, minutesToSet, secondsToSet);
                }}
                style={timeInputStyle}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.8rem", color: "#888" }}>Hours</span>
              <input
                type="number"
                min="0"
                max="23"
                step="1"
                value={hoursToSet}
                onChange={(e) => {
                  setHoursToSet(e.target.value);
                  updateDisabledAtFromDuration(daysToSet, e.target.value, minutesToSet, secondsToSet);
                }}
                style={timeInputStyle}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.8rem", color: "#888" }}>Minutes</span>
              <input
                type="number"
                min="0"
                max="59"
                step="1"
                value={minutesToSet}
                onChange={(e) => {
                  setMinutesToSet(e.target.value);
                  updateDisabledAtFromDuration(daysToSet, hoursToSet, e.target.value, secondsToSet);
                }}
                style={timeInputStyle}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.8rem", color: "#888" }}>Seconds</span>
              <input
                type="number"
                min="0"
                max="59"
                step="1"
                value={secondsToSet}
                onChange={(e) => {
                  setSecondsToSet(e.target.value);
                  updateDisabledAtFromDuration(daysToSet, hoursToSet, minutesToSet, e.target.value);
                }}
                style={timeInputStyle}
              />
            </label>
          </div>
          <div style={{ fontSize: "0.85rem", color: "#888", marginTop: "4px" }}>
            Expires at: {_selectedGroup.disabled_at.toLocaleString()}
          </div>
        </div>

        {/* Rules Preview Section */}
        {!isNewGroup && _selectedGroup.rules && _selectedGroup.rules.length > 0 && (
          <div style={sectionContainerStyle}>
            <div style={sectionLabelStyle}>
              Rules in Group ({_selectedGroup.rules.length})
            </div>
            <div style={previewContainerStyle}>
              {previewRules.map((rule) => (
                <div key={rule.id} style={previewItemStyle}>
                  <strong>{rule.label}</strong>
                  {" → "}
                  {normalizeRegexSource(rule.rule_regex.source).substring(
                    0,
                    30,
                  )}
                  {normalizeRegexSource(rule.rule_regex.source).length > 30
                    ? "..."
                    : ""}
                </div>
              ))}
              {remainingRules > 0 && (
                <div style={{ ...previewItemStyle, color: "#888" }}>
                  ... and {remainingRules} more rule(s)
                </div>
              )}
            </div>
          </div>
        )}

        <Separator color="#333" />

        {/* Action Button */}
        <button
          style={submitButtonStyle}
          onClick={() => {
            setGroup(_selectedGroup);
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "#5500cc";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "#7700ff";
          }}
        >
          {isNewGroup ? "✓ Add Group" : "✓ Update Group"}
        </button>
      </div>
    </Card>
  );
}
