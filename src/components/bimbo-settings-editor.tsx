import { useEffect, useState } from "react";
import Card from "./card";

export default function BimboSettingsEditor({
  configId,
  initialBimboWordLength,
}: {
  configId: bigint;
  initialBimboWordLength: number;
}) {
  const [length, setLength] = useState(() => String(initialBimboWordLength ?? 0));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLength(String(initialBimboWordLength ?? 0));
  }, [initialBimboWordLength]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const parsed = Number(length);
    if (!Number.isFinite(parsed) || parsed < 0) {
      await alert("Enter a non-negative number for bimbo word length.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: configId.toString(), bimbo_word_length: parsed }),
      });

      if (!res.ok) {
        console.error("Failed to save bimbo settings:", await res.text());
        await alert("An error occurred while saving. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card title="Bimbo Settings">
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem" }}>
        <label style={{ display: "grid", gap: "0.35rem" }}>
          <span style={{ fontSize: "0.9rem" }}>Bimbo word length</span>
          <input
            type="number"
            min="0"
            step="1"
            value={length}
            onChange={(e) => setLength(e.target.value)}
          />
        </label>

        <button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save bimbo settings"}
        </button>
      </form>
    </Card>
  );
}
