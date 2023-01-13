const canvas = document.getElementById('canvas');
const form = document.querySelector('form');
const playersInput = document.querySelector('input');
const playersList = document.querySelector('ul');
const notification = document.querySelector('.notification');
const storagePlayersKey = 'players';

const loadPlayers = () => {
  return JSON.parse(localStorage.getItem(storagePlayersKey)) ?? ['p1', 'p2'];
}

const savePlayers = (players) => {
  localStorage.setItem(storagePlayersKey, JSON.stringify(players));
}

let players = loadPlayers();
let colors = Array(players.length).fill("#f4b84d");

let startAngle = 0 / 180;
let arc = (2 * Math.PI) / colors.length;

let spinTime = 0;
let spinTimeTotal = 0;
const textColor = '#fff';

let ctx;
const winner = document.querySelector('.winner');

function drawRouletteWheel() {
  if (canvas.getContext) {
    const outsideRadius = 200;
    const textRadius = 120;
    const insideRadius = 40;

    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 500, 500);
    ctx.font = 'bold 18px Helvetica, Arial';

    for (let i = 0; i < colors.length; i++) {
      const angle = startAngle + i * arc;
      ctx.beginPath();
      ctx.strokeStyle = '#412b6d';
      ctx.lineWidth = 16;
      ctx.arc(250, 250, 200, angle, angle + arc, false);
      ctx.stroke();
      ctx.fillStyle = colors[i];
      ctx.beginPath();
      ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
      ctx.strokeStyle = '#412b6d';
      ctx.lineWidth = 8;
      ctx.lineTo(250, 250);
      if (i === colors.length - 1) {
        ctx.beginPath();
        ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
        ctx.strokeStyle = '#412b6d';
        ctx.lineWidth = 4;
        ctx.lineTo(250, 250);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fill();
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.strokeStyle = '#412b6d';
      ctx.arc(250, 250, insideRadius, angle, angle + arc, false);
      ctx.lineWidth = 5;
      ctx.stroke();

      ctx.save();
      ctx.fillStyle = textColor;
      ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius,
        250 + Math.sin(angle + arc / 2) * textRadius);
      ctx.rotate((angle + arc / 2 + Math.PI / 2) + 30);
      const text = players[i];
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    }

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.arc(250, 250, 38, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();

    //Arrow
    ctx.save();
    const arrowImage = document.getElementById('arrow');
    ctx.beginPath();
    // ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.drawImage(arrowImage, 250 - 4 - 25, 250 - (outsideRadius + 5) - 25, 50, 50);
    // ctx.drawImage(arrowImage, 250 - (outsideRadius + 5) - 25, 250 - 25, 50, 50);
    ctx.restore();

    // center logo
    const logoImage = document.getElementById('center-logo');
    ctx.beginPath();
    // ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.drawImage(logoImage, 250 - 25, 250 - 25, 50, 50);

  }
}

let spinAngleStart;

function spin() {
  spinAngleStart = Math.floor(Math.random() * 360);
  spinTime = 0;
  spinTimeTotal = 4000;
  rotateWheel();
}

function rotateWheel() {
  spinTime += 30;
  if (spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  const spinAngle = spinAngleStart - easeOut(spinTime, 0.3, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  drawRouletteWheel();
  requestAnimationFrame(rotateWheel);
}

function stopRotateWheel() {
  winner.textContent = '';
  const degrees = startAngle * 180 / Math.PI + 90;
  const arcd = arc * 180 / Math.PI;
  const index = Math.floor((360 - degrees % 360) / arcd);
  winner.textContent = players[index];
}

function easeOut(t, b, c, d) {
  const ts = (t /= d) * t;
  const tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
}

drawRouletteWheel();

function renderPlayers() {
  playersList.innerHTML = '';
  playersList.innerHTML = players.reduce((markup, player) => {
    markup += `<li>${player}<button>+</button></li>`;
    return markup
  }, '')
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!playersInput.value) return;
  if (players.at(0) === 'p1' && players.at(1) === 'p2') {
    players = [];
  }
  const newPlayers = playersInput.value.split(',');
  players = [...newPlayers, ...players];
  savePlayers(players);
  colors = Array(players.length).fill("#f4b84d");
  arc = (2 * Math.PI) / colors.length;
  renderPlayers();
  renderNotification()
  drawRouletteWheel()
})

playersList.addEventListener('click', e => {
  if (e.target.nodeName === 'BUTTON') {
    const index = [].slice.call(e.target.parentElement.parentNode.children).indexOf(e.target.parentElement)
    players.splice(index, 1);
    savePlayers(players)
    colors = Array(players.length).fill("#f4b84d");
    arc = (2 * Math.PI) / colors.length;
    renderPlayers()
    drawRouletteWheel()
    renderNotification()
  }
})

function renderNotification () {
    switch (players.length) {
      case 0:
        canvas.style.display = 'none';
        notification.innerText = 'Add at least two persons';
        break;
      case 1:
        canvas.style.display = 'none';
        notification.innerText = 'Add one more person';
        break;
      default:
        canvas.style.display = 'block';
        notification.innerText = '';
        break;
    }
}

renderPlayers();
renderNotification();
