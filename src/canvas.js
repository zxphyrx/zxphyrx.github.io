const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

ctx.imageSmoothingEnabled = false;

let balls = [];

let mousePos = {
    x: false,
    y: false
}

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
    return Math.floor(randomRange(min, max));
}

function drawBall(ball) {
    ctx.globalAlpha = ball.opacity;
    ctx.shadowColor = "lightblue";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
    ctx.globalAlpha = 1;
}

function newBall() {
    balls.push({
        x: randomRange(0, canvas.width),
        y: randomRange(0, canvas.height),
        speed: randomRange(0.1, 0.5),
        opacity: randomRange(0.1, 0.5),
        direction: randomRange(0, Math.PI * 2),
        size: 5,
        attracted: false,
        threshold: 200
    })
}

for(let i = 0; i < 10; i++) {
    newBall();
}

function getDistance(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function getAngle(ball) {
    return Math.atan2(mousePos.y - ball.y, mousePos.x - ball.x);
}

function moveBall(ball) {
    return {
        x: ball.x + ball.speed * Math.cos(ball.direction),
        y: ball.y + ball.speed * Math.sin(ball.direction)
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    balls.forEach((ball, index) => {
        if(getDistance(ball, mousePos) < ball.threshold) {
            ball.direction = getAngle(ball, mousePos);
            if(!ball.attracted) {
                ball.attracted = true;
                ball.opacity = randomRange(0.6, 8);
            }
        } else {
            if(ball.attracted) {
                ball.attracted = false;
                ball.direction = randomRange(0, Math.PI * 2);
                ball.opacity = randomRange(0.1, 0.5);
            }
        }

        let newPos = moveBall(ball);

        ball.x = newPos.x;
        ball.y = newPos.y;
        
        if(ball.x - ball.size > canvas.width || ball.x - ball.size < 0 || ball.y - ball.size > canvas.height || ball.y - ball.size < 0 || ball.opacity < 0) {
            balls.splice(index, 1);
            newBall();
        } else {
            drawBall(ball);
        }
    })

    requestAnimationFrame(animate);
}

animate();

document.addEventListener("mousemove", (event) => {
    const canvasRect = canvas.getBoundingClientRect();
    mousePos.x = event.clientX - canvasRect.left;
    mousePos.y = event.clientY - canvasRect.top;
})

document.addEventListener("mouseenter", (event) => {
    const canvasRect = canvas.getBoundingClientRect();
    mousePos.x = event.clientX - canvasRect.left;
    mousePos.y = event.clientY - canvasRect.top;
})

document.addEventListener("mouseleave", () => {
    mousePos.x = false;
})