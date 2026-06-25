import { useEffect, useState } from "react";
import Card from "./card";

type PetTypeOption = {
  id: string;
  label: string;
};

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, value));
}

function formatAmount(value: number) {
  return String(clampPercent(Math.round(value * 100)));
}

export default function PetSettingsEditor({
  configId,
  initialPetTypeId,
  initialPetAmount,
  petTypes,
}: {
  configId: bigint;
  initialPetTypeId: bigint | null;
  initialPetAmount: number;
  petTypes: PetTypeOption[];
}) {
  const [petTypeId, setPetTypeId] = useState(
    () => initialPetTypeId?.toString() ?? "",
  );
  const [petAmount, setPetAmount] = useState(() =>
    formatAmount(initialPetAmount),
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setPetTypeId(initialPetTypeId?.toString() ?? "");
    setPetAmount(formatAmount(initialPetAmount));
  }, [initialPetAmount, initialPetTypeId]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedAmount = Number(petAmount);
    if (
      !Number.isFinite(parsedAmount) ||
      parsedAmount < 0 ||
      parsedAmount > 100
    ) {
      await alert("Enter a pet amount between 0 and 100.");
      return;
    }

    if (!petTypeId) {
      await alert("Select a pet type before saving.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: configId.toString(),
          pet_type: petTypeId,
          pet_amount: parsedAmount / 100,
        }),
      });

      if (!response.ok) {
        console.error("Error updating pet settings:", await response.text());
        await alert(
          "An error occurred while updating the pet settings. Please try again.",
        );
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card title="Pet Settings">
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        <label style={{ display: "grid", gap: "0.35rem" }}>
          <span style={{ fontSize: "0.9rem" }}>Pet type</span>
          <select
            value={petTypeId}
            onChange={(event) => setPetTypeId(event.target.value)}
            disabled={petTypes.length === 0}
          >
            <option value="">Select a pet type</option>
            {petTypes.map((petType) => (
              <option key={petType.id} value={petType.id}>
                {petType.label}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "grid", gap: "0.35rem" }}>
          <span style={{ fontSize: "0.9rem" }}>Pet amount</span>
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            value={petAmount}
            onChange={(event) => setPetAmount(event.target.value)}
          />
        </label>

        <button type="submit" disabled={isSaving || petTypes.length === 0}>
          {isSaving ? "Saving..." : "Save pet settings"}
        </button>
      </form>
    </Card>
  );
}

