const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 
const path = require('path');

dotenv.config();
connectDB(); 
const app = express();

// --- THE CORS FIX ---
// This tells the backend exactly who is allowed to talk to it.
app.use(cors({
  origin: [
    'http://localhost:5173',          // Allows your local computer to connect
    'https://it-s-s.vercel.app'       // Allows your live Vercel website to connect
    // 'https://www.your-future-domain.com' <-- You will just uncomment and add this later!
  ],
  credentials: true
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// --- ROUTES ---
app.use('/api/auth', require('./routes/authRoutes')); 
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/operations', require('./routes/operationRoutes'));
app.use('/api/treasury', require('./routes/treasuryRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/audit', require('./routes/auditRoutes'));

// --- STATIC FILES ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => { res.send('ITSS API is running...'); });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });