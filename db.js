const sqlite3 = require('sqlite3').verbose();
const path = require('path');


const dbPath = path.resolve(__dirname, 'database.db');


const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1); // Exit if database connection fails
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase();
    }
});


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


function logTableCreation(tableName) {
    return (err) => {
        if (err) {
            console.error(`Error creating ${tableName} table:`, err.message);
        } else {
            console.log(`${tableName} table created successfully.`);
        }
    };
}


function insertUser(username, email) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO users (username, email) VALUES (?, ?)`;
        db.run(sql, [username, email], function (err) {
            if (err) return reject(err);
            resolve(this.lastID);
        });
    });
}

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


module.exports = {
    insertUser,
    insertReview,
    getAllReviews,
};
