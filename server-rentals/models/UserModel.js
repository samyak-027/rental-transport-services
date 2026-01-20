import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    profilePicture: {
      type: String,
      default: null,
    },

    password: {
      type: String,
      required: true,
    },

    isAuth: {
      type: Boolean,
      default: false,
    },

    licenseStatus: {
      type: String,
      enum: ["NOT_UPLOADED", "PENDING", "APPROVED", "REJECTED"],
      default: "NOT_UPLOADED",
    },

    licenseFront: {
      type: String,
      default: null,
    },

    licenseBack: {
      type: String,
      default: null,
    },

    licenseRejectionReason: {
      type: String,
      default: null,
    },

    verifyotp: String,
    verifyOtpExpireAt: Date,

    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.Users || mongoose.model('Users', userSchema);
export default User;
