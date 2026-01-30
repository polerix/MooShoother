const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;

const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 30,
    speed: 5,
    dx: 0
};

const bullets = [];
const enemies = [];

function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
    ctx.fillStyle = 'yellow';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function drawEnemies() {
    ctx.fillStyle = 'red';
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function movePlayer() {
    player.x += player.dx;

    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

function moveBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

function moveEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
            // Game over
            gameOver();
        }
    });
}

function createEnemy() {
    const size = Math.random() * 20 + 20;
    const x = Math.random() * (canvas.width - size);
    const y = -size;
    const speed = Math.random() * 2 + 1;

    enemies.push({
        x,
        y,
        width: size,
        height: size,
        speed
    });
}

function detectCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                score++;
            }
        });
    });

    enemies.forEach(enemy => {
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            gameOver();
        }
    });
}

function gameOver() {
    alert(`Game Over! Your score: ${score}`);
    document.location.reload();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawBullets();
    drawEnemies();
    drawScore();

    movePlayer();
    moveBullets();
    moveEnemies();

    detectCollisions();

    requestAnimationFrame(update);
}

function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'd') {
        player.dx = player.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        player.dx = -player.speed;
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        bullets.push({
            x: player.x + player.width / 2 - 2.5,
            y: player.y,
            width: 5,
            height: 10,
            speed: 7
        });
    }
}

function keyUp(e) {
    if (
        e.key === 'ArrowRight' ||
        e.key === 'd' ||
        e.key === 'ArrowLeft' ||
        e.key === 'a'
    ) {
        player.dx = 0;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

setInterval(createEnemy, 2000);
update();