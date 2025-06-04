import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const URL = process.env.MONGODB_URI;
        if (!URL) throw new Error("MONGODB_URI not found in environment variables");
        const db = await mongoose.connect(URL)
        console.log(`\n MongoDB Connected 🗿 DB host: ${db.connection.host}`);
        return db;
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
        process.exit(1);
    }
}

export default connectDB