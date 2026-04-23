// ========== 全局状态 ==========
const gameState = {
    totalPops: 0,
    totalSpins: 0,
    sessionPops: 0,
    sessionSpins: 0,
    soundEnabled: true,
    hapticEnabled: true,
    darkMode: false,
    achievements: []
};

// 从 localStorage 加载
function loadState() {
    const saved = localStorage.getItem('edcGameState');
    if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(gameState, parsed);
        updateStats();
        if (gameState.darkMode) document.body.classList.add('dark-mode');
    }
}

function saveState() {
    localStorage.setItem('edcGameState', JSON.stringify(gameState));
}

// ========== 成就系统 ==========
const achievements = [
    { id: 'first_pop', name: '第一声啵啵', desc: '第一次按压泡泡', icon: '🎉', condition: () => gameState.totalPops >= 1 },
    { id: 'pop_10', name: '泡泡新手', desc: '按压 10 次泡泡', icon: '🔘', condition: () => gameState.totalPops >= 10 },
    { id: 'pop_50', name: '泡泡达人', desc: '按压 50 次泡泡', icon: '⭐', condition: () => gameState.totalPops >= 50 },
    { id: 'pop_100', name: '泡泡大师', desc: '按压 100 次泡泡', icon: '👑', condition: () => gameState.totalPops >= 100 },
    { id: 'spin_1', name: '旋转开始', desc: '第一次旋转陀螺', icon: '🌀', condition: () => gameState.totalSpins >= 1 },
    { id: 'spin_25', name: '旋转高手', desc: '旋转 25 次陀螺', icon: '💫', condition: () => gameState.totalSpins >= 25 },
    { id: 'combo_50', name: '专注时刻', desc: '单次会话按压 50 次', icon: '🔥', condition: () => gameState.sessionPops >= 50 }
];

function checkAchievements() {
    achievements.forEach(ach => {
        if (!gameState.achievements.includes(ach.id) && ach.condition()) {
            gameState.achievements.push(ach.id);
            showAchievement(ach);
            saveState();
        }
    });
}

function showAchievement(ach) {
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `<span class="emoji">${ach.icon}</span><strong>${ach.name}</strong><br><small>${ach.desc}</small>`;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
    
    if (navigator.vibrate && gameState.hapticEnabled) {
        navigator.vibrate([100, 50, 100]);
    }
}

// ========== 更新统计 ==========
function updateStats() {
    const totalEl = document.getElementById('stat-total');
    const sessionEl = document.getElementById('stat-session');
    if (totalEl) totalEl.textContent = (gameState.totalPops + gameState.totalSpins).toLocaleString();
    if (sessionEl) sessionEl.textContent = (gameState.sessionPops + gameState.sessionSpins).toLocaleString();
}

// ========== 音效系统 ==========
const audioContext = {
    ctx: null,
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },
    playPop() {
        if (!gameState.soundEnabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.frequency.setValueAtTime(600 + Math.random() * 200, this.ctx.currentTime);
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.1);
    },
    playReset() {
        if (!gameState.soundEnabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.3);
    },
    playSpin() {
        if (!gameState.soundEnabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.type = 'triangle';
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.2);
    },
    playClick() {
        if (!gameState.soundEnabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.frequency.setValueAtTime(1000, this.ctx.currentTime);
        osc.type = 'square';
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.05);
    }
};

// ========== 粒子效果 ==========
function createParticles(x, y, color = '#ff6b6b') {
    const rect = document.querySelector('.game-area').getBoundingClientRect();
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'pop-bubble particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = (6 + Math.random() * 8) + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = color;
        
        const angle = (i / 8) * Math.PI * 2;
        const distance = 50 + Math.random() * 50;
        particle.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
        particle.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
        
        document.querySelector('.game-area').appendChild(particle);
        setTimeout(() => particle.remove(), 600);
    }
}

// ========== 玩具切换 ==========
document.querySelectorAll('.toy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const toyId = btn.dataset.toy;
        if (btn.disabled) return;
        
        audioContext.playClick();
        
        document.querySelectorAll('.toy-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.toy-container').forEach(c => c.classList.remove('active'));
        document.getElementById(toyId).classList.add('active');
    });
});

