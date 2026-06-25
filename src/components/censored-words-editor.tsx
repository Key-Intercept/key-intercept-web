import { useEffect, useState } from "react";
import Card from "./card";

type CensoredWordItem = { id: bigint; word: string };

export default function CensoredWordsEditor({
  configId,
  initialReplacement,
  initialWords,
}: {
  configId: bigint;
  initialReplacement: string;
  initialWords: CensoredWordItem[];
}) {
  const [replacement, setReplacement] = useState(() => initialReplacement ?? "");
  const [words, setWords] = useState<CensoredWordItem[]>(() => [...initialWords]);
  const [newWord, setNewWord] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setReplacement(initialReplacement ?? "");
    setWords([...initialWords]);
  }, [initialReplacement, initialWords]);

  async function saveReplacement(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: configId.toString(), censored_replacement: replacement }),
      });
      if (!res.ok) {
        console.error("Failed to save replacement:", await res.text());
        await alert("Failed to save replacement word.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function addWord(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = newWord.trim();
    if (!trimmed) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/censored-words", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config_id: configId.toString(), word: trimmed }),
      });
      if (!res.ok) {
        console.error("Failed to add word:", await res.text());
        await alert("Failed to add word.");
        return;
      }

      // Optimistically append with temporary id
      setWords((prev) => [...prev, { id: BigInt(-1), word: trimmed }]);
      setNewWord("");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteWord(id: bigint) {
    if (!confirm("Delete this censored word?")) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/censored-words?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        console.error("Failed to delete word:", await res.text());
        await alert("Failed to delete word.");
        return;
      }
      setWords((prev) => prev.filter((w) => w.id !== id));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <Card title="Censored Replacement">
        <form onSubmit={saveReplacement} style={{ display: "grid", gap: "0.5rem" }}>
          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.9rem" }}>Replacement</span>
            <input value={replacement} onChange={(e) => setReplacement(e.target.value)} />
          </label>
          <button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save replacement"}</button>
        </form>
      </Card>

      <Card title="Censored Words">
        <form onSubmit={addWord} style={{ display: "grid", gap: "0.5rem" }}>
          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.9rem" }}>Add word</span>
            <input value={newWord} onChange={(e) => setNewWord(e.target.value)} />
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={(e) => addWord(e)} disabled={isSaving || !newWord.trim()}>Add</button>
          </div>
        </form>

        {words.length === 0 ? (
          <p>No censored words found.</p>
        ) : (
          <ul>
            {words.map((w) => (
              <li key={String(w.id)} style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
                <span>{w.word}</span>
                <button onClick={() => deleteWord(w.id)} disabled={isSaving}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
