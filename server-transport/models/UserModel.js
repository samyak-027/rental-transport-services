import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAuth: { type: Boolean , default: false },
    isAccountVerified: { type: Boolean, default: false },
    verifyotp: { type: String },
    verifyOtpExpireAt: { type: Date },
    licenseFrontUrl: { type: String },
    licenseBackUrl: { type: String }, 
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const User = mongoose.models.Users || mongoose.model('Users', userSchema);
export default User;