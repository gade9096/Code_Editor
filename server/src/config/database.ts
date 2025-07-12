import mongoose from 'mongoose'

const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://nikampratik2989:aXfOMN4oaDhzhtgZ@cluster0.z7s5px2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
        
        await mongoose.connect(mongoURI)
        console.log('✅ MongoDB connected successfully')
    } catch (error) {
        console.error('❌ MongoDB connection error:', error)
        process.exit(1)
    }
}

export default connectDB