const express = require('express');
const cors = require('cors');
const path = require('path');
const { insertUser } = require('./db.js'); // Import specific functions from db.js
const reviewsRoute = require('./routes/Reviews.js'); // Import the reviews route
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' folder

// Root route to serve main.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html')); // Send main.html file
});
// Route to insert a user
app.post('/api/users', async (req, res) => {
    const { username, email } = req.body;

    // Validate the input
    if (!username || !email) {
        return res.status(400).json({ error: 'Both username and email are required.' });
    }

    try {
        // Insert the user into the database
        const userId = await insertUser(username, email);
        res.status(201).json({ message: 'User inserted successfully', userId });
    } catch (err) {
        console.error('Error inserting user:', err.message);
        res.status(500).json({ error: 'Error inserting user. Please try again later.' });
    }
});

// Use the reviews route
app.use('/api/reviews', reviewsRoute);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
