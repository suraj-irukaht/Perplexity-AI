import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    content: {
      type: String,
      default: "Type your message",
      trim: "true",
    },
  },
  { timestamps: true },
);

const messageModel = mongoose.model("Message", messageSchema);

export default messageModel;
