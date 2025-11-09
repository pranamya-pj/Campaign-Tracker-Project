const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000; // ✅ change this for Render

app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "frontend")));

const FILE = "./campaigns.json";
function readData() {
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]");
  return JSON.parse(fs.readFileSync(FILE));
}

// APIs
app.get("/campaigns", (req, res) => res.json(readData()));
app.post("/campaigns", (req, res) => {
  const campaigns = readData();
  const newC = { id: Date.now().toString(), ...req.body };
  campaigns.push(newC);
  fs.writeFileSync(FILE, JSON.stringify(campaigns, null, 2));
  res.json(newC);
});
app.put("/campaigns/:id", (req, res) => {
  let campaigns = readData().map(c => c.id === req.params.id ? {...c, ...req.body} : c);
  fs.writeFileSync(FILE, JSON.stringify(campaigns, null, 2));
  res.json({ success: true });
});
app.delete("/campaigns/:id", (req, res) => {
  let campaigns = readData().filter(c => c.id !== req.params.id);
  fs.writeFileSync(FILE, JSON.stringify(campaigns, null, 2));
  res.json({ success: true });
});

// Default route to serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
