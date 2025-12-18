import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
      default: "user",
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
