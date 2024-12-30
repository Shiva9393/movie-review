const express = require('express');
const { insertReview, getAllReviews } = require('../db.js');
console.log('DB module imported successfully:', { insertReview, getAllReviews });
 // Move up one directory to access db.js
 // Relative path to db.js

const router = express.Router();

// Route to add a new review
router.post('/', async (req, res) => {
    const { movieTitle, reviewerName, reviewText, rating } = req.body;
console.log(req.body);
    // Validate input
    const numericRating = Number(rating); // Ensure rating is numeric
    if (!movieTitle || !reviewText || isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
        return res.status(400).json({
            error: 'All fields are required, and rating must be a number between 1 and 5.',
        });
    }

    try {
        // Insert the review into the database
        // let reviewerName= "Ano"
        const reviewId = await insertReview(movieTitle, reviewerName, reviewText, numericRating);
        res.status(201).json({
            message: 'Review submitted successfully.',
            reviewId,
        });
    } catch (err) {
        console.error('Error inserting review:', err.message);
        res.status(500).json({ error: 'Error inserting review. Please try again later.' });
    }
});

// Route to get reviews for a specific movie
router.get('/', async (req, res) => {
    const { movieTitle } = req.query;

    try {
        // Retrieve reviews for the specified movie
        const reviews = await getAllReviews(movieTitle);

        res.status(200).json(reviews);
    } catch (err) {
        console.error('Error retrieving reviews:', err.message);
        res.status(500).json({ error: 'Error retrieving reviews. Please try again later.' });
    }
});

// Export the router
module.exports = router;
