const character = document.getElementById('character');
const ground = document.getElementById('ground');
const blocksDiv = document.getElementById('blocks');
const holesDiv = document.getElementById('holes');
const enemiesDiv = document.getElementById('enemies');
const goal = document.getElementById('goal');
const gameOver = document.getElementById('game-over');
const gameClear = document.getElementById('game-clear');

let charX = 50;
let charY = 50;
let charVelocityY = 0;
let isJumping = false;
let scrollX = 0;
let gameIsOver = false;

// ブロック、穴、敵キャラの配置
const blocks = [
    { x: 300, y: 50 },
    { x: 600, y: 80 }
];
const holes = [
    { x: 400, width: 50 },
    { x: 700, width: 50 }
];
const enemies = [
    { id: 'enemy1', x: 500, y: 50, alive: true },
    { id: 'enemy2', x: 800, y: 50, alive: true }
];

// ブロック生成
blocks.forEach(block => {
    const blockEl = document.createElement('div');
    blockEl.classList.add('block');
    blockEl.style.left = block.x + 'px';
    blockEl.style.bottom = block.y + 'px';
    blocksDiv.appendChild(blockEl);
});

// 穴生成
holes.forEach(hole => {
    const holeEl = document.createElement('div');
    holeEl.classList.add('hole');
    holeEl.style.left = hole.x + 'px';
    holeEl.style.width = hole.width + 'px';
    holesDiv.appendChild(holeEl);
});

// 敵キャラ生成
enemies.forEach(enemy => {
    const enemyEl = document.createElement('div');
    enemyEl.classList.add('enemy');
    enemyEl.id = enemy.id;
    enemyEl.style.left = enemy.x + 'px';
    enemiesDiv.appendChild(enemyEl);
});

// キー操作
document.addEventListener('keydown', (e) => {
    if (gameIsOver) return;

    if (e.code === 'ArrowRight') {
        charX += 5;
        if (charX > 400) {
            scrollX += 5;
            ground.style.left = -scrollX + 'px';
            blocksDiv.style.left = -scrollX + 'px';
            holesDiv.style.left = -scrollX + 'px';
            enemiesDiv.style.left = -scrollX + 'px';
            goal.style.left = (4000 - scrollX - 50) + 'px';
        }
    }
    if (e.code === 'ArrowLeft' && charX > 0) {
        charX -= 5;
    }
    if (e.code === 'Space' && !isJumping) {
        charVelocityY = 10;
        isJumping = true;
    }
    character.style.left = charX + 'px';
});

// ゲームループ
function gameLoop() {
    if (gameIsOver) return;

    // 重力
    charVelocityY -= 0.5;
    charY += charVelocityY;
    character.style.bottom = charY + 'px';

    // 地面との衝突
    let onBlock = false;
    blocks.forEach(block => {
        const blockX = block.x - scrollX;
        if (charX + 50 > blockX && charX < blockX + 30 && charY <= block.y && charY + charVelocityY >= block.y) {
            charY = block.y;
            charVelocityY = 0;
            isJumping = false;
            onBlock = true;
        }
    });

    if (!onBlock && charY <= 50) {
        charY = 50;
        charVelocityY = 0;
        isJumping = false;
    }

    // 穴に落ちる
    holes.forEach(hole => {
        const holeX = hole.x - scrollX;
        if (charX + 50 > holeX && charX < holeX + hole.width && charY <= 50) {
            gameOver.style.display = 'block';
            gameIsOver = true;
        }
    });

    // 敵との衝突
    enemies.forEach(enemy => {
        if (!enemy.alive) return;
        const enemyX = enemy.x - scrollX;
        const enemyEl = document.getElementById(enemy.id);
        if (charX + 50 > enemyX && charX < enemyX + 30) {
            if (charY > 80 && charVelocityY < 0) { // 上から踏む
                enemy.alive = false;
                enemyEl.style.display = 'none';
            } else if (charY <= 80) { // 横から衝突
                gameOver.style.display = 'block';
                gameIsOver = true;
            }
        }
    });

    // ゴール
    const goalX = 4000 - scrollX - 50;
    if (charX + 50 > goalX && charY <= 150) {
        gameClear.style.display = 'block';
        gameIsOver = true;
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();