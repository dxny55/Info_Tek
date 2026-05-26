import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  mailAdress: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userPicture: { type: String },
  provider: { type: String, default: "infotek" },
  billingInfo: {
    payCard: { type: String },
    cvCard: { type: String },
    cardHolder: { type: String },
    userAddress: {
      street: { type: String },
      city: { type: String },
      zipCode: { type: String }
    }
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);