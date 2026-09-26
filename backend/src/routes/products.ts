import { Router } from "express";
import { convexClient } from "../services/convex.js";
import { api } from "../../convex/_generated/api.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const products = await convexClient.query(
        api.products.listProducts,
        {}
      );

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
});

export default router;