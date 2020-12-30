const btnStartGame = document.getElementsByClassName('btn')[0];

const board = ['pink', 'blue', 'green', 'red', 'purple', 'orange'];
const myBoard = [];
const ghosts = [];
const tempBoard = [
    1,1,1,1,1,1,1,1,1,1,
    1,4,4,4,2,2,2,2,2,1,
    1,2,3,2,2,2,2,2,2,1,
    1,2,2,2,2,2,2,2,2,1,
    1,2,3,2,2,2,2,2,2,1,
    1,2,2,2,2,2,2,2,2,1,
    1,2,3,2,2,2,2,2,2,1,
    1,2,2,2,2,2,2,2,2,1,
    1,2,2,2,2,2,2,2,2,1,
    1,1,1,1,1,1,1,1,1,1,
];

const keyz = {
    ArrowRight: false,
    ArrowLeft: false,
    ArrowUp: false,
    ArrowDown: false
};

const g = {
    x: '',
    y: '',
    h: 50,
    size: 30,
    ghosts: 3,
    inplay: false,
    startGhost: 11
};

const player = {
    pos: 32,
    speed: 4,
    cool: 0,
    pause: false,
    score: 0,
    live: 1,
    gameOver: true,
    gameWin: false,
    powerUp: false,
    powerCount: 0
};

const createGame = () => {
    for (let i = 0; i < g.ghosts; i++) {
        createGhost();
    }

    tempBoard.forEach((cell) => {
        createSquare(cell);
    });

    for(let i=0;i<g.size;i++) {
        g.x += `${g.h}px `;
    }
    g.grid.style.gridTemplateColumns = g.x;
    g.grid.style.gridTemplateRows = g.x;
    startPosition();
};

const updateScore = () => {
    if (player.live<=0) {
        g.lives.innerHTML = 'GAME OVER';
        player.gameOver = true;
    } else {
        g.score.innerHTML = `Score: ${player.score}`;
        g.lives.innerHTML = `Lives: ${player.live}`;
    }
};

const createSquare = (value) => {
    const div = document.createElement('div');
    div.classList.add('box');
    if(value == 1) {
        div.classList.add('wall');
    }
    
    if(value == 2) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        div.append(dot);
    }
    
    if(value == 3) {
        const dot = document.createElement('div');
        dot.classList.add('super-dot');
        div.append(dot);
    }
    
    if (value == 4) {
        div.classList.add('hideout');
        if (g.startGhost==11) {
            g.startGhost = myBoard.length;
        }
    }

    g.grid.append(div);
    myBoard.push(div);
    div.t = value;
    div.idVal = myBoard.length;
    div.addEventListener('click', (e) => {
        console.dir(div);
    });
};

const findDirection = (a) => {
    return [a.pos % g.size, Math.ceil(a.pos / g.size)];
};

const changeDir = (enemy) => {
    let gg = findDirection(enemy);
    let pp = findDirection(player);
    let ran = Math.floor(Math.random() * 2);
    if (ran == 0) {
        enemy.dx = (gg[0] < pp[0]) ? 2 : 3;
    } else {
        enemy.dx = (gg[1] < pp[1]) ? 1 : 0;
    }
    enemy.counter = (Math.random() * 1) + 2;
};

const startGame = () => {
    myBoard.length = 0;
    ghosts.length = 0;
    player.gameOver = false;
    g.grid.innerHTML = '';
    g.x = '';
    createGame();
    updateScore();
    g.grid.focus();
    g.grid.style.display = 'grid';
    btnStartGame.style.display = 'none';
    g.pacman.style.display = 'block';
    g.pacman.style.backgroundColor = 'yellow';
};

const playerWins = () => {
    player.gameWin = true;
    btnStartGame.style.display = 'block';
};

const endGame = () => {
    player.gameWin = false;
    btnStartGame.style.display = 'block';
};

const gameReset = () => {
    window.cancelAnimationFrame(player.play);
    g.inplay = false;
    player.pause = true;
    if (player.live<=0) {
        player.gameOver = true;
        endGame();
    }
    if (!player.gameOver) {
        setTimeout(startPosition, 3000);
    }
};

