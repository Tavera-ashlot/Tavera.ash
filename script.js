var snakeGame = {
    blocksize: 25, // sukod so unsa kadako ang duwaanan
    rows: 20, // Kantidad sa mga rows sa board
    cols: 20, // Kantidad sa mga columns sa board
    board: null, // Reference sa game board
    context: null, // Reference sa context sa canvas
    snakeX: 0, // Initial X position sa snake
    snakeY: 0, // Initial Y position sa snake
    velocityX: 0, // Initial velocity sa X axis
    velocityY: 0, // Initial velocity sa Y axis
    snakebody: [], // Array nga nag-ihap sa mga segments sa snake
    foodx: 0, // X position sa pagkaon
    foody: 0, // Y position sa pagkaon
    currentScore: 0, // Kasamtangan nga score
    highestScore: localStorage.getItem('highestScore') || 0, // Pinakataas nga score gikan sa localStorage or 0 kung wala pa
    GameOver: false, // Variable para sa game over state
    gameInterval: null, // Interval ID alang sa game loop
    startButton: null, // Button para magsugod sa duwa
    restartButton: null, // Button para mularga 

    // Function para magsugod sa duwa
    startGame: function() {
        this.GameOver = false;
        this.snakeX = this.blocksize * 5;
        this.snakeY = this.blocksize * 5;
        this.snakebody = [];
        this.currentScore = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.placefood();
        this.gameInterval = setInterval(this.update.bind(this), 1000/10);
    },

    // Function para sa game over
    gameOver: function() {
        clearInterval(this.gameInterval);
        if (this.currentScore > this.highestScore) {
            this.highestScore = this.currentScore;
            localStorage.setItem('highestScore', this.highestScore);
        }
        this.currentScore = 0;
        this.displayScores();
        this.board.style.display = 'none';
        this.restartButton.style.display = 'block';
    },

    // Function para mag-update sa game state
    update: function() {
        if (this.GameOver) {
            alert("HI SHEEESH BUANGA");
            this.gameOver();
            return;
        }

        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.board.width, this.board.height);

        this.context.fillStyle = "green";
        this.context.fillRect(this.foodx, this.foody, this.blocksize, this.blocksize);

        if (this.snakeX === this.foodx && this.snakeY === this.foody) {
            this.snakebody.push([this.foodx, this.foody]);
            this.placefood();
            this.eatFood();
        }

        if (this.snakebody.length) {
            this.snakebody.push([this.snakeX, this.snakeY]);
            this.snakebody.shift();
        }

        this.snakeX += this.velocityX * this.blocksize;
        this.snakeY += this.velocityY * this.blocksize;

        this.context.fillStyle = "red";
        for (let i = 0; i < this.snakebody.length; i++) {
            this.context.fillRect(this.snakebody[i][0], this.snakebody[i][1], this.blocksize, this.blocksize);
        }
        this.context.fillRect(this.snakeX, this.snakeY, this.blocksize, this.blocksize);

        if (this.snakeX < 0 || this.snakeX >= this.cols * this.blocksize || this.snakeY < 0 || this.snakeY >= this.rows * this.blocksize) {
            this.GameOver = true;
        }

        for (let i = 0; i < this.snakebody.length; i++) {
            if (this.snakeX === this.snakebody[i][0] && this.snakeY === this.snakebody[i][1]) {
                this.GameOver = true;
            }
        }

        this.displayScores();
    },

    // Function para sa pagkaon sa pagkaon
    eatFood: function() {
        this.currentScore += 10;
        this.highestScore = Math.max(this.currentScore, this.highestScore);
        localStorage.setItem('highestScore', this.highestScore);
    },

    // Function para ipakita ang scores
    displayScores: function() {
        document.getElementById('currentScore').textContent = "Score: " + this.currentScore;
        document.getElementById('highestScore').textContent = "High Score: " + this.highestScore;
    },

    // Function para sa usab-usab sa direction sa bitin
    changeDirection: function(e) {
        if (e.code === "ArrowUp" && this.velocityY !== 1) {
            this.velocityX = 0;
            this.velocityY = -1;
        } else if (e.code === "ArrowDown" && this.velocityY !== -1) {
            this.velocityX = 0;
            this.velocityY = 1;
        } else if (e.code === "ArrowRight" && this.velocityX !== -1) {
            this.velocityX = 1;
            this.velocityY = 0;
        } else if (e.code === "ArrowLeft" && this.velocityX !== 1) {
            this.velocityX = -1;
            this.velocityY = 0;
        }
    },

    // Function para sa random nga lugar sa mga pagkaon sa bitin
    placefood: function() {
        this.foodx = Math.floor(Math.random() * this.cols) * this.blocksize;
        this.foody = Math.floor(Math.random() * this.rows) * this.blocksize;
    },

    // Function para sugdan ang duwa
    initialize: function() {
        this.board = document.getElementById("board");
        this.board.height = this.rows * this.blocksize;
        this.board.width = this.cols * this.blocksize;
        this.context = this.board.getContext("2d");
        this.startButton = document.getElementById('startButton');
        this.restartButton = document.getElementById('restartButton');
        this.startButton.addEventListener('click', this.startButtonClick.bind(this));
        this.restartButton.addEventListener('click', this.restartButtonClick.bind(this));
        window.addEventListener('keydown', this.changeDirection.bind(this));
    },

    // Function para sa click event sa start button
    startButtonClick: function() {
        this.startButton.style.display = 'none';
        this.board.style.display = 'block';
        this.restartButton.style.display = 'none';
        this.startGame();
    },

    // Function para sa click event sa restart button
    restartButtonClick: function() {
        this.startButton.style.display = 'none';
        this.board.style.display = 'block';
        this.restartButton.style.display = 'none';
        this.startGame();
    }
};

// Function para magsugod ang duwa pag-load sa window
window.onload = function() {
    snakeGame.initialize();
};