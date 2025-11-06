// API Configuration
const API_URL = 'https://instagramvoting001.pythonanywhere.com'; // Change this to your deployed API URL

// Sample contestants data (will be replaced by API calls)
const contestants = [
    { id: 1, name: "CONTESTANT 001", video: "https://res.cloudinary.com/arabasiastarz/video/upload/v1651045151/gussookvqhz3vhve9dic.mov", category: "Fashion", votes: 87 },
    { id: 2, name: "CONTESTANT 002", video: "https://res.cloudinary.com/arabasiastarz/video/upload/v1651051566/vh4vxtiyhqhxijn7vcl3.mp4", category: "Beauty", votes: 15 },
    { id: 3, name: "CONTESTANT 003", video: "https://res.cloudinary.com/arabasiastarz/video/upload/v1650881288/xvkrnodivdbhbmatjybi.mov", category: "Entertainment", votes: 27 },
    { id: 4, name: "CONTESTANT 004", video: "https://res.cloudinary.com/arabasiastarz/video/upload/v1650902472/hbxqm4rlsphxknqtsenf.mov", category: "Fashion", votes: 91 },
    { id: 5, name: "CONTESTANT 005", video: "https://res.cloudinary.com/arabasiastarz/video/upload/v1650861927/wnpa1bm2drnv8neqssym.mov", category: "Beauty", votes: 72 },
    { id: 6, name: "CONTESTANT 006", video: "https://res.cloudinary.com/arabasiastarz/video/upload/v1650954394/qylocmbs1vsekvo9pdaf.mov", category: "Entertainment", votes: 35 },
    { id: 7, name: "CONTESTANT 007", video: "https://res.cloudinary.com/arabasiastarz/video/upload/v1650673041/ugqahcxwcc2hqmrvezgs.mov", category: "Fashion", votes: 70 },
    { id: 8, name: "CONTESTANT 008", video: "https://res.cloudinary.com/arabasiastarz/video/upload/v1649711891/n67uk3ybbtppemdjmq41.mov", category: "Beauty", votes: 73 },
    { id: 9, name: "CONTESTANT 009", video: "https://res.cloudinary.com/arabasiastarz/video/upload/v1651087663/vnhy7bod3d3auu3qyny4.mov", category: "Entertainment", votes: 92 },
    { id: 10, name: "CONTESTANT 010", video: "https://res.cloudinary.com/arabasiastarz/video/upload/v1650661497/t9tttunayegnzxibyoem.mov", category: "Fashion", votes: 99 },
    { id: 11, name: "CONTESTANT 011", video: "https://res.cloudinary.com/arabasiastarz/video/upload/v1648893566/ekrgojph1o9ez6ywzir8.mp4", category: "Beauty", votes: 51 },
    { id: 12, name: "CONTESTANT 012", video: "https://res.cloudinary.com/arabasiastarz/video/upload/v1650976595/i9l8ctotlj2x5pav0hve.mp4", category: "Entertainment", votes: 65 },
    { id: 13, name: "CONTESTANT 013", video: "https://res.cloudinary.com/arabasiastarz/video/upload/v1650711423/k3jfrtholgujrl2tsx3p.mov", category: "Fashion", votes: 91 },
    { id: 14, name: "CONTESTANT 014", video: "https://res.cloudinary.com/arabasiastarz/video/upload/v1650894899/kfupn4jgjgnyq3icv3jp.mov", category: "Beauty", votes: 91 },
    { id: 15, name: "CONTESTANT 015", video: "https://res.cloudinary.com/arabasiastarz/video/upload/v1650969217/dfgmjfwdgaqw2sp3l9eg.mp4", category: "Entertainment", votes: 35 },
    { id: 16, name: "CONTESTANT 016", video: "https://res.cloudinary.com/arabasiastarz/video/upload/v1649773916/glxi3orjgrgjbuttjrxv.mov", category: "Fashion", votes: 39 },
    { id: 17, name: "CONTESTANT 017", video: "https://res.cloudinary.com/arabasiastarz/video/upload/v1650698622/y4ttceacii4fdn79iwkd.mov", category: "Beauty", votes: 5 },
    { id: 18, name: "CONTESTANT 018", video: "https://res.cloudinary.com/arabasiastarz/video/upload/v1649326322/wiufjyit8wwc7cm8ucks.mov", category: "Entertainment", votes: 32 },
    { id: 19, name: "CONTESTANT 019", video: "https://res.cloudinary.com/arabasiastarz/video/upload/v1649242690/fhpe6ihsjkwmlmhslksy.mp4", category: "Fashion", votes: 67 },
    { id: 20, name: "CONTESTANT 020", video: "https://res.cloudinary.com/arabasiastarz/video/upload/v1650517159/r2rxgegn6acovhttmboz.mov", category: "Beauty", votes: 30 }
];

