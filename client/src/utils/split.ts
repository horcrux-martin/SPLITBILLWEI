import { formatRp } from "./currency";
import type { BillState, BillResult, TransferLine } from "./types";

const FUN = [
  "🫂 Persahabatan selamat.",
  "🍗 Ayam geprek terbayar.",
  "🍻 Round 2 aman.",
  "💸 Dompet tidak berselisih."
];

export function calcBill(state: BillState): BillResult {
  const { friends, payer, mode, items } = state;
  const total = items.reduce((a, it) => a + (it.price || 0), 0);

  const subtotals: Record<string, number> = {};
  friends.forEach((f) => (subtotals[f] = 0));

  if (mode === "equal") {
    const share = friends.length ? total / friends.length : 0;
    friends.forEach((f) => {
      if (f !== payer) subtotals[f] = share;
    });
  } else {
    for (const it of items) {
      const price = it.price || 0;
      const assigned =
        it.assignedTo && it.assignedTo.length > 0 ? it.assignedTo : friends; // never-block
      const share = assigned.length ? price / assigned.length : 0;
      assigned.forEach((f) => {
        subtotals[f] = (subtotals[f] || 0) + share;
      });
    }
  }

  const transfers: TransferLine[] = [];
  friends.forEach((f) => {
    if (f === payer) return;
    const amt = Math.round(subtotals[f] || 0);
    if (amt > 0) transfers.push({ from: f, to: payer, amount: amt });
  });

  const funMessage = FUN[Math.floor(Math.random() * FUN.length)] || FUN[0];
  const lines = [
    "Split Bill Result 🍻",
    ...transfers.map((t) => `${t.from} transfer ${formatRp(t.amount)} ke ${t.to}`)
  ];
  const copyText = lines.join("\n");

  return { transfers, total: Math.round(total), funMessage, copyText };
}
