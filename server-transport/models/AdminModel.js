import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    createdAt: { type: Date, default: Date.now },
    },
  { timestamps: true }
);

const Admin = mongoose.models.Admins || mongoose.model('Admins', adminSchema);
export default Admin;