import { useMemo, useState } from "react";
import Card from "./card";
import type { DroneConfig } from "../script/types";
import TurnOnTimer from "./turn-on-timer";

type DroneFieldKey =
  | "speech_header"
  | "speech_footer"
  | "action_header"
  | "action_footer"
  | "whisper_header"
  | "whisper_footer"
  | "loud_header"
  | "loud_footer"
  | "drone_term";

type DroneConfigState = DroneConfig;

const fieldLabels: Array<{ key: DroneFieldKey; label: string }> = [
  { key: "speech_header", label: "Speech Header" },
  { key: "speech_footer", label: "Speech Footer" },
  { key: "action_header", label: "Action Header" },
  { key: "action_footer", label: "Action Footer" },
  { key: "whisper_header", label: "Whisper Header" },
  { key: "whisper_footer", label: "Whisper Footer" },
  { key: "loud_header", label: "Loud Header" },
  { key: "loud_footer", label: "Loud Footer" },
  { key: "drone_term", label: "Drone Term" },
];

function clampHealth(value: number) {
  return Math.max(0, Math.min(100, value));
}

function randomDelta() {
  return Math.ceil(15 * Math.random());
}

export default function DronePageContainer({
  initialDroneConfig,
  initialDroneEnd,
}: {
  initialDroneConfig: DroneConfig;
  initialDroneEnd: string;
}) {
  const [droneConfig, setDroneConfig] =
    useState<DroneConfigState>(initialDroneConfig);
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges = () => {
    return fieldLabels.some(
      ({ key }) => droneConfig[key] !== initialDroneConfig[key],
    );
  };

  const healthLabel = useMemo(
    () => `${droneConfig.drone_health} / 100`,
    [droneConfig.drone_health],
  );

  async function persistDroneConfig(nextConfig: DroneConfigState) {
    const payload = {
      ...nextConfig,
      config_id: nextConfig.config_id.toString(),
    };

    const res = await fetch("/api/drone", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }
  }

  async function adjustHealth(direction: "damage" | "heal") {
    const delta = randomDelta();
    const previousConfig = droneConfig;
    const nextHealth =
      direction === "damage"
        ? clampHealth(droneConfig.drone_health - delta)
        : clampHealth(droneConfig.drone_health + delta);

    const nextConfig = { ...droneConfig, drone_health: nextHealth };
    setDroneConfig(nextConfig);

    try {
      await persistDroneConfig(nextConfig);
    } catch (error) {
      console.error(`Error applying ${direction}:`, error);
      alert(`Failed to ${direction} the drone. Please try again.`);
      setDroneConfig(previousConfig);
    }
  }

  async function applyChanges() {
    const previousConfig = droneConfig;
    setIsSaving(true);

    try {
      await persistDroneConfig(droneConfig);
    } catch (error) {
      console.error("Error applying changes:", error);
      alert("Failed to apply changes. Please try again.");
      setDroneConfig(previousConfig);
    } finally {
      setIsSaving(false);
    }
  }

  const wrapperStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    width: "100%",
  };

  const cardContentStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    width: "100%",
  };

  const buttonRowStyle: React.CSSProperties = {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  };

  const healthValueStyle: React.CSSProperties = {
    fontSize: "clamp(2rem, 6vw, 3rem)",
    fontFamily: "Jersey 10, sans-serif",
    margin: 0,
    textAlign: "center",
  };

  const buttonStyle: React.CSSProperties = {
    border: "none",
    borderRadius: "999px",
    padding: "0.85rem 1.5rem",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
    color: "#fff",
    minWidth: "120px",
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1rem",
    width: "100%",
  };

  const fieldStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 0.9rem",
    borderRadius: "12px",
    border: "1px solid #444",
    background: "#121212",
    color: "#eee",
    fontSize: "1rem",
  };

  return (
    <div style={wrapperStyle}>
      <TurnOnTimer
        title={"Drone Ends After"}
        configId={droneConfig.config_id}
        endField={"drone_end"}
        initialEnd={initialDroneEnd}
      />

      <Card title="Drone Health">
        <div style={cardContentStyle}>
          <p style={healthValueStyle}>{healthLabel}</p>
          <div style={buttonRowStyle}>
            <button
              type="button"
              style={{ ...buttonStyle, backgroundColor: "#c62828" }}
              onClick={() => adjustHealth("damage")}
            >
              damage
            </button>
            <button
              type="button"
              style={{ ...buttonStyle, backgroundColor: "#2e7d32" }}
              onClick={() => adjustHealth("heal")}
            >
              heal
            </button>
          </div>
        </div>
      </Card>

      <Card title="Drone Headers and Footers">
        <div style={cardContentStyle}>
          <div style={gridStyle}>
            {fieldLabels.map(({ key, label }) => (
              <div key={key} style={fieldStyle}>
                <label htmlFor={key}>{label}</label>
                <input
                  id={key}
                  style={inputStyle}
                  value={droneConfig[key]}
                  onChange={(event) =>
                    setDroneConfig((current) => ({
                      ...current,
                      [key]: event.target.value,
                    }))
                  }
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            style={{
              ...buttonStyle,
              backgroundColor: hasChanges() ? "#400bba" : "#333",
              cursor: hasChanges() ? "pointer" : "not-allowed",
              opacity: hasChanges() ? 1 : 0.5,
              width: "100%",
              marginTop: "1rem",
            }}
            onClick={() => void applyChanges()}
            disabled={!hasChanges() || isSaving}
          >
            {isSaving ? "Applying..." : "Apply Changes"}
          </button>
        </div>
      </Card>
    </div>
  );
}
