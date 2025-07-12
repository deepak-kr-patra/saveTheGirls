const girl = document.getElementById("girl");
const thief1 = document.getElementById("thief");
const thief2 = document.getElementById("thief2");
const hammer = document.getElementById("hammer");

let girlX = 500;
let thief1X = 1000; // from right → left
let thief2X = 0;    // from left → right

let hammerX = 100;
let hammerY = 450;

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

function isColliding(r1, r2, paddingX = 0.0) {
    const a = shrinkRect(r1);
    const b = shrinkRect(r2, paddingX);
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

    if (!thief1Hit && isColliding(girlRect, thief1Rect, 0.2)) {
        endGame("Thief 1 caught the girl!");
        girl.src = "./assets/girlStandingLeft.png";
        thief1.src = "./assets/thiefStandingLeft.png";
        gameOver = true;
        return;
    }

    if (!thief2Hit && isColliding(girlRect, thief2Rect, 0.2)) {
        endGame("Thief 2 caught the girl!");
        girl.src = "./assets/girlStandingLeft.png";
        thief2.src = "./assets/thiefStandingLeft.png";
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
            hammerY -= step;
            break;
        case "ArrowDown":
            hammerY += step;
            break;
        case "ArrowLeft":
            hammerX -= step;
            break;
        case "ArrowRight":
            hammerX += step;
            break;
    }

    hammerX = clamp(hammerX, 0, window.innerWidth - hammer.width);
    hammerY = clamp(hammerY, 0, window.innerHeight - hammer.height);

    hammer.style.left = hammerX + "px";
    hammer.style.top = hammerY + "px";

    const hammerRect = hammer.getBoundingClientRect();
    const t1Rect = thief1.getBoundingClientRect();
    const t2Rect = thief2.getBoundingClientRect();

    if (!thief1Hit && isColliding(hammerRect, t1Rect)) {
        console.log("You hit thief 1!");
        thief1.src = "./assets/thiefStandingLeft.png";
        thief1Hit = true;
    }

    if (!thief2Hit && isColliding(hammerRect, t2Rect)) {
        console.log("You hit thief 2!");
        thief2.src = "./assets/thiefStandingLeft.png";
        thief2Hit = true;
    }

    // Optional: Win condition
    if (thief1Hit && thief2Hit) {
        showMessage("You saved the girl!", "green");
        gameOver = true;
    }
});

updatePositions();

// messagewa
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
