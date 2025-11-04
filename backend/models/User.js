import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  vitmail: { type: String, required: true, unique: true },
  vitReg: { type: String, required: true, unique: true },
  phone: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now },
  notifications: [
    {
      message: { type: String },
      read: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  
});

export default mongoose.model("User", userSchema);
