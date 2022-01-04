type GameProp = {
    speed: number;
    delay: number;
    size: {
        height: number;
        width: number;    
    }
}

type Position = {
    x: number;
    y: number;
}

type SnakeT = {
    size: number;
    orientation: number;    // up = 0, right = 1, down = 2, left = 3
    positionHead: Position;
    positions: Array<Position>;
    popedPos: Position;
}

type RotationInput = {
    rotate: boolean, 
    clockwise: boolean
}

class Input {
    rotation: RotationInput;

    constructor() {
        this.rotation = {
            rotate: false,
            clockwise: true
        }

        document.addEventListener('keydown', event => {
            if (event.key === 'd') {
                this.rotation.clockwise = false;
                this.rotation.rotate = true;
            } else if (event.key === 'a') {
                this.rotation.clockwise = true;
                this.rotation.rotate = true;
            }
        })

        document.addEventListener('keyup', event => {
            if (event.key === 'd' || event.key === 'a') {
                this.rotation.rotate = false;
            }
        })

    }

    turn() {
        return this.rotation;
    }
}

class Snake {
    snake: SnakeT;
    gameprop: GameProp;
    board: Array<Array<string>>;
    berryCond: boolean;

    constructor(gameprop: GameProp) {
        this.gameprop = gameprop;
        this.berryCond = false;
    }

    makeBoard() {
        if (!this.board) {
            this.board = [];
        }
    
        for (let i = 0; i < this.gameprop.size.width; i++) {
            this.board[i] = [];

            for (let j = 0; j < this.gameprop.size.height; j++) {
                if (!this.board[i][j]) {
                    this.board[i][j] = 'empty';
                }
            }
        }

        const gameDiv = document.getElementById('gameDiv');

        gameDiv.innerHTML = '';
        gameDiv.style.gridTemplateColumns = 'auto '.repeat(this.gameprop.size.width);

        const maxHeight = 90;
        const maxWidth = 90;

        const height = maxHeight / this.gameprop.size.width * this.gameprop.size.height;
        const width = maxWidth / this.gameprop.size.height * this.gameprop.size.width;

        if (height <= maxWidth) {
            gameDiv.style.height =  height + 'vw';
            gameDiv.style.width =  maxHeight + 'vw';
            gameDiv.style.left =  (100 - maxHeight) / 2 + 'vw';
        } else {
            gameDiv.style.height =  maxWidth + 'vw';
            gameDiv.style.width =  width + 'vw';
            gameDiv.style.left =  (100 - width) / 2 + 'vw';
        }

        for (let i = 0; i < this.gameprop.size.width; i++) {
            for (let j = 0; j < this.gameprop.size.height; j++) {
                gameDiv.innerHTML += '<div class="grid-item" style="height: auto; width: auto"></div>';
            }
        }
    }

    createSnake() {
        const x = Math.floor(this.gameprop.size.width / 2);
        const y = Math.floor(this.gameprop.size.height / 2);

        this.snake = {
            size: 1,
            orientation: 0,
            positionHead: {
                x: x,
                y: y,
            },
            positions: [
                {
                    x: x,
                    y: y + 1
                }
            ],
            popedPos: {
                x: -1,
                y: -1
            }
        }
    }

    move() {
        this.snake.positions.unshift({
            x: this.snake.positionHead.x,
            y: this.snake.positionHead.y
        });

        try {
            if (this.snake.orientation === 0) {
                this.snake.positionHead.y--;
            } else if (this.snake.orientation === 1) {
                this.snake.positionHead.x++;
            } else if (this.snake.orientation === 2) {
                this.snake.positionHead.y++;
            } else if (this.snake.orientation === 3) {
                this.snake.positionHead.x--;
            }

            const newBlock = this.board[this.snake.positionHead.x][this.snake.positionHead.y];

            if (newBlock !== 'apple') {
                this.snake.popedPos = this.snake.positions.pop();

                if (newBlock !== 'empty') {
                    return false;
                }
            } else {
                document.getElementById('score').innerText = String(this.snake.size);

                this.snake.size++;

                this.updateTS();

                this.berryCond = false;
            }

            return true;
        } catch {
            return false;
        }
    }

    rotate(clockwise: boolean) {
        if (clockwise) {
            if (this.snake.orientation === 3) {
                this.snake.orientation = 0;
            } else {
                this.snake.orientation++;
            }
        } else {
            if (this.snake.orientation === 0) {
                this.snake.orientation = 3;
            } else {
                this.snake.orientation--;
            }
        }
    }