// ========== 设置面板 ==========
const settingsBtn = document.createElement('button');
settingsBtn.className = 'settings-btn';
settingsBtn.innerHTML = '⚙️';
settingsBtn.onclick = toggleSettings;
document.querySelector('.settings-panel')?.appendChild(settingsBtn) || createSettingsPanel();

function createSettingsPanel() {
    const panel = document.createElement('div');
    panel.className = 'settings-panel';
    panel.appendChild(settingsBtn);
    document.querySelector('.header').after(panel);
}

function toggleSettings() {
    const modal = document.getElementById('settings-modal');
    const overlay = document.getElementById('settings-overlay');
    if (modal && overlay) {
        modal.classList.toggle('show');
        overlay.classList.toggle('show');
    } else {
        createSettingsModal();
    }
}

function createSettingsModal() {
    const overlay = document.createElement('div');
    overlay.id = 'settings-overlay';
    overlay.className = 'overlay';
    overlay.onclick = toggleSettings;
    
    const modal = document.createElement('div');
    modal.id = 'settings-modal';
    modal.className = 'settings-modal';
    modal.innerHTML = `
        <h3>⚙️ 设置</h3>
        <div class="setting-item">
            <span class="setting-label">🔊 音效</span>
            <label class="toggle-switch">
                <input type="checkbox" id="sound-toggle" ${gameState.soundEnabled ? 'checked' : ''}>
                <span class="toggle-slider"></span>
            </label>
        </div>
        <div class="setting-item">
            <span class="setting-label">📳 触觉反馈</span>
            <label class="toggle-switch">
                <input type="checkbox" id="haptic-toggle" ${gameState.hapticEnabled ? 'checked' : ''}>
                <span class="toggle-slider"></span>
            </label>
        </div>
        <div class="setting-item">
            <span class="setting-label">🌙 深色模式</span>
            <label class="toggle-switch">
                <input type="checkbox" id="dark-toggle" ${gameState.darkMode ? 'checked' : ''}>
                <span class="toggle-slider"></span>
            </label>
        </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
    modal.classList.add('show');
    overlay.classList.add('show');
    
    document.getElementById('sound-toggle').onchange = (e) => {
        gameState.soundEnabled = e.target.checked;
        saveState();
    };
    
    document.getElementById('haptic-toggle').onchange = (e) => {
        gameState.hapticEnabled = e.target.checked;
        saveState();
    };
    
    document.getElementById('dark-toggle').onchange = (e) => {
        gameState.darkMode = e.target.checked;
        document.body.classList.toggle('dark-mode', e.target.checked);
        saveState();
    };
}

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
        gameState.totalSpins++;
        gameState.sessionSpins++;
        updateStats();
        audioContext.playSpin();
        requestAnimationFrame(animateSpinner);
        checkAchievements();
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
        bubble.addEventListener('click', (e) => popBubble(bubble, e));
        bubble.addEventListener('touchstart', (e) => { 
            e.preventDefault(); 
            const touch = e.touches[0];
            const rect = bubble.getBoundingClientRect();
            popBubble(bubble, { clientX: rect.left + rect.width/2, clientY: rect.top + rect.height/2 });
        });
        popitBoard.appendChild(bubble);
    }
}

function popBubble(bubble, e) {
    if (!bubble.classList.contains('popped')) {
        bubble.classList.add('popped');
        gameState.totalPops++;
        gameState.sessionPops++;
        updateStats();
        audioContext.playPop();
        
        if (navigator.vibrate && gameState.hapticEnabled) {
            navigator.vibrate(30);
        }
        
        if (e) {
            createParticles(e.clientX, e.clientY);
        }
        
        checkAchievements();
    }
}

popitReset.addEventListener('click', () => {
    document.querySelectorAll('.pop-bubble').forEach(b => b.classList.remove('popped'));
    audioContext.playReset();
    if (navigator.vibrate && gameState.hapticEnabled) {
        navigator.vibrate([50, 30, 50]);
    }
});

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    createPopitBoard();
    updateStats();
    
    // 首次点击初始化 AudioContext
    document.body.addEventListener('click', () => audioContext.init(), { once: true });
});

// 页面关闭前保存
window.addEventListener('beforeunload', saveState);
