require("dotenv").config();
const express = require("express");
const cors = require("cors");
const scanReceiptRoute = require("./routes/scanReceipt.route");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", (_, res) => res.send("OK - Split Bill-In PLS API"));

app.use("/", scanReceiptRoute);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