// Load contestants on page load
document.addEventListener('DOMContentLoaded', function() {
    loadContestants();
    checkAPIConnection();
    checkVotingStatus();
});

// Check if user came from failed vote
function checkVotingStatus() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('vote') === 'failed') {
        window.location.href = 'vote-failed.html';
    }
}

// Load contestants into the grid
function loadContestants() {
    const grid = document.getElementById('contestants-grid');
    
    contestants.forEach(contestant => {
        const contestantCard = `
            <div class="col-sm-4">
                <div class="card text-center">
                    <div class="card-header">
                        ${contestant.name}
                    </div>
                    <div class="card-body">
                        <video controls width="100%">
                            <source src="${contestant.video}" type="video/mp4">
                            Your browser does not support HTML video.
                        </video>
                        <button type="button" class="btn btn-primary vote" 
                                data-id="${contestant.id}" 
                                data-bs-toggle="modal" data-bs-target="#exampleModal">
                            VOTE THIS CONTESTANT
                        </button>
                    </div>
                    <div class="card-footer text-muted">
                        <!-- Votes: ${contestant.votes} -->
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += contestantCard;
    });
}

// Vote for contestant
async function voteForContestant(contestantId) {
    try {
        const response = await fetch(`${API_URL}/api/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                contestant_id: contestantId,
                vote_type: 'web'
            })
        });

        const data = await response.json();
        
        if (data.status === 'success') {
            showNotification('Vote submitted successfully!', 'success');
            // Update vote count in UI
            updateVoteCount(contestantId);
        } else {
            showNotification('Error submitting vote', 'error');
        }
    } catch (error) {
        showNotification(`Error: ${error.message}`, 'error');
    }
}

// Get contestants from API
async function getContestants() {
    try {
        const response = await fetch(`${API_URL}/api/contestants`);
        const data = await response.json();
        return data.contestants || [];
    } catch (error) {
        console.error('Error fetching contestants:', error);
        return [];
    }
}

// Check API connection
async function checkAPIConnection() {
    try {
        const response = await fetch(`${API_URL}/`);
        const data = await response.json();
        console.log('API Status:', data.message);
    } catch (error) {
        console.error('API connection failed:', error);
        // showNotification('API connection failed. Using sample data.', 'warning');
    }
}

// Update vote count in UI
function updateVoteCount(contestantId) {
    // Find and update the vote count for the specific contestant
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const button = card.querySelector(`[data-id="${contestantId}"]`);
        if (button) {
            const footer = card.querySelector('.card-footer');
            const currentVotes = parseInt(footer.textContent.match(/\d+/)[0]);
            footer.textContent = `Votes: ${currentVotes + 1}`;
        }
    });
}

// Show notification
function showNotification(message, type) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Filter contestants by category
function filterContestants(category) {
    const cards = document.querySelectorAll('#contestants-grid .col-sm-4');
    
    cards.forEach(card => {
        if (category === 'ALL') {
            card.style.display = 'block';
        } else {
            // This would need to be implemented based on contestant data
            card.style.display = 'block'; // For now, show all
        }
    });
}