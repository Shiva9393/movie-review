const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path to the database file
const dbPath = path.resolve(__dirname, 'database.db');

// Create a new SQLite database instance
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1); // Exit if database connection fails
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase();
    }
});

// Function to initialize the database by creating tables
function initializeDatabase() {
    createUsersTable();
    createReviewsTable();
}

// Function to create the 'users' table
function createUsersTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE
        )
    `;
    db.run(sql, logTableCreation('users'));
}

// Function to create the 'reviews' table
function createReviewsTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            movieTitle TEXT NOT NULL,
            reviewerName TEXT NOT NULL,
            reviewText TEXT NOT NULL,
            rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    db.run(sql, logTableCreation('reviews'));
}

// Helper function to log table creation success/failure
function logTableCreation(tableName) {
    return (err) => {
        if (err) {
            console.error(`Error creating ${tableName} table:`, err.message);
        } else {
            console.log(`${tableName} table created successfully.`);
        }
    };
}

// Function to insert a new user into the 'users' table
function insertUser(username, email) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO users (username, email) VALUES (?, ?)`;
        db.run(sql, [username, email], function (err) {
            if (err) return reject(err);
            resolve(this.lastID);
        });
    });
}

// Function to insert a new review into the 'reviews' table
function insertReview(movieTitle, reviewerName, reviewText, rating) {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO reviews (movieTitle, reviewerName, reviewText, rating)
            VALUES (?, ?, ?, ?)
        `;
        db.run(sql, [movieTitle, reviewerName, reviewText, rating], function (err) {
            if (err) return reject(err);
            resolve(this.lastID);
        });
    });
}

// Function to retrieve all reviews (or reviews for a specific movie)
function getAllReviews(movieTitle = null) {
    return new Promise((resolve, reject) => {
        const sql = movieTitle
            ? `SELECT * FROM reviews WHERE movieTitle = ?`
            : `SELECT * FROM reviews`;
        db.all(sql, movieTitle ? [movieTitle] : [], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

// Export the necessary functions
module.exports = {
    insertUser,
    insertReview,
    getAllReviews,
};
