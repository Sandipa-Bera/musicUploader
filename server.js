const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/db/db');
const authRoutes = require('./src/authRoutes/auth.routes');
const musicRoutes = require('./src/authRoutes/music.routes');

const app = express();
const port = process.env.PORT || 3000;

// CORS – allow React frontend
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});
