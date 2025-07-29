const girl = document.getElementById("girl");
const thief1 = document.getElementById("thief");
const thief2 = document.getElementById("thief2");
const glove = document.getElementById("glove");

const gameOverModal = document.getElementById('gameOverModal');

let girlX = 500;
let thief1X = 1000; // from right to left
let thief2X = 0;    // from left to right

let gloveX = 100;
let gloveY = 450;

let thief1Hit = false;
let thief2Hit = false;
let gameOver = false;

const STEP = 30;
const GIRL_SPEED = 0.5;
const THIEF1_SPEED = 1.5;
const THIEF2_SPEED = 1.0;

function shrinkRect(rect, paddingXPercent = 0.35, paddingYPercent = 0.0) {
    const shrinkX = rect.width * paddingXPercent;
    const shrinkY = rect.height * paddingYPercent;
    return {
        left: rect.left + shrinkX,
        right: rect.right - shrinkX,
        top: rect.top + shrinkY,
        bottom: rect.bottom - shrinkY
    };
}

function isColliding(r1, r2, r1PaddingX = 0.0, r2PaddingX = 0.0) {
    const a = shrinkRect(r1, r1PaddingX);
    const b = shrinkRect(r2, r2PaddingX);
    return !(
        a.right < b.left ||
        a.left > b.right ||
        a.bottom < b.top ||
        a.top > b.bottom
    );
}

function updatePositions() {
    if (gameOver) return;

    girlX -= GIRL_SPEED;
    girl.style.left = girlX + "px";

    // Move thief 1 (leftward) if not hit
    if (!thief1Hit) {
        thief1X -= THIEF1_SPEED;
        thief1.style.left = thief1X + "px";
    }

    // Move thief 2 (rightward) if not hit
    if (!thief2Hit) {
        thief2X += THIEF2_SPEED;
        thief2.style.left = thief2X + "px";
    }

    const girlRect = girl.getBoundingClientRect();
    const thief1Rect = thief1.getBoundingClientRect();
    const thief2Rect = thief2.getBoundingClientRect();

    if (!thief1Hit && isColliding(girlRect, thief1Rect, 0.35, 0.2)) {
        endGame("Thief 1 caught the girl!");
        girl.src = "./assets/girlStandingLeft.png";
        thief1.src = "./assets/thiefStandingLeft.png";
        return;
    }

    if (!thief2Hit && isColliding(girlRect, thief2Rect, 0.35, 0.45)) {
        endGame("Thief 2 caught the girl!");
        girl.src = "./assets/girlStandingLeft.png";
        thief2.src = "./assets/thiefStandingRight.png";
        return;
    }

    requestAnimationFrame(updatePositions);
}

function endGame(message) {
    console.log(message);
    gameOver = true;
    gameOverModal.textContent = message;
    gameOverModal.style.transform = "scale(1)";
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

function hitThief(thief) {
    thief.src = "./assets/explosion.png";
    thief.style.transition = "opacity 0.3s ease";
    thief.style.opacity = "0";
    setTimeout(() => {
        thief.style.display = "none";
    }, 300);
    return true;
}

document.addEventListener("keydown", (e) => {
    if (gameOver) return;

    const step = 30;
    switch (e.key) {
        case "ArrowUp":
            gloveY -= step;
            break;
        case "ArrowDown":
            gloveY += step;
            break;
        case "ArrowLeft":
            gloveX -= step;
            break;
        case "ArrowRight":
            gloveX += step;
            break;
    }

    gloveX = clamp(gloveX, 0, window.innerWidth - glove.getBoundingClientRect().width);
    gloveY = clamp(gloveY, 0, window.innerHeight - glove.getBoundingClientRect().height);

    glove.style.left = gloveX + "px";
    glove.style.top = gloveY + "px";

    const gloveRect = glove.getBoundingClientRect();
    const thief1Rect = thief1.getBoundingClientRect();
    const thief2Rect = thief2.getBoundingClientRect();

    if (!thief1Hit && isColliding(gloveRect, thief1Rect, 0.05, 0.2)) {
        console.log("You hit thief 1!");
        thief1Hit = hitThief(thief1);
    }

    if (!thief2Hit && isColliding(gloveRect, thief2Rect, 0.05, 0.45)) {
        console.log("You hit thief 2!");
        thief2Hit = hitThief(thief2);
    }

    if (thief1Hit && thief2Hit) {
        endGame("You saved the girl!");
    }
});

document.addEventListener("mousemove", (e) => {
    if (gameOver) return;

    // Adjust to center the glove on the cursor
    const gloveRect = glove.getBoundingClientRect();
    gloveX = e.clientX - gloveRect.width / 2;
    gloveY = e.clientY - gloveRect.height / 2;

    // Keep glove within screen bounds
    gloveX = clamp(gloveX, 0, window.innerWidth - gloveRect.width);
    gloveY = clamp(gloveY, 0, window.innerHeight - gloveRect.height);

    // Update glove position
    glove.style.left = gloveX + "px";
    glove.style.top = gloveY + "px";

    // Check for collision with thieves
    const gloveRectUpdated = glove.getBoundingClientRect();
    const thief1Rect = thief1.getBoundingClientRect();
    const thief2Rect = thief2.getBoundingClientRect();

    if (!thief1Hit && isColliding(gloveRectUpdated, thief1Rect, 0.05, 0.2)) {
        console.log("You hit thief 1!");
        thief1Hit = hitThief(thief1);
    }

    if (!thief2Hit && isColliding(gloveRectUpdated, thief2Rect, 0.05, 0.45)) {
        console.log("You hit thief 2!");
        thief2Hit = hitThief(thief2);
    }

    if (thief1Hit && thief2Hit) {
        endGame("You saved the girl!");
    }
});

document.addEventListener("keydown", (e) => {
    if (gameOver && e.key.toLowerCase() === 'r') {
        gameOverModal.style.transform = "scale(0)";
        location.reload();
    }
});

updatePositions();
