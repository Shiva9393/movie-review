let currentMovieTitle = ''; // Store the current movie title

// Open the review modal for a specific movie
function openReviewModal(movieTitle) {
    currentMovieTitle = movieTitle; // Set the current movie title
    document.getElementById("movieTitle").textContent = movieTitle; // Display the movie title in the modal
    document.getElementById("reviewModal").style.display = "block"; // Show the modal
    document.getElementById("actionButtons").style.display = "block"; // Show the action buttons
    document.getElementById("reviewForm").style.display = "none"; // Hide the review form initially
    document.getElementById("reviewsSection").style.display = "none"; // Hide the reviews section initially
    document.getElementById("usernameSection").style.display = "none"; // Hide the username section initially

    // Fetch and display reviews for the movie
    fetchReviews();
}

// Close the review modal
function closeReviewModal() {
    document.getElementById("reviewModal").style.display = "none"; // Hide the modal
}

// Show the review form
function showReviewForm() {
    document.getElementById("reviewForm").style.display = "block"; // Show the review form
    document.getElementById("usernameSection").style.display = "none"; // Hide the username input section
    document.getElementById("reviewsSection").style.display = "none"; // Hide the reviews section
    document.getElementById("actionButtons").style.display = "none"; // Hide the action buttons
}

// Submit the username entered
function submitUsername() {
    const username = document.getElementById("username").value;
    if (username) {
        document.getElementById("usernameSection").style.display = "none"; // Hide the username section
        showReviewForm(); // Show the review form after username submission
    } else {
        alert("Please enter a valid username.");
    }
}

// Fetch reviews for the current movie
async function fetchReviews() {
    try {
        const response = await fetch(`/api/reviews?movieTitle=${encodeURIComponent(currentMovieTitle)}`);
        const data = await response.json();
        console.log(`/api/reviews?movieTitle=${encodeURIComponent(currentMovieTitle)}`)
        if (data.error) {
            console.error(data.error);
            return;
        }
console.log(data)
        if (Array.isArray(data) && data.length > 0) {
            displayReviews(data);
        } else {
            document.getElementById("reviewsSection").style.display = "none"; // Hide if no reviews
            alert("No reviews available for this movie.");
        }
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}

// Display the fetched reviews
function displayReviews(reviews) {
    const reviewsList = document.getElementById("reviewsList");
    reviewsList.innerHTML = ''; // Clear the previous reviews

    reviews.forEach(review => {
        const li = document.createElement('li');
        li.textContent = `${review.reviewerName}: ${review.reviewText} (Rating: ${review.rating})`;
        reviewsList.appendChild(li);
    });

    document.getElementById("reviewsSection").style.display = "block"; // Show the reviews section
    document.getElementById("actionButtons").style.display = "none"; // Hide action buttons once reviews are shown
}

// Submit the review entered by the user
async function submitReview() {
    const reviewText = document.getElementById("reviewText").value;
    const rating = document.getElementById("reviewRating").value;
    const reviewerName = document.getElementById("reviewUsername").value;

    if (!reviewText || !rating) {
        alert("Please fill out all fields.");
        return;
    }

    try {
        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                movieTitle: currentMovieTitle,
                reviewerName,
                reviewText,
                rating,
            }),
        });

        const data = await response.json();
        if (data.error) {
            console.error(data.error);
            alert("Error submitting review. Please try again.");
        } else {
            alert("Review submitted successfully.");
            fetchReviews(); // Refresh the reviews
            document.getElementById("reviewText").value = ''; // Clear the review form
            document.getElementById("reviewRating").value = ''; // Clear the rating field
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        alert("Error submitting review. Please try again.");
    }
}

// See the reviews for the movie
function seeReviews() {
    fetchReviews(); // Trigger fetching of reviews
    document.getElementById("actionButtons").style.display = "none"; // Hide the action buttons once reviews are fetched
}
