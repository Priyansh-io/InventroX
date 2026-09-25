import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    name: v.string(),
    sku: v.string(),
    brand: v.optional(v.string()),
    category: v.optional(v.string()),
    barcode: v.optional(v.string()),
    price: v.optional(v.number()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  })
    .index("by_sku", ["sku"])
    .index("by_barcode", ["barcode"]),

  inventory: defineTable({
    productId: v.id("products"),
    quantity: v.number(),
    storeId: v.string(),
    updatedAt: v.number(),
  })
    .index("by_product", ["productId"])
    .index("by_store", ["storeId"]),

  invoices: defineTable({
    supplier: v.string(),
    invoiceNumber: v.string(),
    invoiceDate: v.string(),
    fileUrl: v.optional(v.string()),
    status: v.string(),
    createdAt: v.number(),
  })
    .index("by_invoice_number", ["invoiceNumber"]),

  invoiceItems: defineTable({
    invoiceId: v.id("invoices"),
    rawName: v.string(),
    quantity: v.number(),
    unitPrice: v.optional(v.number()),
    matchedProductId: v.optional(v.id("products")),
    confidence: v.optional(v.number()),
    status: v.string(),
  })
    .index("by_invoice", ["invoiceId"])
    .index("by_product", ["matchedProductId"]),
});