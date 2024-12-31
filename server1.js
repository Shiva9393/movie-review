const express = require('express');
const cors = require('cors');
const path = require('path');
const { insertUser } = require('./db.js'); 
const reviewsRoute = require('./routes/Reviews.js'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' folder
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html')); // Send main.html file
});
app.post('/api/users', async (req, res) => {
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({ error: 'Both username and email are required.' });
    }

    try {
        const userId = await insertUser(username, email);
        res.status(201).json({ message: 'User inserted successfully', userId });
    } catch (err) {
        console.error('Error inserting user:', err.message);
        res.status(500).json({ error: 'Error inserting user. Please try again later.' });
    }
});

app.use('/api/reviews', reviewsRoute);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
