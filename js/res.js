let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let W, H;

function setCanvasSize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
}

setCanvasSize();
window.addEventListener("resize", setCanvasSize);

const maxConfettis = 150;
const particles = [];

const possibleColors = [
    "DodgerBlue",
    "OliveDrab",
    "Gold",
    "Pink",
    "SlateBlue",
    "LightBlue",
    "Gold",
    "Violet",
    "PaleGreen",
    "SteelBlue",
    "SandyBrown",
    "Chocolate",
    "Crimson"
];

function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function confettiParticle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H - H;
    this.r = randomFromTo(11, 33);
    this.d = Math.random() * maxConfettis + 11;
    this.color =
        possibleColors[Math.floor(Math.random() * possibleColors.length)];
    this.tilt = Math.floor(Math.random() * 33) - 11;
    this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
    this.tiltAngle = 0;

    this.draw = function () {
        context.beginPath();
        context.lineWidth = this.r / 2;
        context.strokeStyle = this.color;
        context.moveTo(this.x + this.tilt + this.r / 3, this.y);
        context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
        return context.stroke();
    };
}

function Draw() {
    const results = [];

    requestAnimationFrame(Draw);

    context.clearRect(0, 0, W, H);

    for (var i = 0; i < maxConfettis; i++) {
        results.push(particles[i].draw());
    }

    let particle = {};
    let remainingFlakes = 0;
    for (var i = 0; i < maxConfettis; i++) {
        particle = particles[i];

        particle.tiltAngle += particle.tiltAngleIncremental;
        particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
        particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

        if (particle.y <= H) remainingFlakes++;

        if (particle.x > W + 30 || particle.x < -30 || particle.y > H) {
            particle.x = Math.random() * W;
            particle.y = -30;
            particle.tilt = Math.floor(Math.random() * 10) - 20;
        }
    }

    return results;
}

for (var i = 0; i < maxConfettis; i++) {
    particles.push(new confettiParticle());
} 
 
 
 // Function to get query parameters from the URL
 function getQueryParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return {
        correctAnswers: urlParams.get('correctAnswers'),
        totalQuestions: urlParams.get('totalQuestions')
    };
}

let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let user = document.getElementById('user');
user.innerHTML = `${currentUser.fname} ${currentUser.lname}'s score `;

// Function to display the result
function displayResult() {
    const params = getQueryParams();
    const correctAnswers = params.correctAnswers;
    const totalQuestions = params.totalQuestions;

    // Display the result
    var resultRow = document.getElementById("resultRow");
    var total = document.createElement("td");
    total.textContent = totalQuestions;
    resultRow.appendChild(total);
    var correct = document.createElement("td");
    correct.textContent = correctAnswers;
    resultRow.appendChild(correct);
    var wrong = document.createElement("td");
    wrong.textContent = totalQuestions - correctAnswers;;
    resultRow.appendChild(wrong);
    var img1 = document.getElementsByClassName("img1")[0];
    var img2 = document.getElementsByClassName("img2")[0];
    let heading = document.getElementById('res-heading');
   
    function frameLooper(text) {
        let arr = text.split("");
        let i = 0;

        function addLetter() {
            if (i < arr.length) {
                heading.innerHTML += `<span style= "text-shadow: 5px 5px 5px #ddd">${arr[i]}</span>`;
                i++;
                setTimeout(addLetter, 100);
            }
        }

        addLetter();
    }

    if ((totalQuestions - correctAnswers) > correctAnswers) {
        heading.textContent = "Unfortunately, You Didn't Pass The Exam"
        heading.style.fontSize = "3em";
        heading.style.margin= "2em 0 3em"
        img2.style.display = "block";
        document.getElementById('res-container').style.boxShadow = "0.5rem 0.5rem black, -0.5rem -0.5rem #ccc"
    } else {
        frameLooper("Congratulations");
        img1.style.display = "block";
        Draw();
    }
}


// Call the function to display the result when the page loads
displayResult();







