const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const scale = 0.5;

const minSpeed = 0.3;
const maxSpeed = 0.5;
const minOpacity = 0.1;
const maxOpacity = 0.2;
const minAttractedOpacity = 0.8;
const maxAttractedOpacity = 1;

canvas.height = window.innerHeight * scale;
canvas.width = window.innerWidth * scale;

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
    ctx.save();

    ctx.shadowColor = "#a5a2e6";
    ctx.shadowBlur = 8;
    ctx.fillStyle = "white";
    ctx.strokeStyle = "#807bff";
    ctx.globalAlpha = ball.opacity;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
}

function newBall() {
    let ball = {
        x: randomRange(0, canvas.width),
        y: randomRange(0, canvas.height),
        speed: randomRange(minSpeed, maxSpeed) * scale,
        opacity: 0,
        maxOpacityOrig: randomRange(minOpacity, maxOpacity),
        maxOpacity: null,
        direction: randomRange(0, Math.PI * 2),
        size: 10 * scale,
        attracted: false,
        threshold: 200 * scale,
        dying: false
    }
    
    ball.maxOpacity = ball.maxOpacityOrig;
    balls.push(ball);
}

function repositionBalls(oldCanvas, canvas) {
    balls.forEach((ball, index) => {
        if(oldCanvas.width != canvas.width) {
            ball.x *= canvas.width / oldCanvas.width;
        }
        if(oldCanvas.height != canvas.height) {
            ball.y *= canvas.height / oldCanvas.height;
        }
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
        if(mousePos.x && getDistance(ball, mousePos) < ball.threshold) {
            ball.direction = getAngle(ball, mousePos);
            if(!ball.attracted) {
                ball.attracted = true;
                ball.maxOpacity = randomRange(minAttractedOpacity, maxAttractedOpacity);
            }
        } else {
            if(ball.attracted) {
                ball.attracted = false;
                ball.direction = randomRange(0, Math.PI * 2);
                ball.maxOpacity = ball.maxOpacityOrig;
            }
        }
        
        if(ball.opacity < ball.maxOpacity) {
            ball.opacity = Math.min(ball.opacity + 0.075, ball.maxOpacity);
        }
        if(ball.opacity > ball.maxOpacity) {
            ball.opacity = Math.max(ball.opacity - 0.075, ball.maxOpacity);
        }

        let newPos = moveBall(ball);

        ball.x = newPos.x;
        ball.y = newPos.y;
        
        if((ball.x - ball.size > canvas.width || ball.x - ball.size < 0 || ball.y - ball.size > canvas.height || ball.y - ball.size < 0) && ball.dying == false) {
            balls.splice(index, 1);
            newBall();
        }

        drawBall(ball);
    })

    requestAnimationFrame(animate);
}

animate();

document.body.addEventListener("mousemove", (event) => {
    const canvasRect = canvas.getBoundingClientRect();
    mousePos.x = (event.clientX - canvasRect.left) * scale;
    mousePos.y = (event.clientY - canvasRect.top) * scale;
})

document.body.addEventListener("mouseenter", (event) => {
    const canvasRect = canvas.getBoundingClientRect();
    mousePos.x = (event.clientX - canvasRect.left) * scale;
    mousePos.y = (event.clientY - canvasRect.top) * scale;
})

document.body.addEventListener("mouseleave", () => {
    mousePos.x = false;
})

window.addEventListener("resize", () => {
    let oldCanvas = {
        height: canvas.height,
        width: canvas.width
    }
    canvas.height = window.innerHeight * scale;
    canvas.width = window.innerWidth * scale;
    repositionBalls(oldCanvas, canvas)
})