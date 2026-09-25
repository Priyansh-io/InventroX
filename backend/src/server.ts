import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "inventory-backend",
  });
});

app.listen(PORT, () => {
  console.log(`inventory-backend listening on port ${PORT}`);
});
