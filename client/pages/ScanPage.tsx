import { useState } from "react";
import { fileToResizedBase64 } from "../utils/image";
import type { ScanResult } from "../utils/types";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function ScanPage({ onDone }: { onDone: (res: ScanResult) => void }) {
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function onPickFile(file?: File) {
    setErrorMsg("");
    if (!file) return;
    const base64 = await fileToResizedBase64(file, 1200, 0.7);
    setPreview(base64);
  }

  async function process() {
    if (!preview) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const r = await fetch(`${API_BASE}/scan-receipt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: preview })
      });
      const data: ScanResult = await r.json();
      onDone(data);
    } catch {
      const msg = "Struk kurang jelas. Coba foto ulang ya 📸";
      setErrorMsg(msg);
      onDone({ items: [], detectedTotal: null, rawText: "", confidence: "low", errorMessage: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>SPLIT BILL-IN PLS</h1>
        <p className="tagline">Split bill tanpa drama.</p>

        <label className="btn">
          Ambil Foto / Pilih Foto
          <input
            type="file"
            accept="image/*"
            capture="environment"
            hidden
            onChange={(e) => onPickFile(e.target.files?.[0])}
          />
        </label>

        {preview && (
          <div className="preview">
            <img src={preview} alt="preview" />
          </div>
        )}

        {errorMsg && <div className="alert">{errorMsg}</div>}

        <button className="btn primary big" disabled={!preview || loading} onClick={process}>
          {loading ? "Proses... 👀" : "Proses"}
        </button>
      </div>
    </div>
  );
}
