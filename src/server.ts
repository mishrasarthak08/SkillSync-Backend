import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import morgan from 'morgan';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
    : process.env.NODE_ENV === 'production'
    ? false // In production, you should set FRONTEND_URL
    : true, // Allow all origins in development
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRouter);

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to API' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  if (process.env.NODE_ENV === 'development') {
    const dbUrl = process.env.DATABASE_URL || '';
    // Avoid printing credentials; safe for sqlite file paths
    console.log(`Using DATABASE_URL: ${dbUrl}`);
  }
});

