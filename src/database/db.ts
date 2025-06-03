import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const db = await mongoose.connect(`mongodb+srv://tosylfluoride:rps@123R@cluster0.yjv53nj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
        console.log(`\n MongoDB Connected 🗿 DB host: ${db.connection.host}`);
        return db;
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
        process.exit(1);
    }
}