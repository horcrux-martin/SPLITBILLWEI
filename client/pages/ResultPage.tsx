import { useState } from "react";
import type { BillResult, BillState } from "../utils/types";
import { formatRp } from "../utils/currency";

export default function ResultPage({
  billState,
  billResult,
  onRestart
}: {
  billState: BillState | null;
  billResult: BillResult | null;
  onRestart: () => void;
}) {
  const [open, setOpen] = useState(false);
  if (!billState || !billResult) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(billResult.copyText);
      alert("Copied!");
    } catch {
      alert("Gagal copy. Coba manual ya 😅");
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Hasil</h2>
        <div className="fun">{billResult.funMessage}</div>

        <div className="section">
          {billResult.transfers.length === 0 ? (
            <div className="muted">Gak ada transfer. Aman 🤝</div>
          ) : (
            billResult.transfers.map((t, i) => (
              <div key={i} className="line">
                <b>{t.from}</b> → {formatRp(t.amount)} ke <b>{t.to}</b>
              </div>
            ))
          )}
        </div>

        <button className="btn primary big" onClick={copy}>
          Copy Hasil 📋
        </button>

        <div className="donate">
          <h3>☕ Bayarin kopi dev-nya dong</h3>
          <p>
            Kalau app ini nyelametin tongkrongan lo dari drama,
            <br />
            traktir kopi boleh lah 😌
            <br />
            Skip juga gapapa.
          </p>
          <button className="btn" onClick={() => setOpen(true)}>
            Traktir Kopi
          </button>
        </div>

        <button className="btn" onClick={onRestart}>
          Restart
        </button>
      </div>

      {open && (
        <div className="modalOverlay" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Support Project</h3>
            <img src="/qris-placeholder.png" alt="qris" className="qris" />
            <p>Scan QRIS ini untuk support project ini.</p>
            <button className="btn primary" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
