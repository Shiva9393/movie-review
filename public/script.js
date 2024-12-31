let currentMovieTitle = ''; 

function openReviewModal(movieTitle) {
    currentMovieTitle = movieTitle; // Set the current movie title
    document.getElementById("movieTitle").textContent = movieTitle; 
    document.getElementById("reviewModal").style.display = "block"; 
    document.getElementById("actionButtons").style.display = "block"; 
    document.getElementById("reviewForm").style.display = "none"; 
    document.getElementById("reviewsSection").style.display = "none"; 
    document.getElementById("usernameSection").style.display = "none"; 
    
    fetchReviews();
}

function closeReviewModal() {
    document.getElementById("reviewModal").style.display = "none"; 
}

function showReviewForm() {
    document.getElementById("reviewForm").style.display = "block"; 
    document.getElementById("usernameSection").style.display = "none"; 
    document.getElementById("reviewsSection").style.display = "none";
    document.getElementById("actionButtons").style.display = "none"; 
}

function submitUsername() {
    const username = document.getElementById("username").value;
    if (username) {
        document.getElementById("usernameSection").style.display = "none"; 
        showReviewForm(); 
    } else {
        alert("Please enter a valid username.");
    }
}

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
            document.getElementById("reviewsSection").style.display = "none"; 
            alert("No reviews available for this movie.");
        }
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}

function displayReviews(reviews) {
    const reviewsList = document.getElementById("reviewsList");
    reviewsList.innerHTML = ''; // Clear the previous reviews

    reviews.forEach(review => {
        const li = document.createElement('li');
        li.textContent = `${review.reviewerName}: ${review.reviewText} (Rating: ${review.rating})`;
        reviewsList.appendChild(li);
    });

    document.getElementById("reviewsSection").style.display = "block"; 
    document.getElementById("actionButtons").style.display = "none"; 
}

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
            document.getElementById("reviewText").value = ''; 
            document.getElementById("reviewRating").value = ''; 
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        alert("Error submitting review. Please try again.");
    }
}

function seeReviews() {
    fetchReviews(); // Trigger fetching of reviews
    document.getElementById("actionButtons").style.display = "none"; 
}
