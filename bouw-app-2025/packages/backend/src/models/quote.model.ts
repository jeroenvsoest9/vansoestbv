import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: {
        street: String,
        city: String,
        postalCode: String,
      },
    },
    projectType: {
      type: String,
      enum: ["renovatie", "aanbouw", "opbouw", "verbouwing"],
      required: true,
    },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
    estimatedCost: { type: Number, required: true },
    estimatedDuration: { type: Number, required: true }, // in days
    attachments: [
      {
        name: String,
        url: String,
        type: String,
      },
    ],
    notes: [
      {
        text: String,
        createdAt: { type: Date, default: Date.now },
        createdBy: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Quote = mongoose.model("Quote", quoteSchema);