    spawnBerry() {
        if (this.berryCond === false) {
            const luckyNum = Math.floor(Math.random() * 10);

            const column = Math.floor(Math.random() * this.gameprop.size.width);
            const row = Math.floor(Math.random() * this.gameprop.size.height);
    
            if (luckyNum === 2 && this.board[column][row] === 'empty') {
                const gameDiv = document.getElementById('gameDiv');

                this.board[column][row] = 'apple';
                (gameDiv.children[(column * this.gameprop.size.width) + row] as HTMLElement).style.background = 'red';

                this.berryCond = true;
            }
        }
    }

    updateBoard() {
        const gameDiv = document.getElementById('gameDiv');

        this.board[this.snake.positionHead.x][this.snake.positionHead.y] = 'head';
        (<HTMLElement>gameDiv.children[(this.snake.positionHead.x * this.gameprop.size.width) + this.snake.positionHead.y]).style.background = 'green';    

        for (let i = 0; i < this.snake.size; i++) {
            this.board[this.snake.positions[i].x][this.snake.positions[i].y] = 'tail';
            (<HTMLElement>gameDiv.children[(this.snake.positions[i].x * this.gameprop.size.width) + this.snake.positions[i].y]).style.background = 'grey';
        }

        if (this.snake.popedPos.x !== -1) {
            this.board[this.snake.popedPos.x][this.snake.popedPos.y] = 'empty';
            (<HTMLElement>gameDiv.children[(this.snake.popedPos.x * this.gameprop.size.width) + this.snake.popedPos.y]).style.background = 'none';    
        }
    }

    getSize(): number {
        return this.snake.size;
    }

    updateTS() {
        const currentTS = Number(localStorage.getItem('topscore'));
        const score = snake.getSize();
    
        if (!currentTS || currentTS < score - 1) {
            document.getElementById('topscore').innerText = String(score - 1);
        } else {
            document.getElementById('topscore').innerText = localStorage.getItem('topscore');
        }
    }
}

let gameStatus = false;

let input = new Input();
let snake = new Snake(getGameProp());

document.getElementById('runBtn').addEventListener('change', event => {
    if ((<HTMLInputElement>event.currentTarget).checked) {
        document.getElementById('runLabel').innerText = 'running...';
        gameStatus = true;

        setTimeout(runSnake, getGameProp().delay);
    } else {
        document.getElementById('runLabel').innerText = 'run';
        setTimeout(resetSnake, getGameProp().delay);
    }
})

document.getElementById('inputSpeed').addEventListener('change', resetSnake);
document.getElementById('inputHeight').addEventListener('change', resetSnake);
document.getElementById('inputWidth').addEventListener('change', resetSnake);

snake.makeBoard();

snake.createSnake();
snake.updateBoard();
snake.updateTS();
document.getElementById('score').innerText = '0';

function runSnake() {
    let run = true;

    while (run && gameStatus) {
        const inp = input.turn();
    
        if (inp.rotate === true) {
            snake.rotate(inp.clockwise);
        }
    
        let move = snake.move();

        if (move) {
            snake.updateBoard();
            snake.spawnBerry();

            setTimeout(runSnake, getGameProp().delay);
        } else {
            document.getElementById('deathScreen').classList.add('active');

            const currentTS = Number(localStorage.getItem('topscore'));
            const score = snake.getSize();

            if (!currentTS || currentTS < score - 1) {
                localStorage.setItem('topscore', String(score - 1));
            }

            setTimeout(resetSnake, getGameProp().delay + 1500);
        }

        run = false;
    }
}

function resetSnake() {
    snake = new Snake(getGameProp());

    snake.makeBoard();

    snake.createSnake();
    snake.updateBoard();

    document.getElementById('deathScreen').classList.remove('active');

    (<HTMLInputElement>document.getElementById('runBtn')).checked = false;
    document.getElementById('runLabel').innerText = 'run';
    document.getElementById('score').innerText = '0';

    snake.updateTS();

    gameStatus = false;
}

function getGameProp(): GameProp {
    const speed = Number((<HTMLInputElement>document.getElementById('inputSpeed')).value);

    return {
        speed: speed,
        delay: 3500 / speed,
        size: {
            height: Number((<HTMLInputElement>document.getElementById('inputHeight')).value),
            width: Number((<HTMLInputElement>document.getElementById('inputWidth')).value),
        }
    }
}