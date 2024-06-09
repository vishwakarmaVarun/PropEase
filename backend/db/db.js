import mongoose from "mongoose";

const URI = process.env.MONGO_URI

export const connectDB = async () => {
    try {
        await mongoose.connect(URI)
        console.log("Database connected successfully!")
    } catch (error) {
        console.log(error)
    }
}