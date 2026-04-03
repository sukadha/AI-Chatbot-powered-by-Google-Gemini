import express from 'express';
import { ConnectDB } from './lib/db.js';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Your React app URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Connect to MongoDB
ConnectDB();

// Routes
app.get('/', (req, res) => {
    res.json({ 
        message: '🤖 AI Chatbot Backend is running!',
        endpoints: {
            signup: 'POST /api/signup',
            login: 'POST /api/login',
            users: 'GET /api/users',
            userById: 'GET /api/users/:id',
            loginStats: 'GET /api/stats/logins',
            deleteUser: 'DELETE /api/users/:id'
        }
    });
});

app.use('/api', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});