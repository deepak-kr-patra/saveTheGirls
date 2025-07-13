const girl = document.getElementById("girl");
const thief1 = document.getElementById("thief");
const thief2 = document.getElementById("thief2");
const bat = document.getElementById("bat");

let girlX = 500;
let thief1X = 1000; // from right → left
let thief2X = 0;    // from left → right

let batX = 100;
let batY = 450;

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
    showMessage(message);
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

document.addEventListener("keydown", (e) => {
    if (gameOver) return;

    const step = 30;
    switch (e.key) {
        case "ArrowUp":
            batY -= step;
            break;
        case "ArrowDown":
            batY += step;
            break;
        case "ArrowLeft":
            batX -= step;
            break;
        case "ArrowRight":
            batX += step;
            break;
    }

    batX = clamp(batX, 0, window.innerWidth - bat.getBoundingClientRect().width);
    batY = clamp(batY, 0, window.innerHeight - bat.getBoundingClientRect().height);

    bat.style.left = batX + "px";
    bat.style.top = batY + "px";

    const batRect = bat.getBoundingClientRect();
    const thief1Rect = thief1.getBoundingClientRect();
    const thief2Rect = thief2.getBoundingClientRect();

    if (!thief1Hit && isColliding(batRect, thief1Rect, 0.45, 0.2)) {
        console.log("You hit thief 1!");
        thief1.style.transition = "opacity 0.3s ease";
        thief1.style.opacity = "0";
        setTimeout(() => {
            thief1.style.display = "none";
        }, 300);
        thief1Hit = true;
        // bat.classList.add("bat-swing");
        // setTimeout(() => bat.classList.remove("bat-swing"), 200);
    }

    if (!thief2Hit && isColliding(batRect, thief2Rect, 0.45, 0.45)) {
        console.log("You hit thief 2!");
        thief2.style.transition = "opacity 0.3s ease";
        thief2.style.opacity = "0";
        setTimeout(() => {
            thief2.style.display = "none";
        }, 300);
        thief2Hit = true;
    }

    if (thief1Hit && thief2Hit) {
        showMessage("You saved the girl!", "green");
        gameOver = true;
    }
});

document.addEventListener("mousemove", (e) => {
    if (gameOver) return;

    // Adjust to center the bat on the cursor
    const batRect = bat.getBoundingClientRect();
    batX = e.clientX - batRect.width / 2;
    batY = e.clientY - batRect.height / 2;

    // Keep bat within screen bounds
    batX = clamp(batX, 0, window.innerWidth - batRect.width);
    batY = clamp(batY, 0, window.innerHeight - batRect.height);

    // Update bat position
    bat.style.left = batX + "px";
    bat.style.top = batY + "px";

    // Check for collision with thieves
    const batRectUpdated = bat.getBoundingClientRect();
    const thief1Rect = thief1.getBoundingClientRect();
    const thief2Rect = thief2.getBoundingClientRect();

    if (!thief1Hit && isColliding(batRectUpdated, thief1Rect, 0.45, 0.2)) {
        console.log("You hit thief 1!");
        thief1.style.transition = "opacity 0.3s ease";
        thief1.style.opacity = "0";
        setTimeout(() => {
            thief1.style.display = "none";
        }, 300);
        thief1Hit = true;
    }

    if (!thief2Hit && isColliding(batRectUpdated, thief2Rect, 0.45, 0.45)) {
        console.log("You hit thief 2!");
        thief2.style.transition = "opacity 0.3s ease";
        thief2.style.opacity = "0";
        setTimeout(() => {
            thief2.style.display = "none";
        }, 300);
        thief2Hit = true;
    }

    if (thief1Hit && thief2Hit) {
        showMessage("You saved the girl!", "green");
        gameOver = true;
    }
});

updatePositions();

// message
function showMessage(text, color = "red") {
    const msg = document.createElement("div");
    msg.innerText = text;
    msg.style.position = "fixed";
    msg.style.top = "50%";
    msg.style.left = "50%";
    msg.style.transform = "translate(-50%, -50%)";
    msg.style.background = color;
    msg.style.color = "white";
    msg.style.fontSize = "2rem";
    msg.style.padding = "20px";
    msg.style.borderRadius = "10px";
    document.body.appendChild(msg);
}

document.addEventListener("keydown", (e) => {
    if (gameOver && e.key.toLowerCase() === 'r') {
        location.reload();
    }
});
