export function formatRp(n: number): string {
  const isNeg = n < 0;
  const x = Math.abs(Math.round(n));
  const s = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${isNeg ? "-" : ""}Rp ${s}`;
}

export function parseNumberLoose(input: string): number {
  const cleaned = input.replace(/[^\d]/g, "");
  const n = Number(cleaned || "0");
  return Number.isFinite(n) ? n : 0;
}
