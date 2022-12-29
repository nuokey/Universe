const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const title = document.getElementById("title");

const score = document.getElementById("score");

let animationId;
let pastTime;

let particles = [];
let atoms = [];

let distance;

let maxFps = 60;

let time = 0;

let startParticles = 1;

for (let i = 0; i < startParticles; i++) {
    // 0, 1 - координаты
    // 2, 3 - скорость
    // 4 - тип
    // 5 - время жизни
    // 6 - время распада
    particles.push([canvas.width / 2, canvas.height / 2, 0, 0, getRandomInt(0), 0, getRandomArbitrary(100, 10000)]);
}

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

	if (fps <= maxFps) {
		draw();
		pastTime = Date.now();
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

    time += 1;
    
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    particlesMovement();
    atomsMovement();
}

function particlesMovement() {
    particles.forEach(e => {
        e[5] += 1;
        if (e[4] == 0) {
            ctx.fillStyle = "green";
        }
        else if (e[4] == 1) {
            ctx.fillStyle = "red";
        }
        else if (e[4] == 2) {
            ctx.fillStyle = "blue";
        }
        ctx.fillRect(e[0], e[1], 1, 1);
        e[0] += e[2];
        e[1] += e[3];

        if (e[0] > canvas.width) {
            e[0] = 0;
        }
        if (e[1] > canvas.height) {
            e[1] = 0;
        }
        if (e[0] < 0) {
            e[0] = canvas.width;
        }
        if (e[1] < 0) {
            e[1] = canvas.height;
        }

        if (e[4] == 0 && e[5] >= e[6]) {
            particles.push([e[0] + 5, e[1], e[2], e[3], 1, 0]);
            particles.push([e[0], e[1], -e[2], -e[3], 2, 0]);
            particles.splice(particles.indexOf(e), 1);
        }

        particles.forEach(object => {
                distance = Math.sqrt((object[0] - e[0])**2 + (object[1] - e[1])**2);
                // Кулоновское взаимодействие
                if (distance >= 3 && distance <= 50 && ((e[4] == 1 && object[4] == 2) || (e[4] == 2 && object[4] == 1))) {
                    force = 1 / distance

                    sin = (e[1] - object[1]) / distance;
                    cos = (e[0] - object[0]) / distance;
                    e[3] -= sin * force;
                    e[2] -= cos * force;
                }
                else if (distance < 5 && distance != 0 && e[4] == 1 && object[4] == 2) {
                    
                    // 0, 1 - координаты
                    // 2, 3 - скорость
                    // 4, 5 - состав(протоны, нейтроны)
                    atoms.push([e[0], e[1], e[2], e[3], 1, 0])

                    particles.splice(particles.indexOf(e), 1);
                    particles.splice(particles.indexOf(object), 1);
                }
                else if (distance == 0 && time == 1) {
                    e[3] += getRandomArbitrary(-0.5, 0.5);
                    e[2] += getRandomArbitrary(-0.5, 0.5);
                }
        });

        atoms.forEach(atom => {
            distance = Math.sqrt((atom[0] - e[0])**2 + (atom[1] - e[1])**2);
            if (distance <= 10 && e[4] == 1 && e[5] < 2) {
                atom[5] += 1;
                particles.splice(particles.indexOf(e), 1);
                particles.splice(particles.indexOf(object), 1);
            }
        });
    });
}

function atomsMovement() {
    atoms.forEach(e => {
        ctx.fillStyle = "white";
        ctx.fillRect(e[0], e[1], (e[4] * 2 + e[5]) * 2, (e[4] * 2 + e[5]) * 2);

        e[0] += e[2];
        e[1] += e[3];

        if (e[0] > canvas.width) {
            e[0] = 0;
        }
        if (e[1] > canvas.height) {
            e[1] = 0;
        }
        if (e[0] < 0) {
            e[0] = canvas.width;
        }
        if (e[1] < 0) {
            e[1] = canvas.height;
        }

        atoms.forEach(object => {
            distance = Math.sqrt((object[0] - e[0])**2 + (object[1] - e[1])**2);
            // console.log(distance);
            if (distance >= 10) {
                // Гравитационное взаимодействие

                force = 1 / (distance ** 2)

                sin = (e[1] - object[1]) / distance;
                cos = (e[0] - object[0]) / distance;
                e[3] -= sin * force;
                e[2] -= cos * force;
            }
            else if (e[4] == object[4] == 1 && e[5] == 1 && object[5] == 2) {
                atoms.push([e[0], e[1], e[2], e[3], 2, 2]);
                particles.push([e[0], e[1], getRandomArbitrary(-e[2], e[2]), getRandomArbitrary(-e[3], e[3]), getRandomInt(0), 0, getRandomArbitrary(300, 1000)]);
                atoms.splice(atoms.indexOf(e), 1);
                atoms.splice(atoms.indexOf(object), 1);
                
            }
        });
    });
}

canvas.addEventListener('mousemove', function (e) {
    y1 = e.pageY - e.target.offsetTop;
    // y2 = y1;
})

document.addEventListener('keydown', function (event) {
    if (event.key == "p") {
        if (maxFps == -1) {
            maxFps = 30;
        }
        else {
            maxFps = -1;
        }
    }
})

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
  