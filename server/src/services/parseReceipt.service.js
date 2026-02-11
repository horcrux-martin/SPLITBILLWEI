function isDateLine(line) {
  return /\b\d{1,2}[/-]\d{1,2}([/-]\d{2,4})?\b/.test(line);
}
function isPhoneLike(line) {
  return /(\+62|62|0)\d{8,13}/.test(line.replace(/\s+/g, ""));
}
function hasLongId(line) {
  return /\b\d{10,}\b/.test(line);
}

function extractNumbers(line) {
  const matches = line.match(/\b\d{1,3}([.,]\d{3})+\b|\b\d{4,7}\b/g);
  if (!matches) return [];
  return matches
    .map((m) => Number(m.replace(/[.,]/g, "")))
    .filter((n) => Number.isFinite(n))
    .filter((n) => n >= 500 && n <= 50000000);
}

function cleanName(line, priceToken) {
  return line.replace(priceToken, "").replace(/\s{2,}/g, " ").trim();
}

function parseReceiptText(rawText) {
  const lines = (rawText || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const items = [];
  const allNums = [];

  for (const line of lines) {
    if (isDateLine(line)) continue;
    if (isPhoneLike(line)) continue;
    if (hasLongId(line)) continue;

    const nums = extractNumbers(line);
    if (nums.length === 0) continue;

    const price = nums[nums.length - 1];
    allNums.push(...nums);

    const tokenMatch = line.match(/\b\d{1,3}([.,]\d{3})+\b|\b\d{4,7}\b/g);
    const priceToken = tokenMatch ? tokenMatch[tokenMatch.length - 1] : String(price);

    const name = cleanName(line, priceToken);
    if (!name || name.length < 2) continue;

    items.push({ name, price });
  }

  let detectedTotal = null;
  const totalLine = lines.find((l) => /total|jumlah|grand/i.test(l));
  if (totalLine) {
    const nums = extractNumbers(totalLine);
    if (nums.length) detectedTotal = nums[nums.length - 1];
  }
  if (!detectedTotal && allNums.length) {
    detectedTotal = allNums.slice().sort((a, b) => a - b)[allNums.length - 1] || null;
  }

  let confidence = "low";
  if (items.length >= 2 && detectedTotal) confidence = "high";
  else if (items.length >= 1) confidence = "medium";

  return { items, detectedTotal, confidence };
}

module.exports = { parseReceiptText };
