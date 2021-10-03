var gameCanvas = document.getElementById("game-canvas");
var canvas = gameCanvas.getContext("2d");

let draw = {
    Rectangle: function(x, y, w, h, col) {
        canvas.beginPath();
        canvas.rect(x, y, w, h);
        canvas.fillStyle = col;
        canvas.fill();
        canvas.closePath();
    },
    Circle: function(x, y, r, col) {
        canvas.beginPath();
        canvas.arc(x, y, r, 0, 2 * Math.PI);
        canvas.fillStyle = col;
        canvas.fill();
        canvas.closePath();
    }
}

rightArrow = false;
leftArrow = false;
function Inputdetection() {
    // right arrow
    document.addEventListener("keydown", function(event) {
        if (event.key == "Right" || event.key == "ArrowRight") {
            rightArrow = true;
        }
    }, false);
    document.addEventListener("keyup", function(event) {
        if (event.key == "Right" || event.key == "ArrowRight") {
            rightArrow = false;
        }
    }, false);
    // left arrow
    document.addEventListener("keydown", function(event) {
        if (event.key == "Left" || event.key == "ArrowLeft") {
            leftArrow = true;
        }
    }, false);
    document.addEventListener("keyup", function(event) {
        if (event.key == "Left" || event.key == "ArrowLeft") {
            leftArrow = false;
        }
    }, false);
}

let Paddle = {
    width: 100,
    height: 10,
    colour: "#D08770",
// for movement
    x: gameCanvas.width/2 - 50,
    y: gameCanvas.height - 10,
    dx: 6,
// Methods
    move: function() {
        Inputdetection();
        draw.Rectangle(this.x, this.y, this.width, this.height, this.colour);
        if (rightArrow && this.x < gameCanvas.width - this.width) {
            this.x += this.dx;
        }
        if (leftArrow && this.x > 0) {
            this.x -= this.dx;
        }
    }
}

let Bricks = {
    xCount: 5,
    yCount: 3,
// Methods
    draw: function() {
        var width = gameCanvas.width / 5;
        var height = 50;
        for (i = 0; i < this.xCount; i++)
            for (j = 0; j < this.yCount; j++)
                draw.Rectangle(0 + i * width, 0 + j * height, width, height, "lightsteelblue");
    }
}

let Ball = {
    radius: 10,
    colour: "#BF616A",
// for movement
    x: gameCanvas.width / 2,
    y: gameCanvas.height - Paddle.height - 20,
    dx: -5,
    dy: -2,
// Methods
    // All collision detection
    detectGameOver: function() {
        if (this.y >= gameCanvas.height - this.radius) {
            window.alert("chal na game over");
            this.dy *= -1;
        }
    },
    detectBoundary: function() {
        if (this.x >= gameCanvas.width - this.radius || this.x <= this.radius) {
            this.dx *= -1;
        }
        if (this.y <= this.radius) {
            this.dy *= -1;
        }
    },
    detectPaddleTop: function() {
        // if the ball 
        if (this.x + this.radius >= Paddle.x && this.x - this.radius <= Paddle.x + Paddle.width)
            if (this.y + this.radius == Paddle.y || this.y - this.radius == Paddle.y + Paddle.height) // top of the paddle
                this.dy *= -1;
    },
    detectPaddleSides: function() {
        if (this.y >= Paddle.y - this.radius && this.y <= Paddle.y + Paddle.height + this.radius) // sides of the paddle
            if (this.x == Paddle.x + Paddle.width + this.radius || this.x == Paddle.x - this.radius)
                this.dx *= -1;
    },
    detect: function() {
        this.detectGameOver();
        this.detectBoundary();
        this.detectPaddleTop();
        this.detectPaddleSides();
    },
    // just calling this should handle all movement
    move: function() {
        this.detect();
        this.x += this.dx;
        this.y += this.dy;
        draw.Circle(this.x, this.y, this.radius, this.colour);

    }
}

function gameLoop() {
    canvas.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // clear everything
    Ball.move();
    Paddle.move();
    Bricks.draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();