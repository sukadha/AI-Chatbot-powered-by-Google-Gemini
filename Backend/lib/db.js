import mongoose from "mongoose";

export const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected Successfully");
        console.log(`📁 Database: ${mongoose.connection.name}`);
    } catch (error) {
        console.log('❌ MongoDB Error:', error.message);
        process.exit(1);
    }
};