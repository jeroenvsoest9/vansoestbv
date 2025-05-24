import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    quote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quote",
      required: true,
    },
    status: {
      type: String,
      enum: ["planned", "in_progress", "on_hold", "completed"],
      default: "planned",
    },
    startDate: { type: Date },
    endDate: { type: Date },
    estimatedCost: { type: Number, required: true },
    actualCost: { type: Number, default: 0 },
    team: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["project_manager", "constructor", "worker"],
        },
      },
    ],
    milestones: [
      {
        name: String,
        description: String,
        dueDate: Date,
        completed: { type: Boolean, default: false },
      },
    ],
    sharepointFolder: String,
  },
  {
    timestamps: true,
  },
);

export const Project = mongoose.model("Project", projectSchema);
