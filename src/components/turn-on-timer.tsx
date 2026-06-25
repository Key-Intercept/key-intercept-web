import { useEffect, useMemo, useState } from "react";
import type { Config } from "../script/types";
import Card from "./card";

const MAX_END_AT = new Date("9999-12-31T23:59:59.999Z");

function formatRemainingTime(remainingMs: number) {
  const clampedMs = Math.max(0, remainingMs);
  const totalSeconds = Math.floor(clampedMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => value.toString().padStart(2, "0"))
    .join(":");
}

type EndFieldKey = {
  [K in keyof Config]: Config[K] extends Date ? K : never;
}[keyof Config];

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function isMaxEnd(endAt: Date) {
  return endAt.getTime() >= MAX_END_AT.getTime();
}

export default function TurnOnTimer({
  title,
  configId,
  endField,
  initialEnd,
}: {
  title: string;
  configId: bigint;
  endField: EndFieldKey;
  initialEnd: string;
}) {
  const [endAt, setEndAt] = useState(() => new Date(initialEnd));
  const [now, setNow] = useState(() => Date.now());
  const [daysToSet, setDaysToSet] = useState("0");
  const [hoursToSet, setHoursToSet] = useState("0");
  const [minutesToSet, setMinutesToSet] = useState("15");
  const [secondsToSet, setSecondsToSet] = useState("0");
  const [isPermanent, setIsPermanent] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const nextEndAt = new Date(initialEnd);
    setEndAt(nextEndAt);
    setIsPermanent(isMaxEnd(nextEndAt));
  }, [initialEnd]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const remainingMs = endAt.getTime() - now;
  const remainingText = useMemo(() => formatRemainingTime(remainingMs), [remainingMs]);
  const isExpired = remainingMs <= 0 && !isPermanent;
  const totalDurationMs =
    toNumber(daysToSet) * 24 * 60 * 60 * 1000 +
    toNumber(hoursToSet) * 60 * 60 * 1000 +
    toNumber(minutesToSet) * 60 * 1000 +
    toNumber(secondsToSet) * 1000;

  async function setEndTime(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const updatedEndAt = isPermanent
      ? MAX_END_AT
      : new Date(Date.now() + totalDurationMs);

    if (!isPermanent && totalDurationMs <= 0) {
      await alert("Enter a positive duration to set the end time.");
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: configId.toString(),
          [endField]: updatedEndAt.toISOString(),
        }),
      });

      if (!res.ok) {
        console.error("Error updating config end field:", await res.text());
        await alert("An error occurred while updating the end time. Please try again.");
        return;
      }

      setEndAt(updatedEndAt);
      setIsPermanent(isMaxEnd(updatedEndAt));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card title={title}>
      <div style={{ display: "grid", gap: "0.75rem" }}>
        <div>
          <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>Time remaining</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
            {isPermanent ? "Permanent" : isExpired ? "00:00:00" : remainingText}
          </div>
        </div>

        <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
          Current end: {isPermanent ? "Permanent" : endAt.toLocaleString()}
        </div>

        <form onSubmit={setEndTime} style={{ display: "grid", gap: "0.75rem" }}>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <label style={{ display: "grid", gap: "0.35rem" }}>
              <span style={{ fontSize: "0.9rem" }}>Days</span>
              <input
                type="number"
                min="0"
                step="1"
                value={daysToSet}
                onChange={(event) => setDaysToSet(event.target.value)}
                disabled={isPermanent}
                style={{ minWidth: "7rem" }}
              />
            </label>

            <label style={{ display: "grid", gap: "0.35rem" }}>
              <span style={{ fontSize: "0.9rem" }}>Hours</span>
              <input
                type="number"
                min="0"
                step="1"
                value={hoursToSet}
                onChange={(event) => setHoursToSet(event.target.value)}
                disabled={isPermanent}
                style={{ minWidth: "7rem" }}
              />
            </label>

            <label style={{ display: "grid", gap: "0.35rem" }}>
              <span style={{ fontSize: "0.9rem" }}>Minutes</span>
              <input
                type="number"
                min="0"
                step="1"
                value={minutesToSet}
                onChange={(event) => setMinutesToSet(event.target.value)}
                disabled={isPermanent}
                style={{ minWidth: "7rem" }}
              />
            </label>

            <label style={{ display: "grid", gap: "0.35rem" }}>
              <span style={{ fontSize: "0.9rem" }}>Seconds</span>
              <input
                type="number"
                min="0"
                step="1"
                value={secondsToSet}
                onChange={(event) => setSecondsToSet(event.target.value)}
                disabled={isPermanent}
                style={{ minWidth: "7rem" }}
              />
            </label>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              checked={isPermanent}
              onChange={(event) => setIsPermanent(event.target.checked)}
            />
            <span style={{ fontSize: "0.95rem" }}>Turn on permanently</span>
          </label>

          <button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : isPermanent ? "Set permanent" : "Set end time"}
          </button>
        </form>
      </div>
    </Card>
  );
}
