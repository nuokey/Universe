const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const title = document.getElementById("title");

const score = document.getElementById("score");

let animationId;
let pastTime;

let particles = [];

let distance;
let sin;



for (let i = 0; i < 500; i++) {
    particles.push([getRandomInt(canvas.width), getRandomInt(canvas.height)]);
}

distance = Math.sqrt((particles[0][0] - particles[1][0])**2 + (particles[0][1] - particles[1][1])**2);
console.log(distance);

sin = Math.abs(particles[0][1] - particles[1][1]) / distance;
console.log(sin);

window.onload = startAnimation;


function startAnimation() {
	frame();
	pastTime = 0;
}

function frame() {
	animationId = requestAnimationFrame(frame);

	let time = Date.now();
	let delta = time - pastTime;
	let fps = Math.floor(1000 / delta);

	if (fps <= 1) {
		draw();
		pastTime = Date.now();
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    particles.forEach(e => {
        ctx.fillRect(e[0], e[1], 1, 1);

        particles.forEach(object => {
            distance = Math.sqrt((object[0] - e[0])**2 + (object[1] - e[1])**2);
            // console.log(distance);
            sin = (e[1] - object[1]) / distance;
            // console.log(sin);
            e[1] += 1;
        });
    });
}

canvas.addEventListener('mousemove', function (e) {
    y1 = e.pageY - e.target.offsetTop;
    // y2 = y1;
})

document.addEventListener('keydown', function (event) {
    if (event.key == "ArrowUp") {
        gravity -= 0.1;
    }
    if (event.key == "ArrowDown") {
        gravity += 0.1;
    }
    if (event.key == "ArrowRight") {
        wind += 0.1;
    }
    if (event.key == "ArrowLeft") {
        wind -= 0.1;
    }
})

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
  