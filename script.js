// Create floating hearts
function createHearts() {
    const heartsContainer = document.querySelector('.hearts-background');
    const hearts = 20;
    
    for (let i = 0; i < hearts; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = Math.random() * 100 + 'vh';
        heart.style.animationDelay = Math.random() * 6 + 's';
        heart.style.background = getRandomColor();
        heart.style.width = (15 + Math.random() * 15) + 'px';
        heart.style.height = heart.style.width;
        
        heartsContainer.appendChild(heart);
    }
}

function getRandomColor() {
    const colors = ['#ff4081', '#e91e63', '#ec407a', '#d81b60', '#c2185b', '#ad1457'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Level management
let currentLevel = 0;
const levels = ['level1', 'level2', 'level3', 'gallery'];

function startJourney() {
    document.querySelector('.main-screen').style.display = 'none';
    showLevel('level1');
}

function showLevel(levelId) {
    // Hide all levels
    levels.forEach(level => {
        const element = document.getElementById(level);
        if (element) element.classList.remove('active');
    });
    
    // Show current level
    const currentElement = document.getElementById(levelId);
    if (currentElement) {
        currentElement.classList.add('active');
        
        // Initialize level-specific features
        if (levelId === 'level2') {
            initializePuzzle();
        } else if (levelId === 'level3') {
            document.getElementById('guessInput').value = '';
            document.getElementById('guessInput').focus();
        }
    }
}

function nextLevel() {
    currentLevel++;
    if (currentLevel < levels.length) {
        showLevel(levels[currentLevel]);
    }
}

// Level 1 - Question
function checkAnswer(selectedOption, correct) {
    const options = document.querySelectorAll('.option');
    options.forEach(option => option.style.pointerEvents = 'none');
    
    if (correct) {
        selectedOption.style.background = '#4CAF50';
        selectedOption.style.borderColor = '#4CAF50';
        selectedOption.style.color = 'white';
        selectedOption.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            alert('Correct! I love you! 💕');
            nextLevel();
        }, 1000);
    } else {
        selectedOption.style.background = '#f44336';
        selectedOption.style.borderColor = '#f44336';
        selectedOption.style.color = 'white';
        
        setTimeout(() => {
            alert('Try again, my love! 💖');
            options.forEach(option => {
                option.style.pointerEvents = 'auto';
                option.style.background = '#f8bbd0';
                option.style.borderColor = '#ff4081';
                option.style.color = 'black';
                option.style.transform = 'none';
            });
        }, 1000);
    }
}

// Level 2 - Image Puzzle
let draggedPiece = null;

function initializePuzzle() {
    const pieces = document.querySelectorAll('.puzzle-piece');
    
    // Shuffle pieces initially
    shufflePuzzle();
    
    pieces.forEach(piece => {
        piece.setAttribute('draggable', 'true');
        piece.style.opacity = '1';
        
        piece.addEventListener('dragstart', function(e) {
            draggedPiece = this;
            setTimeout(() => {
                this.style.opacity = '0.6';
            }, 0);
        });
        
        piece.addEventListener('dragend', function() {
            this.style.opacity = '1';
            document.querySelectorAll('.puzzle-piece').forEach(p => p.classList.remove('dragover'));
        });
        
        piece.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        piece.addEventListener('dragleave', function() {
            this.classList.remove('dragover');
        });
        
        piece.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            if (draggedPiece && draggedPiece !== this) {
                // Swap the data-order attributes
                const tempOrder = this.getAttribute('data-order');
                this.setAttribute('data-order', draggedPiece.getAttribute('data-order'));
                draggedPiece.setAttribute('data-order', tempOrder);
                
                // Update the displayed numbers
                const thisNumber = this.querySelector('.piece-number');
                const draggedNumber = draggedPiece.querySelector('.piece-number');
                const tempNumber = thisNumber.textContent;
                thisNumber.textContent = draggedNumber.textContent;
                draggedNumber.textContent = tempNumber;
                
                // Reset styles
                this.classList.remove('correct', 'incorrect');
                draggedPiece.classList.remove('correct', 'incorrect');
            }
        });
    });
}

function shufflePuzzle() {
    const container = document.querySelector('.puzzle-container');
    const pieces = Array.from(container.querySelectorAll('.puzzle-piece'));
    
    // Clear container
    pieces.forEach(piece => container.removeChild(piece));
    
    // Shuffle the pieces array
    for (let i = pieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    
    // Add pieces back in shuffled order
    pieces.forEach(piece => container.appendChild(piece));
    
    // Assign random order numbers but keep track of correct order
    const orders = [1, 2, 3, 4];
    shuffleArray(orders);
    
    pieces.forEach((piece, index) => {
        piece.setAttribute('data-order', orders[index]);
        piece.querySelector('.piece-number').textContent = orders[index];
        piece.classList.remove('correct', 'incorrect');
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function checkPuzzle() {
    const pieces = document.querySelectorAll('.puzzle-piece');
    let isCorrect = true;
    
    pieces.forEach((piece, index) => {
        const currentOrder = parseInt(piece.getAttribute('data-order'));
        const correctOrder = index + 1;
        
        if (currentOrder === correctOrder) {
            piece.classList.add('correct');
            piece.classList.remove('incorrect');
        } else {
            piece.classList.add('incorrect');
            piece.classList.remove('correct');
            isCorrect = false;
        }
    });
    
    if (isCorrect) {
        setTimeout(() => {
            alert('Perfect! Our beautiful memories in the right order! 💞');
            nextLevel();
        }, 1000);
    } else {
        setTimeout(() => {
            alert('Almost there! Try arranging them in chronological order 💝');
            // Remove the red borders after 2 seconds
            setTimeout(() => {
                pieces.forEach(piece => {
                    piece.classList.remove('incorrect');
                });
            }, 2000);
        }, 500);
    }
}

// Level 3 - Word Guess
let currentHint = 0;
const hints = [
    "It's how I feel about you",
    "It starts with 'L'",
    "It's eternal",
    "It grows stronger every day",
    "It's what makes us special"
];

function showHint() {
    const hintElement = document.getElementById('hintText');
    currentHint = (currentHint + 1) % hints.length;
    hintElement.textContent = hints[currentHint];
    
    // Add a little animation
    hintElement.style.transform = 'scale(1.05)';
    setTimeout(() => {
        hintElement.style.transform = 'scale(1)';
    }, 200);
}

function checkGuess() {
    const guess = document.getElementById('guessInput').value.trim().toUpperCase();
    const answer = "LOVE";
    
    if (guess === answer) {
        document.getElementById('guessInput').style.borderColor = '#4CAF50';
        document.getElementById('guessInput').style.background = '#E8F5E8';
        
        setTimeout(() => {
            alert('Yes! I will love you forever! 💗');
            nextLevel();
        }, 1000);
    } else {
        document.getElementById('guessInput').style.borderColor = '#f44336';
        document.getElementById('guessInput').style.background = '#FFEBEE';
        
        setTimeout(() => {
            alert('Close! Think about what binds us together 💕');
            document.getElementById('guessInput').value = '';
            document.getElementById('guessInput').style.borderColor = '#ff4081';
            document.getElementById('guessInput').style.background = 'white';
            document.getElementById('guessInput').focus();
        }, 1000);
    }
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    createHearts();
    
    // Add keyboard support for guess input
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && document.getElementById('level3').classList.contains('active')) {
            checkGuess();
        }
    });
    
    // Add touch support for mobile devices
    document.addEventListener('touchstart', function() {}, { passive: true });
});