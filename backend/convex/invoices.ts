import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createInvoice = mutation({
  args: {
    supplier: v.string(),
    invoiceNumber: v.string(),
    invoiceDate: v.string(),
    fileUrl: v.optional(v.string()),
    status: v.string(),
  },

  handler: async (ctx, args) => {
    const existingInvoice = await ctx.db
      .query("invoices")
      .withIndex("by_invoice_number", (q) =>
        q.eq("invoiceNumber", args.invoiceNumber)
      )
      .first();

    if (existingInvoice) {
      throw new Error("Invoice with this number already exists");
    }

    return await ctx.db.insert("invoices", {
      supplier: args.supplier,
      invoiceNumber: args.invoiceNumber,
      invoiceDate: args.invoiceDate,
      fileUrl: args.fileUrl,
      status: args.status,
      createdAt: Date.now(),
    });
  },
});
export const getInvoice = query({
    args: {
      id: v.id("invoices"),
    },
  
    handler: async (ctx, args) => {
      return await ctx.db.get(args.id);
    },
  });
  export const addInvoiceItem = mutation({
    args: {
      invoiceId: v.id("invoices"),
      rawName: v.string(),
      quantity: v.number(),
      unitPrice: v.optional(v.number()),
      matchedProductId: v.optional(v.id("products")),
      confidence: v.optional(v.number()),
      status: v.string(),
    },
  
    handler: async (ctx, args) => {
      const invoice = await ctx.db.get(args.invoiceId);
  
      if (!invoice) {
        throw new Error("Invoice not found");
      }
  
      return await ctx.db.insert("invoiceItems", {
        invoiceId: args.invoiceId,
        rawName: args.rawName,
        quantity: args.quantity,
        unitPrice: args.unitPrice,
        matchedProductId: args.matchedProductId,
        confidence: args.confidence,
        status: args.status,
      });
    },
  });
  export const getInvoiceItems = query({
    args: {
      invoiceId: v.id("invoices"),
    },
  
    handler: async (ctx, args) => {
      return await ctx.db
        .query("invoiceItems")
        .withIndex("by_invoice", (q) =>
          q.eq("invoiceId", args.invoiceId)
        )
        .collect();
    },
  });