const move = () => {
    if (g.inplay) {
        player.cool--;
        if (player.cool < 0) {
            let tempPower = 0;
            if (player.powerUp) {
                player.powerCount--;
                g.pacman.style.backgroundColor = 'red';
                if (player.powerCount < 10) {
                    g.pacman.style.backgroundColor = 'orange';
                    if (player.powerCount % 2) {
                        g.pacman.style.backgroundColor = 'white';
                    }
                }
                if (player.powerCount <= 0) {
                    player.powerUp = false;
                    g.pacman.style.backgroundColor = 'yellow';
                    tempPower = 1;
                }
            }
            ghosts.forEach((ghost) => {
                if (tempPower == 1) {
                    ghost.style.backgroundColor = ghost.defaultColor;
                } else {
                    if (player.powerCount%2) {
                        ghost.style.backgroundColor = 'white';
                    } else {
                        ghost.style.backgroundColor = 'teal';
                    }
                }
                myBoard[ghost.pos].append(ghost);
                ghost.counter--;
                
                let oldPosition = ghost.pos;
                if (ghost.counter <= 0) {
                    changeDir(ghost);
                } else {
                    if (ghost.dx == 0) {
                        ghost.pos -= g.size;
                    } else if (ghost.dx == 1) {
                        ghost.pos += g.size;
                    } else if (ghost.dx == 2) {
                        ghost.pos += 1;
                    } else if (ghost.dx == 3) {
                        ghost.pos -= 1;
                    }
                }

                if (ghost.stopped>0) {
                    ghost.stopped--;
                    ghost.pos = oldPosition;
                }

                if (player.pos == ghost.pos) {
                    // console.log('catched by: ', ghost.namer);
                    if (player.powerCount > 0) {
                        player.score += 100;
                        let radomRegenerateSpot = Math.floor(Math.random() * 40);
                        // ghost.pos = startPositionPlayer(radomRegenerateSpot);
                        ghost.stopped = 100;
                        ghost.pos = g.startGhost;
                    } else {
                        player.live--;
                        gameReset();
                    }
                    updateScore();
                }

                let valGhost = myBoard[ghost.pos];

                if (valGhost.t == 1) {
                    ghost.pos = oldPosition;
                    changeDir(ghost);
                }
                if (ghost.stopped>0) {
                    ghost.stopped--;
                    ghost.pos = startPositionPlayer(g.startGhost);
                }
                myBoard[ghost.pos].append(ghost);
            });

            let tempPos = player.pos;

            if (keyz.ArrowRight) {
                player.pos += 1;
                g.eye.style.left = '20%';
                g.mouth.style.left = '60%';
            } else if (keyz.ArrowLeft) {
                player.pos -= 1;
                g.eye.style.left = '60%';
                g.mouth.style.left = '0%';
            } else if (keyz.ArrowUp) {
                player.pos -= g.size;
            } else if (keyz.ArrowDown) {
                player.pos += g.size;
            }
            let newPlace = myBoard[player.pos];
            if (newPlace.t == 1 || newPlace.t == 4) {
                // console.log('wall');
                player.pos = tempPos;
            }
            
            if (newPlace.t == 2) {
                let tempDots = document.getElementsByClassName('dot');
                myBoard[player.pos].innerHTML = '';
                if (tempDots.length == 0) {
                    playerWins();
                }
                player.score++;
                updateScore();
                newPlace.t = 0;
            }
            
            if (newPlace.t == 3) {
                player.powerCount = 100;
                player.powerUp = true;
                console.log('powerUp');
                myBoard[player.pos].innerHTML = '';
                player.score += 10;
                updateScore();
                newPlace.t = 0;
            }

            if (newPlace != tempPos) {
                if (player.tog) {
                    g.mouth.style.height = '30%';
                    player.tog = false;
                } else {
                    g.mouth.style.height = '10%';
                    player.tog = true;
                }
            }

            player.cool = player.speed;
            console.log(newPlace.t);
        }

        if (!player.pause) {
            myBoard[player.pos].append(g.pacman);
            player.play = requestAnimationFrame(move);
        }
    }
};

const createGhost = () => {
    let newGhost = g.ghost.cloneNode(true);
    newGhost.pos = g.startGhost;
    newGhost.style.display = 'block';
    newGhost.counter = 0;
    newGhost.defaultColor = board[ghosts.length];
    newGhost.dx = Math.floor(Math.random() * 4);
    newGhost.style.backgroundColor = board[ghosts.length];
    newGhost.style.opacity = 0.8;
    newGhost.namer = `${board[ghosts.length]}y`;
    ghosts.push(newGhost);
};

const startPositionPlayer = (position) => {
    if (myBoard[position].t != 1) {
        return position;
    }
    return startPositionPlayer(position + 1);
};

const startPosition = () => {
    player.pause = false;
    let firstStartPosition = 20;
    player.pos = startPositionPlayer(firstStartPosition);
    myBoard[player.pos].append(g.pacman);
    ghosts.forEach((ghost, index) => {
        let temp = g.startGhost;
        ghost.pos = startPositionPlayer(temp);
        myBoard[ghost.pos].append(ghost);
    });
};

const boardBuilder = () => {
    tempBoard.length = 0;
    let boxSize = (document.documentElement.clientHeight < document.documentElement.clientWidth) ? document.documentElement.clientHeight : document.documentElement.clientWidth;
    g.h = (boxSize / g.size) - (boxSize / (g.size * 5));
    let tog = false;
    for (let x = 0; x < g.size; x++) {
        let wallz = 0;
        for (let y = 0; y < g.size; y++){
            let val = 2;
            wallz--;
            if ((wallz>0) && ((x-1)%2)) { 
                val = 1;
            } else {
                wallz = Math.floor(Math.random() * (g.size / 2));
            }
            
            if (x == 1 || x == (g.size - 3) || y == 1 || y == (g.size - 2)) {
                val = 2;
            }

            if (x == (g.size - 2)) {
                if (!tog) {
                    g.startGhost = tempBoard.length;
                    tog = true;
                }
                val = 4;
            }

            if ((y == 3 && x == 1) || ((y == (g.size - 4)) && x == 1)) {
                if (x==1 || (x==(g.size-3))) {
                    val = 3;
                }
            }
            
            if (x==0 || x==(g.size-2) || y==0 || y==(g.size-1)) {
                val = 1;
            }
            tempBoard.push(val);
        }
    }
    startGame();
};

document.addEventListener('DOMContentLoaded', () => {
    g.grid = document.getElementsByClassName('grid')[0];
    g.pacman = document.getElementsByClassName('pacman')[0];
    g.eye = document.getElementsByClassName('eye')[0];
    g.mouth = document.getElementsByClassName('mouth')[0];
    g.ghost = document.getElementsByClassName('ghost')[0];
    g.score = document.getElementsByClassName('score')[0];
    g.lives = document.getElementsByClassName('live')[0];
    g.pacman.style.display = 'none';
    g.ghost.style.display = 'none';
    g.grid.style.display = 'none';
});

document.addEventListener('keydown', (e) => {
    if (e.code in keyz) {
        keyz[e.code] = true;
    }
    if (!g.inplay && !player.pause) {
        player.play = requestAnimationFrame(move);
        g.inplay = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code in keyz) {
        keyz[e.code] = false;
    }
});

btnStartGame.addEventListener('click', (e) => boardBuilder());

class Board{} 
class Characters {}