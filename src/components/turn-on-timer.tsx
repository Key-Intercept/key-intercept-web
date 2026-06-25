import { useEffect, useMemo, useState } from "react";
import type { Config } from "../script/types";
import Card from "./card";
import "../style/turn-on-timer.css";

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
  const remainingText = useMemo(
    () => formatRemainingTime(remainingMs),
    [remainingMs],
  );
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

    if (!isPermanent && totalDurationMs < 0) {
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
        await alert(
          "An error occurred while updating the end time. Please try again.",
        );
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
      <div className="turn-on-timer">
        <div className="tot-header">
          <div className="tot-label">Time remaining</div>
          <div className="tot-remaining">
            {isPermanent ? "Permanent" : isExpired ? "00:00:00" : remainingText}
          </div>
        </div>

        <div className="tot-current-end">
          Current end: {isPermanent ? "Permanent" : endAt.toLocaleString()}
        </div>

        <form onSubmit={setEndTime} className="tot-form">
          <div className="tot-fields">
            <label className="tot-field">
              <span className="tot-field-label">Days</span>
              <input
                className="tot-input"
                type="number"
                min="0"
                step="1"
                value={daysToSet}
                onChange={(event) => setDaysToSet(event.target.value)}
                disabled={isPermanent}
              />
            </label>

            <label className="tot-field">
              <span className="tot-field-label">Hours</span>
              <input
                className="tot-input"
                type="number"
                min="0"
                step="1"
                value={hoursToSet}
                onChange={(event) => setHoursToSet(event.target.value)}
                disabled={isPermanent}
              />
            </label>

            <label className="tot-field">
              <span className="tot-field-label">Minutes</span>
              <input
                className="tot-input"
                type="number"
                min="0"
                step="1"
                value={minutesToSet}
                onChange={(event) => setMinutesToSet(event.target.value)}
                disabled={isPermanent}
              />
            </label>

            <label className="tot-field">
              <span className="tot-field-label">Seconds</span>
              <input
                className="tot-input"
                type="number"
                min="0"
                step="1"
                value={secondsToSet}
                onChange={(event) => setSecondsToSet(event.target.value)}
                disabled={isPermanent}
              />
            </label>
          </div>

          <label className="tot-checkbox">
            <input
              type="checkbox"
              checked={isPermanent}
              onChange={(event) => setIsPermanent(event.target.checked)}
            />
            <span className="tot-checkbox-label">Turn on permanently</span>
          </label>

          <button type="submit" className="tot-button" disabled={isSaving}>
            {isSaving ? "Saving..." : isPermanent ? "Set permanent" : "Set end time"}
          </button>
        </form>
      </div>
    </Card>
  );
}
