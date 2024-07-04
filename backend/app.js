const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');
const { readdirSync } = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

//for local test comment below
app.use(cors({
    origin: 'https://expense-manager-fullstack.vercel.app', // Remove trailing slash
    credentials: true
}));

//for local test uncomment below
// app.use(cors());

// Database connection
db(); // Assuming db() initializes your database connection

// Dynamically import routes
readdirSync('./routes').map((route) => app.use('/api/v1', require('./routes/' + route)));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
