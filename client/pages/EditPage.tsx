import { useEffect, useMemo, useState } from "react";
import type { BillState, BillResult, Item, ScanResult } from "../utils/types";
import { calcBill } from "../utils/split";
import { formatRp, parseNumberLoose } from "../utils/currency";

export default function EditPage({
  scanResult,
  onBack,
  onDone
}: {
  scanResult: ScanResult | null;
  onBack: () => void;
  onDone: (state: BillState, result: BillResult) => void;
}) {
  const [friends, setFriends] = useState<string[]>(["Ali", "Budi", "Reja"]);
  const [payer, setPayer] = useState("Reja");
  const [mode, setMode] = useState<"assign" | "equal">("assign");
  const [newFriend, setNewFriend] = useState("");

  const [items, setItems] = useState<Item[]>(
    scanResult?.items?.length ? scanResult.items.map((i) => ({ ...i, assignedTo: [] })) : []
  );

  useEffect(() => {
    if (!friends.includes(payer)) setPayer(friends[0] || "");
  }, [friends, payer]);

  const total = useMemo(() => items.reduce((a, it) => a + (it.price || 0), 0), [items]);

  function addFriend() {
    const n = newFriend.trim();
    if (!n || friends.includes(n)) return;
    setFriends((x) => [...x, n]);
    setNewFriend("");
  }

  function removeFriend(name: string) {
    setFriends((x) => x.filter((f) => f !== name));
    setItems((x) =>
      x.map((it) => ({ ...it, assignedTo: (it.assignedTo || []).filter((a) => a !== name) }))
    );
  }

  function addItem() {
    setItems((x) => [...x, { name: "", price: 0, assignedTo: [] }]);
  }

  function deleteItem(idx: number) {
    setItems((x) => x.filter((_, i) => i !== idx));
  }

  function toggleAssign(idx: number, friend: string) {
    setItems((x) =>
      x.map((it, i) => {
        if (i !== idx) return it;
        const set = new Set(it.assignedTo || []);
        if (set.has(friend)) set.delete(friend);
        else set.add(friend);
        return { ...it, assignedTo: Array.from(set) };
      })
    );
  }

  function hitung() {
    const state: BillState = { friends, payer, mode, items };
    const result: BillResult = calcBill(state);
    onDone(state, result);
  }

  return (
    <div className="container">
      <div className="card">
        <button className="btn" onClick={onBack}>
          ← Back
        </button>

        <h2>Edit & Assign</h2>

        <div className="section">
          <div className="label">Teman</div>
          <div className="chips">
            {friends.map((f) => (
              <span key={f} className="chip">
                {f}
                <button className="chipX" onClick={() => removeFriend(f)}>
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="row">
            <input
              className="input"
              placeholder="Tambah nama teman"
              value={newFriend}
              onChange={(e) => setNewFriend(e.target.value)}
            />
            <button className="btn primary" onClick={addFriend}>
              Tambah
            </button>
          </div>
        </div>

        <div className="section">
          <div className="row">
            <div>
              <div className="label">Mode</div>
              <label className="radio">
                <input type="radio" checked={mode === "assign"} onChange={() => setMode("assign")} />
                Assign per item
              </label>
              <label className="radio">
                <input type="radio" checked={mode === "equal"} onChange={() => setMode("equal")} />
                Split equally
              </label>
            </div>

            <div style={{ flex: 1 }} />

            <div>
              <div className="label">Payer</div>
              <select className="input" value={payer} onChange={(e) => setPayer(e.target.value)}>
                {friends.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="row">
            <div className="label">Items</div>
            <div style={{ flex: 1 }} />
            <button className="btn primary" onClick={addItem}>
              + Add Item
            </button>
          </div>

          <div className="table">
            {items.length === 0 && <div className="muted">Belum ada item. Tambah manual aja ✍️</div>}

            {items.map((it, idx) => (
              <div key={idx} className="tableRow">
                <input
                  className="input"
                  placeholder="Item"
                  value={it.name}
                  onChange={(e) =>
                    setItems((x) => x.map((v, i) => (i === idx ? { ...v, name: e.target.value } : v)))
                  }
                />
                <input
                  className="input"
                  placeholder="Price"
                  inputMode="numeric"
                  value={it.price ? String(it.price) : ""}
                  onChange={(e) =>
                    setItems((x) =>
                      x.map((v, i) =>
                        i === idx ? { ...v, price: parseNumberLoose(e.target.value) } : v
                      )
                    )
                  }
                />

                {mode === "assign" && (
                  <div className="assignBox">
                    {friends.map((f) => {
                      const active = (it.assignedTo || []).includes(f);
                      return (
                        <button
                          key={f}
                          className={`chipBtn ${active ? "active" : ""}`}
                          onClick={() => toggleAssign(idx, f)}
                        >
                          {f}
                        </button>
                      );
                    })}
                    <div className="mutedSmall">(Kalau kosong, otomatis dibagi semua)</div>
                  </div>
                )}

                <button className="btn danger" onClick={() => deleteItem(idx)}>
                  Del
                </button>
              </div>
            ))}
          </div>

          <div className="muted" style={{ marginTop: 10 }}>
            Total items: {formatRp(total)}
          </div>

          <button className="btn primary big" onClick={hitung}>
            Hitung 💸
          </button>

          {scanResult?.rawText && (
            <details className="details">
              <summary>Lihat teks struk</summary>
              <pre className="raw">{scanResult.rawText}</pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
