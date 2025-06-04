import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const db = await mongoose.connect(`mongodb+srv://tosylfluoride:rps%40123R@cluster0.yjv53nj.mongodb.net/Cluster0`)
        console.log(`\n MongoDB Connected 🗿 DB host: ${db.connection.host}`);
        return db;
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
        process.exit(1);
    }
}

export default connectDB