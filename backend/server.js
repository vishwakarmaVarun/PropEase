import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import { connectDB } from './db/db.js';
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import listingRouter from './routes/listing.router.js'
import cookieParser from 'cookie-parser';
const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/listing', listingRouter)

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})

connectDB().then(() => {
    app.listen(4000, () => {
        console.log("Server is running on port 4000!")
    })
}).catch((error) => {
    console.log(error)
})