const vision = require("@google-cloud/vision");
const client = new vision.ImageAnnotatorClient();

function stripDataUrl(base64) {
  return base64.replace(/^data:image\/\w+;base64,/, "");
}

async function detectText(imageBase64) {
  const content = stripDataUrl(imageBase64);
  const [result] = await client.textDetection({ image: { content } });

  const annotations = result.textAnnotations || [];
  const rawText = annotations.length ? annotations[0].description : "";
  if (!rawText) throw new Error("No text detected");
  return rawText;
}

module.exports = { detectText };
