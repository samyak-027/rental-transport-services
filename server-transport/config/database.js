import mongoose from 'mongoose';
import dotenv from 'dotenv';
    
dotenv.config();

const connectDB = async () => {
    try {
        main().catch(err => console.log(err));
        async function main() {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('MongoDB connected');
            // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
        }
    } catch (error) {
        console.error('MongoDB Connection Failed:', error);
        process.exit(1);
    }
};

connectDB();
export default mongoose;