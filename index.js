document.addEventListener('DOMContentLoaded', (e) => {
    //e.preventDefault();

    //HTML DOM CONTENTS
    const canvas = document.querySelector('#my-canvas');
    const playBtn = document.querySelector('[name="play-btn"]');
    const context = canvas.getContext('2d');
    const HTMLScored = document.querySelector('span.scored')
    const HTMLScored2 = document.querySelector('span.adding')
    const mode1 = document.querySelector('[name="mode1"]');
    const mode2 = document.querySelector('[name="mode2"]');

    const unitSquare = 30;

    //Object functions
    let snake = new Snake();
    let food = new Food();

    const snakeStatable = snake.getStatable();
    const snakeColor = 'white';
    const snakeHeadColor = 'rgb(11, 197, 36)';
    const foodColor = 'red';
    let started = false;
    let processing, snakeHead, foodCoords, scores = 0, speed = 160, mode = 1;

    const keyControl = (e) => {
        e.preventDefault();
        //console.log(`press ${e.keyCode}`)
        switch (e.keyCode) {
            case 37: if (snake.state != snakeStatable.RIGHT) snake.state = snakeStatable.LEFT; break;
            case 38: if (snake.state != snakeStatable.DOWN) snake.state = snakeStatable.UP; break;
            case 39: if (snake.state != snakeStatable.LEFT) snake.state = snakeStatable.RIGHT; break;
            case 40: if (snake.state != snakeStatable.UP) snake.state = snakeStatable.DOWN; break;
        }
    }

    //add more prototype (processing method) for Snake
    Snake.prototype.draw = function () {
        //console.log('drawing...')
        const body = snake.getBodyArr();

        for (let i = 0; i < body.length; i++) {
            if (i == 0) {
                snakeHead = { x: body[i].x, y: body[i].y }
                context.fillStyle = snakeHeadColor;
            }
            else context.fillStyle = snakeColor;
            context.fillRect(body[i].x, body[i].y, unitSquare - 2, unitSquare - 2);
        }
    };

    Food.prototype.draw = function () {
        context.fillStyle = foodColor;
        context.fillRect(foodCoords.x, foodCoords.y, unitSquare - 2, unitSquare - 2)
    }

    function drawMap() {
        for (let i = 0; i < canvas.height; i += unitSquare) {
            for (let j = 0; j < canvas.width; j += unitSquare) {
                const index_x = Math.floor(i / unitSquare) % 2;
                const index_y = Math.floor(j / unitSquare) % 2;

                if (index_x != index_y) {
                    context.fillStyle = 'rgb(23,23,23)'
                }
                else context.fillStyle = 'rgb(30,30,30)'
                context.fillRect(j, i, unitSquare, unitSquare);
            }
        }
    }

    function touchWallDead() {
        if (snakeHead.y < 0 || snakeHead.y >= canvas.height
            || snakeHead.x < 0 || snakeHead.x >= canvas.width)
            return true;
        return false;
    }
    function touchWallThrough() {
        //touch the right wall
        if (snakeHead.x>= canvas.width) {
            snakeHead.x = 0;
            snake.state = snakeStatable.RIGHT;
        }
        //touch the left wall
        else if (snakeHead.x < 0) {
            snakeHead.x = canvas.width - unitSquare;
            snake.state = snakeStatable.LEFT;
        }
        //touch the top wall
        else if (snakeHead.y < 0) {
            snakeHead.y = canvas.height - unitSquare;
            snake.state = snakeStatable.UP;
        }
        //touch to bottom wall
        if (snakeHead.y >= canvas.height) {
            snakeHead.y = 0;
            snake.state = snakeStatable.DOWN;
        }

        snake.setHead(snakeHead)
    }

    function init(){
        snake = new Snake();
        started = false;
        scores = 0;
        playBtn.innerHTML= 'Start';
        createNewFood();
        foodCoords = food.getCoords();
        snake.setHead({x: Math.floor(9*unitSquare),y: Math.floor(9*unitSquare)})
    }
    function startGame() {
        init();
        if (!foodCoords)
            food.create(unitSquare, canvas.width, canvas.height);
        foodCoords = food.getCoords();
        snake.draw();
        processing = setInterval(gameLoop, speed);
    }
    function createNewFood() {
        food.create(unitSquare, canvas.width, canvas.height);
        foodCoords = food.getCoords();
    }
    function increaseScores() {
        scores++;
        HTMLScored.innerHTML = scores;
        HTMLScored.classList.add('adding');
    }
    function endGame() {
        clearInterval(processing);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "white";
        context.font = "30px Arial";
        if (snake.ateSelf())
            context.fillText("YOU BITTED YOURSELF👻!", 100, canvas.height / 2);
        else {
            context.fillText("YOU HIT THE WALL 👻!", 100, canvas.height / 2);
        }
        init();
    }
    function gameLoop() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawMap();
        food.draw();
        snake.move(unitSquare);
        snake.draw();

        //snake ate the food
        if (snakeHead.x == foodCoords.x && snakeHead.y == foodCoords.y) {
            snake.growAt(foodCoords)
            createNewFood();
            increaseScores();
        } else {
            if (mode == 1) touchWallThrough();
            let isEnd = snake.ateSelf() || ((mode == 2) ? touchWallDead() : false);
            if (isEnd) endGame();
        }
    }


    mode2.addEventListener('click', () => {
        mode1.checked = false;
        mode = 2
    });
    mode1.addEventListener('click', () => {
        mode2.checked = false;
        mode = 1
    });
    window.addEventListener('keydown', keyControl);
    playBtn.addEventListener('click', function () {
        if (started == true) {
            clearInterval(processing);
            started = false;
            this.innerHTML = 'START';
        }
        else {
            startGame();
            started = true;
            this.innerHTML = 'PAUSE';
        }
    })
    HTMLScored.addEventListener('transitionend', function () {
        this.classList.remove('adding');
    })
})