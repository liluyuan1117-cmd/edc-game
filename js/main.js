// 玩具切换
document.querySelectorAll('.toy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const toyId = btn.dataset.toy;
        if (btn.disabled) return;
        document.querySelectorAll('.toy-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.toy-container').forEach(c => c.classList.remove('active'));
        document.getElementById(toyId).classList.add('active');
    });
});

// ========== 指尖陀螺 ==========
let currentRotation = 0;
let rotationVelocity = 0;
let isSpinning = false;
let lastTime = 0;
const spinner = document.getElementById('fidget-spinner');

function animateSpinner(timestamp) {
    if (!lastTime) lastTime = timestamp;
    lastTime = timestamp;
    currentRotation += rotationVelocity;
    spinner.style.transform = `rotate(${currentRotation}deg)`;
    rotationVelocity *= 0.985;
    if (Math.abs(rotationVelocity) > 0.1) {
        requestAnimationFrame(animateSpinner);
    } else {
        isSpinning = false;
        rotationVelocity = 0;
    }
}

function spinSpinner(velocity = 15) {
    if (!isSpinning) {
        isSpinning = true;
        lastTime = 0;
        rotationVelocity = velocity;
        requestAnimationFrame(animateSpinner);
    }
}

spinner.addEventListener('click', (e) => {
    const rect = spinner.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const distanceFromCenter = Math.abs(e.clientX - centerX);
    const velocity = 10 + (distanceFromCenter / rect.width) * 20;
    spinSpinner(velocity);
});

let startX = 0, startTime = 0;
spinner.addEventListener('mousedown', (e) => { startX = e.clientX; startTime = Date.now(); });
spinner.addEventListener('mouseup', (e) => {
    const diff = e.clientX - startX;
    const duration = Date.now() - startTime;
    if (Math.abs(diff) > 20 && duration < 300) {
        spinSpinner(Math.min(Math.abs(diff) / duration * 10, 30));
    }
});
spinner.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; startTime = Date.now(); }, { passive: true });
spinner.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    const duration = Date.now() - startTime;
    if (Math.abs(diff) > 20 && duration < 300) {
        spinSpinner(Math.min(Math.abs(diff) / duration * 10, 30));
    }
}, { passive: true });

// ========== 按压泡泡 ==========
const popitBoard = document.getElementById('popit-board');
const popitReset = document.getElementById('popit-reset');

function createPopitBoard() {
    popitBoard.innerHTML = '';
    for (let i = 0; i < 25; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'pop-bubble';
        bubble.addEventListener('click', () => popBubble(bubble));
        bubble.addEventListener('touchstart', (e) => { e.preventDefault(); popBubble(bubble); });
        popitBoard.appendChild(bubble);
    }
}

function popBubble(bubble) {
    if (!bubble.classList.contains('popped')) {
        bubble.classList.add('popped');
        playPopSound();
        if (navigator.vibrate) navigator.vibrate(50);
    }
}

function playPopSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 600 + Math.random() * 200;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
}

popitReset.addEventListener('click', () => {
    document.querySelectorAll('.pop-bubble').forEach(b => b.classList.remove('popped'));
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 800;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
});

createPopitBoard();
