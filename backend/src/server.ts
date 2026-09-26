import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import productsRouter from "./routes/products.js";
dotenv.config({ path: ".env.local" });

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use("/api/products", productsRouter);
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "inventory-backend",
  });
});

app.listen(PORT, () => {
  console.log(`inventory-backend listening on port ${PORT}`);
});
