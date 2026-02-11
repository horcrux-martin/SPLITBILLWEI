const express = require("express");
const { detectText } = require("../services/vision.service");
const { parseReceiptText } = require("../services/parseReceipt.service");

const router = express.Router();

router.post("/scan-receipt", async (req, res) => {
  try {
    const { imageBase64 } = req.body || {};
    if (!imageBase64) {
      return res.json({
        items: [],
        detectedTotal: null,
        rawText: "",
        confidence: "low",
        errorMessage: "Struk kurang jelas. Coba foto ulang ya 📸"
      });
    }

    const rawText = await detectText(imageBase64);
    const parsed = parseReceiptText(rawText);

    return res.json({
      items: parsed.items,
      detectedTotal: parsed.detectedTotal,
      rawText,
      confidence: parsed.confidence
    });
  } catch (e) {
    return res.json({
      items: [],
      detectedTotal: null,
      rawText: "",
      confidence: "low",
      errorMessage: "Struk kurang jelas. Coba foto ulang ya 📸"
    });
  }
});

module.exports = router;
