document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    const winMessage = document.getElementById('win-message');

    let gameStarted = false;
    let gameWon = false;

    // =============== No Button Avoids Cursor ===============
    // No Button avoids EVERY time you try to click/tap it (works on mobile too)
noBtn.addEventListener('click', (e) => {
    e.preventDefault(); // stop click
    moveNoButton();
});

noBtn.addEventListener('mouseenter', () => {
    moveNoButton();
});

function moveNoButton() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;

    const randomX = Math.floor(Math.random() * (screenWidth - btnWidth));
    const randomY = Math.floor(Math.random() * (screenHeight - btnHeight));

    noBtn.style.position = 'absolute';
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
}


    // =============== Start Game on Yes ===============
    const infoScreen = document.getElementById('info-screen');
const startGameBtn = document.getElementById('start-game-btn');

yesBtn.addEventListener('click', () => {
    // Hide start screen, show info screen
    startScreen.classList.add('hidden');
    infoScreen.classList.remove('hidden');
});

startGameBtn.addEventListener('click', () => {
    if (gameStarted) return;
    gameStarted = true;
    infoScreen.classList.add('hidden');
    document.addEventListener('keydown', movePlayer);
    gameLoop();
});


    // =============== Maze Code ===============
    const maze = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
        [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // exit
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    const cellSize = 40;
    canvas.width = maze[0].length * cellSize;
    canvas.height = maze.length * cellSize;

    let player = { x: 1, y: 1 };

    // Particle system for glowing hearts
let particles = [];

function createParticle(x, y) {
    particles.push({
        x: x * cellSize + cellSize / 2,
        y: y * cellSize + cellSize / 2,
        size: Math.random() * 6 + 6,
        opacity: 1,
        life: 60 // frames until it disappears
    });
}

function drawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = "pink";

        // Simple heart shape (using arc + triangle)
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x - p.size / 2, p.y - p.size / 3, p.size / 3, 0, Math.PI, true);
        ctx.arc(p.x + p.size / 2, p.y - p.size / 3, p.size / 3, 0, Math.PI, true);
        ctx.lineTo(p.x, p.y + p.size / 2);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        // Update particle
        p.y += 0.3;           // slowly fall down
        p.opacity -= 0.015;   // fade out
        p.life--;

        if (p.life <= 0 || p.opacity <= 0) {
            particles.splice(i, 1);
        }
    }
}


    // Draw maze with colorful walls
// Load character sprite
const playerImg = new Image();
playerImg.src = "jasmine.png"; // <-- replace with your file name

// Load exit sprite
const exitImg = new Image();
exitImg.src = "me.png"; // <-- replace with your exit file name

// Draw maze with colorful walls
function drawMaze() {
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === 1) {
                // Gradient romantic walls
                const gradient = ctx.createLinearGradient(0, 0, cellSize, cellSize);
                gradient.addColorStop(0, "#ff8fab"); // pink
                gradient.addColorStop(0.5, "#9d4edd"); // purple
                gradient.addColorStop(1, "#4cc9f0"); // light blue
                ctx.fillStyle = gradient;
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            } else {
                ctx.fillStyle = "#ffe6eb"; // path = soft pink
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }
    }

    // Draw exit image instead of emoji
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(exitImg, 14 * cellSize, 13 * cellSize, cellSize, cellSize);
}

// Draw player as pixel character
function drawPlayer() {
    ctx.imageSmoothingEnabled = false; // keep it pixel sharp
    ctx.drawImage(
        playerImg,
        player.x * cellSize,
        player.y * cellSize,
        cellSize,
        cellSize
    );
}


// Draw player as pixel character
function drawPlayer() {
    ctx.drawImage(
        playerImg,
        player.x * cellSize,
        player.y * cellSize,
        cellSize, // width = same as cell
        cellSize  // height = same as cell
    );
}



    function checkWin() {
    if (!gameWon && player.x === 14 && player.y === 13) {
        gameWon = true;
        winMessage.classList.remove('hidden');
        winMessage.classList.add('visible');
    }
}


    function movePlayer(e) {
        if (gameWon) return;

        let newX = player.x;
        let newY = player.y;

        // Spawn particle at new player position
        createParticle(player.x, player.y);


        switch (e.key) {
            case 'ArrowUp': newY--; break;
            case 'ArrowDown': newY++; break;
            case 'ArrowLeft': newX--; break;
            case 'ArrowRight': newX++; break;
        }

        if (maze[newY] && maze[newY][newX] === 0) {
            player.x = newX;
            player.y = newY;
        }

        checkWin();
    }

    // =============== Mobile Arrow Buttons ===============
document.querySelectorAll("#controls button").forEach(btn => {
    btn.addEventListener("click", () => {
        let dir = btn.getAttribute("data-dir");
        let event = { key: "" };
        if (dir === "up") event.key = "ArrowUp";
        if (dir === "down") event.key = "ArrowDown";
        if (dir === "left") event.key = "ArrowLeft";
        if (dir === "right") event.key = "ArrowRight";
        movePlayer(event);
    });
});

// =============== Swipe Gestures ===============
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener("touchend", (e) => {
    let dx = e.changedTouches[0].clientX - touchStartX;
    let dy = e.changedTouches[0].clientY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) movePlayer({ key: "ArrowRight" });
        else if (dx < -30) movePlayer({ key: "ArrowLeft" });
    } else {
        if (dy > 30) movePlayer({ key: "ArrowDown" });
        else if (dy < -30) movePlayer({ key: "ArrowUp" });
    }
});


    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMaze();
        drawPlayer();
        drawParticles();
        if (!gameWon) requestAnimationFrame(gameLoop);
    }

    
// =============== Win Message Dialogue Extension ===============
const dialogues = [
    { text: "“Ô yayyyy em bé tới cứu anh neee, anh yêu emmmmm💕”", img: "shoulderLevel.png" },
    { text: "“Ô tr oi sao giờ bé mới tới. huhu. anh nhớ em 😘”", img: "shoulderLevel.png" },
    { text: "“Chơm chơm ne, ôm ôm ne, anh yêu em bé của anh nhiu lắm ạaaaaaaaa 💖”", img: "shoulderLevel.png" } // <- new picture here
];

let dialogueIndex = 0;
const dialogueElement = document.getElementById("dialogue");
const chatImg = document.getElementById("chat-img"); // portrait image
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

nextBtn.addEventListener("click", () => {
    dialogueIndex++;
    if (dialogueIndex < dialogues.length) {
        dialogueElement.textContent = dialogues[dialogueIndex].text;
        chatImg.src = dialogues[dialogueIndex].img; // update picture
    } else {
        nextBtn.classList.add("hidden"); // hide next
        restartBtn.classList.remove("hidden"); // show restart
    }
});

});

