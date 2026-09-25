import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createProduct = mutation({
  args: {
    name: v.string(),
    sku: v.string(),
    brand: v.optional(v.string()),
    category: v.optional(v.string()),
    barcode: v.optional(v.string()),
    price: v.optional(v.number()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const existingProduct = await ctx.db
      .query("products")
      .withIndex("by_sku", (q) => q.eq("sku", args.sku))
      .first();

    if (existingProduct) {
      throw new Error("Product with this SKU already exists");
    }

    return await ctx.db.insert("products", args);
  },
});

export const getProduct = query({
  args: {
    id: v.id("products"),
  },

  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const searchProducts = query({
  args: {
    sku: v.optional(v.string()),
    barcode: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    if (args.sku !== undefined) {
      const sku = args.sku;

      return await ctx.db
        .query("products")
        .withIndex("by_sku", (q) => q.eq("sku", sku))
        .collect();
    }

    if (args.barcode !== undefined) {
      const barcode = args.barcode;

      return await ctx.db
        .query("products")
        .withIndex("by_barcode", (q) => q.eq("barcode", barcode))
        .collect();
    }

    return [];
  },
});