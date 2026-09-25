import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getInventory = query({
  args: {
    storeId: v.string(),
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("inventory")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .collect();
  },
});

export const updateInventory = mutation({
  args: {
    productId: v.id("products"),
    storeId: v.string(),
    quantity: v.number(),
  },

  handler: async (ctx, args) => {
    const existingInventory = await ctx.db
      .query("inventory")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .filter((q) => q.eq(q.field("storeId"), args.storeId))
      .first();

    if (existingInventory) {
      const newQuantity = existingInventory.quantity + args.quantity;

      await ctx.db.patch(existingInventory._id, {
        quantity: newQuantity,
        updatedAt: Date.now(),
      });

      return {
        inventoryId: existingInventory._id,
        previousQuantity: existingInventory.quantity,
        newQuantity,
      };
    }

    const inventoryId = await ctx.db.insert("inventory", {
      productId: args.productId,
      storeId: args.storeId,
      quantity: args.quantity,
      updatedAt: Date.now(),
    });

    return {
      inventoryId,
      previousQuantity: 0,
      newQuantity: args.quantity,
    };
  },
});