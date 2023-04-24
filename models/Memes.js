import mongoose from "mongoose";

const memeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isApproved: {
    type: Boolean,
    required: false,
    default: false,
  },
  fileId: {
    type: String,
    required: true,
  },
});

const Meme = mongoose.model("Meme", memeSchema);
export default Meme;
