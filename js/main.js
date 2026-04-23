// ========== 全局状态 ==========
const gameState = {
    totalPops: 0,
    totalSpins: 0,
    sessionPops: 0,
    sessionSpins: 0,
    soundEnabled: true,
    hapticEnabled: true,
    darkMode: false,
    achievements: [],
    currentToy: 'spinner',
    currentSkin: 'classic',
    soundPack: 'free'
};

// 玩具形态配置
const toySkins = {
    spinner: [
        { id: 'classic', name: '🌀 三叶经典', premium: false },
        { id: 'star', name: '⭐ 六叶星形', premium: false },
        { id: 'yin-yang', name: '☯️ 太极阴阳', premium: true }
    ],
    popit: [
        { id: 'rainbow', name: '🌈 彩虹渐变', premium: false },
        { id: 'mono', name: '⚪ 单色极简', premium: false },
        { id: 'glow', name: '✨ 夜光模式', premium: true }
    ],
    slider: [
        { id: 'metal', name: '🔩 金属质感', premium: false },
        { id: 'carbon', name: '⬛ 碳纤维', premium: false },
        { id: 'gradient', name: '🌸 彩色渐变', premium: true }
    ],
    infinity: [
        { id: 'classic', name: '🎨 经典 6 色', premium: false },
        { id: 'mono', name: '⚫ 单色高级', premium: false },
        { id: 'crystal', name: '💎 透明水晶', premium: true }
    ],
    squishy: [
        { id: 'lava', name: '🌋 熔岩流沙', premium: false },
        { id: 'galaxy', name: '🌌 星空银河', premium: false },
        { id: 'jelly', name: '🍮 渐变果冻', premium: true }
    ]
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
    // 初始化玩具架
    initToyShelf();
}

function saveState() {
    localStorage.setItem('edcGameState', JSON.stringify(gameState));
}

// ========== EDC 玩具架 - 形态选择器 ==========
function initToyShelf() {
    const shelfOptions = document.getElementById('shelf-options');
    if (!shelfOptions) return;
    
    renderShelfOptions();
    
    // 音效包选择器
    const soundPackSelect = document.getElementById('sound-pack-select');
    if (soundPackSelect) {
        soundPackSelect.value = gameState.soundPack || 'free';
        soundPackSelect.addEventListener('change', (e) => {
            const selected = e.target.value;
            if (selected !== 'free') {
                showPremiumAlert();
                e.target.value = gameState.soundPack || 'free';
            } else {
                gameState.soundPack = selected;
                saveState();
            }
        });
    }
}

function renderShelfOptions() {
    const shelfOptions = document.getElementById('shelf-options');
    if (!shelfOptions) return;
    
    const skins = toySkins[gameState.currentToy] || [];
    shelfOptions.innerHTML = skins.map(skin => `
        <div class="shelf-option ${skin.id === gameState.currentSkin ? 'active' : ''} ${skin.premium ? 'premium' : ''}" 
             data-skin="${skin.id}"
             onclick="selectSkin('${skin.id}')">
            ${skin.name}
        </div>
    `).join('');
}

function selectSkin(skinId) {
    const skins = toySkins[gameState.currentToy] || [];
    const skin = skins.find(s => s.id === skinId);
    
    if (skin && skin.premium) {
        showPremiumAlert();
        return;
    }
    
    gameState.currentSkin = skinId;
    gameState.currentToy = gameState.currentToy; // keep current toy
    saveState();
    renderShelfOptions();
    applySkin();
}

function applySkin() {
    // 移除所有形态 class
    document.querySelectorAll('.spinner').forEach(el => {
        el.classList.remove('skin-star', 'skin-yin-yang', 'skin-classic');
    });
    document.querySelectorAll('.popit-board').forEach(el => {
        el.classList.remove('skin-mono', 'skin-glow', 'skin-rainbow');
    });
    document.querySelectorAll('.slider-track').forEach(el => {
        el.classList.remove('skin-carbon', 'skin-gradient', 'skin-metal');
    });
    document.querySelectorAll('.infinity-cube').forEach(el => {
        el.classList.remove('skin-mono', 'skin-crystal', 'skin-classic');
    });
    document.querySelectorAll('.squishy-ball').forEach(el => {
        el.classList.remove('skin-galaxy', 'skin-jelly', 'skin-lava');
    });
    
    // 应用当前形态
    const spinner = document.getElementById('fidget-spinner');
    if (spinner && gameState.currentToy === 'spinner') {
        spinner.classList.add(`skin-${gameState.currentSkin}`);
    }
}

function showPremiumAlert() {
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    toast.innerHTML = `
        <span class="emoji">💎</span>
        <strong>付费形态</strong><br>
        <small>高级形态和音效包即将上线！</small>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ========== 成就系统 ==========
const achievements = [
    { id: 'first_pop', name: '第一声啵啵', desc: '第一次按压泡泡', icon: '🎉', condition: () => gameState.totalPops >= 1 },
    { id: 'pop_10', name: '泡泡新手', desc: '按压 10 次泡泡', icon: '🔘', condition: () => gameState.totalPops >= 10 },
    { id: 'pop_50', name: '泡泡达人', desc: '按压 50 次泡泡', icon: '⭐', condition: () => gameState.totalPops >= 50 },
    { id: 'pop_100', name: '泡泡大师', desc: '按压 100 次泡泡', icon: '👑', condition: () => gameState.totalPops >= 100 },
    { id: 'spin_1', name: '旋转开始', desc: '第一次旋转陀螺', icon: '🌀', condition: () => gameState.totalSpins >= 1 },
    { id: 'spin_25', name: '旋转高手', desc: '旋转 25 次陀螺', icon: '💫', condition: () => gameState.totalSpins >= 25 },
    { id: 'spin_100', name: '陀螺大师', desc: '旋转 100 次陀螺', icon: '🏆', condition: () => gameState.totalSpins >= 100 },
    { id: 'combo_50', name: '专注时刻', desc: '单次会话 50 次', icon: '🔥', condition: () => (gameState.sessionPops + gameState.sessionSpins) >= 50 }
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
        osc.frequency.setValueAtTime(200 + Math.random() * 100, this.ctx.currentTime);
        osc.type = 'triangle';
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.15);
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
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.05);
    },
    playSquish() {
        if (!gameState.soundEnabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.15);
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.15);
    }
};

// ========== 粒子效果 ==========
function createParticles(x, y, color = '#ff6b6b') {
    const rect = document.querySelector('.game-area').getBoundingClientRect();
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'pop-bubble particle';
        particle.style.left = (x - rect.left) + 'px';
        particle.style.top = (y - rect.top) + 'px';
        particle.style.width = (6 + Math.random() * 8) + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = color;
        
        const angle = (i / 8) * Math.PI * 2;
        const distance = 40 + Math.random() * 40;
        particle.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
        particle.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
        
        document.querySelector('.game-area').appendChild(particle);
        setTimeout(() => particle.remove(), 600);
    }
}

// ========== 玩具切换 ==========
function switchToy(toyId) {
    gameState.currentToy = toyId;
    gameState.currentSkin = 'classic'; // 重置为默认形态
    
    document.querySelectorAll('.toy-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.toy === toyId);
    });
    document.querySelectorAll('.toy-container').forEach(c => {
        c.classList.toggle('active', c.id === toyId);
    });
    
    // 更新玩具架
    renderShelfOptions();
    applySkin();
    saveState();
}

document.querySelectorAll('.toy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const toyId = btn.dataset.toy;
        if (btn.disabled) return;
        
        audioContext.playClick();
        switchToy(toyId);
    });
});

// ========== 设置面板 ==========
const settingsPanel = document.createElement('div');
settingsPanel.className = 'settings-panel';
const settingsBtn = document.createElement('button');
settingsBtn.className = 'settings-btn';
settingsBtn.innerHTML = '⚙️';
settingsPanel.appendChild(settingsBtn);
document.querySelector('.container').insertBefore(settingsPanel, document.querySelector('.header'));

let settingsOpen = false;

settingsBtn.addEventListener('click', () => {
    if (settingsOpen) {
        document.getElementById('settings-modal')?.remove();
        document.getElementById('settings-overlay')?.remove();
        settingsOpen = false;
    } else {
        createSettingsModal();
        settingsOpen = true;
    }
});

function createSettingsModal() {
    const overlay = document.createElement('div');
    overlay.id = 'settings-overlay';
    overlay.className = 'overlay';
    overlay.onclick = () => {
        overlay.remove();
        document.getElementById('settings-modal')?.remove();
        settingsOpen = false;
    };
    
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

// ========== 指尖陀螺 - 真实物理模拟 ==========
let currentRotation = 0;
let rotationVelocity = 0;
let maxVelocity = 50;
let friction = 0.985;
let isSpinning = false;
let lastTime = 0;
let spinCount = 0;
const spinner = document.getElementById('fidget-spinner');
const spinnerSpeedLines = document.querySelector('.spinner-speed-lines');

// 创建速度线
function createSpeedLines() {
    const container = document.createElement('div');
    container.className = 'spinner-speed-lines';
    for (let i = 0; i < 8; i++) {
        const line = document.createElement('div');
        line.className = 'speed-line';
        container.appendChild(line);
    }
    spinner.appendChild(container);
}
createSpeedLines();

function animateSpinner(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    currentRotation += rotationVelocity;
    spinner.style.transform = `rotate(${currentRotation}deg)`;
    
    // 根据速度调整摩擦力（高速时更持久）
    const dynamicFriction = rotationVelocity > 30 ? 0.992 : 0.985;
    rotationVelocity *= dynamicFriction;
    
    // 速度线动画
    const speedLines = document.querySelector('.spinner-speed-lines');
    if (speedLines) {
        speedLines.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;
    }
    
    // 根据速度调整音效
    if (rotationVelocity > 5 && gameState.soundEnabled && Math.random() < 0.02) {
        audioContext.playSpin();
    }
    
    if (Math.abs(rotationVelocity) > 0.5) {
        requestAnimationFrame(animateSpinner);
    } else {
        isSpinning = false;
        rotationVelocity = 0;
        spinner.classList.remove('spinning');
    }
}

function addSpinVelocity(velocity) {
    // 每次点击都叠加速度，可以越转越快
    rotationVelocity += velocity;
    
    // 限制最大速度
    if (rotationVelocity > maxVelocity) {
        rotationVelocity = maxVelocity;
    }
    
    if (!isSpinning) {
        isSpinning = true;
        lastTime = 0;
        spinner.classList.add('spinning');
        spinCount++;
        gameState.totalSpins++;
        gameState.sessionSpins++;
        updateStats();
        checkAchievements();
        requestAnimationFrame(animateSpinner);
    }
    
    // 播放音效
    audioContext.playSpin();
    
    // 触觉反馈
    if (navigator.vibrate && gameState.hapticEnabled) {
        navigator.vibrate(15);
    }
}

// 点击陀螺任意位置都能加速
spinner.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    const rect = spinner.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // 计算点击位置距离中心的距离
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    // 距离中心越远，力矩越大，速度增加越多
    const maxDistance = rect.width / 2;
    const leverage = Math.min(distance / maxDistance, 1);
    
    // 基础速度 + 杠杆效应
    const velocity = 5 + leverage * 15;
    
    // 判断点击方向，决定顺时针还是逆时针
    const angle = Math.atan2(distanceY, distanceX);
    const direction = Math.sin(angle) > 0 ? 1 : -1;
    
    addSpinVelocity(velocity * direction);
});

// 滑动支持
let startX = 0, startY = 0, startTime = 0;

spinner.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
    startY = e.clientY;
    startTime = Date.now();
});

spinner.addEventListener('pointerup', (e) => {
    const diffX = e.clientX - startX;
    const diffY = e.clientY - startY;
    const duration = Date.now() - startTime;
    
    // 检测滑动手势
    if (Math.abs(diffX) > 30 || Math.abs(diffY) > 30) {
        if (duration < 400) {
            const velocity = Math.min(Math.sqrt(diffX * diffX + diffY * diffY) / duration * 15, 25);
            const direction = diffX > 0 ? 1 : -1;
            addSpinVelocity(velocity * direction);
        }
    }
});

spinner.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (e.touches.length > 0) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startTime = Date.now();
    }
}, { passive: false });

spinner.addEventListener('touchend', (e) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - startX;
    const diffY = touch.clientY - startY;
    const duration = Date.now() - startTime;
    
    if (Math.abs(diffX) > 30 || Math.abs(diffY) > 30) {
        if (duration < 400) {
            const velocity = Math.min(Math.sqrt(diffX * diffX + diffY * diffY) / duration * 15, 25);
            const direction = diffX > 0 ? 1 : -1;
            addSpinVelocity(velocity * direction);
        }
    }
}, { passive: false });

// ========== 按压泡泡 ==========
const popitBoard = document.getElementById('popit-board');
const popitReset = document.getElementById('popit-reset');

function createPopitBoard() {
    if (!popitBoard) return;
    popitBoard.innerHTML = '';
    for (let i = 0; i < 25; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'pop-bubble';
        bubble.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            popBubble(bubble, e);
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

if (popitReset) {
    popitReset.addEventListener('click', () => {
        document.querySelectorAll('.pop-bubble').forEach(b => b.classList.remove('popped'));
        audioContext.playReset();
        if (navigator.vibrate && gameState.hapticEnabled) {
            navigator.vibrate([50, 30, 50]);
        }
    });
}

// ========== 磁力滑块 ==========
const sliderTop = document.getElementById('slider-top');
const sliderBottom = document.getElementById('slider-bottom');
const sliderTrack = document.getElementById('slider-track');
const sliderClicksEl = document.getElementById('slider-clicks');
let sliderPosition = 0;
let sliderClicks = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartPosition = 0;
const maxSlide = 70;
const snapPoints = [-maxSlide, -maxSlide/2, 0, maxSlide/2, maxSlide];

function snapToNearest(value) {
    return snapPoints.reduce((prev, curr) => 
        Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
}

function updateSliderPosition() {
    if (sliderTop) sliderTop.style.transform = `translateX(${sliderPosition}px)`;
    if (sliderBottom) sliderBottom.style.transform = `translateX(${-sliderPosition}px)`;
}

function playSliderClick() {
    audioContext.playClick();
    sliderClicks++;
    gameState.totalSpins++;
    gameState.sessionSpins++;
    if (sliderClicksEl) sliderClicksEl.textContent = sliderClicks.toLocaleString();
    updateStats();
    if (navigator.vibrate && gameState.hapticEnabled) {
        navigator.vibrate(15);
    }
    checkAchievements();
}

if (sliderTop && sliderBottom) {
    sliderTop.addEventListener('pointerdown', (e) => {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartPosition = sliderPosition;
    });

    sliderBottom.addEventListener('pointerdown', (e) => {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartPosition = sliderPosition;
    });

    document.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - dragStartX;
        let newPosition = dragStartPosition + deltaX * 0.5;
        newPosition = Math.max(-maxSlide - 20, Math.min(maxSlide + 20, newPosition));
        sliderPosition = newPosition;
        updateSliderPosition();
    });

    document.addEventListener('pointerup', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const snapped = snapToNearest(sliderPosition);
        if (Math.abs(snapped - sliderPosition) > 5) {
            playSliderClick();
        }
        sliderPosition = snapped;
        updateSliderPosition();
    });
}

// ========== 无限魔方 ==========
const infinityCube = document.getElementById('infinity-cube');
const infinityFoldsEl = document.getElementById('infinity-folds');
let foldCount = 0;
let cubeStates = [0, 0, 0, 0, 0, 0, 0, 0];

function playFoldSound() {
    audioContext.playClick();
    foldCount++;
    gameState.totalSpins++;
    gameState.sessionSpins++;
    if (infinityFoldsEl) infinityFoldsEl.textContent = foldCount.toLocaleString();
    updateStats();
    if (navigator.vibrate && gameState.hapticEnabled) {
        navigator.vibrate(20);
    }
    checkAchievements();
}

function animateCubeFold(cubeIndex) {
    if (!infinityCube) return;
    const cube = infinityCube.querySelector(`.cube-${cubeIndex}`);
    if (!cube) return;
    
    const rotation = cubeStates[cubeIndex] === 0 ? 90 : -90;
    cube.style.transform = `rotateY(${rotation}deg) rotateX(${rotation}deg)`;
    cubeStates[cubeIndex] = cubeStates[cubeIndex] === 0 ? 1 : 0;
    
    setTimeout(() => {
        cube.style.transform = '';
    }, 400);
}

if (infinityCube) {
    infinityCube.addEventListener('click', (e) => {
        const face = e.target.closest('.face');
        if (!face) return;
        
        const cube = face.closest('.mini-cube');
        const cubeIndex = parseInt(cube.className.split('cube-')[1]);
        
        animateCubeFold(cubeIndex);
        playFoldSound();
    });
}

// ========== 磁力捏捏球 ==========
const squishyBall = document.getElementById('squishy-ball');
const squishyParticles = document.getElementById('squishy-particles');
const squishySqueezesEl = document.getElementById('squishy-squeezes');
let squeezeCount = 0;
let isSqueezing = false;

function createSquishyParticles() {
    if (!squishyParticles) return;
    squishyParticles.innerHTML = '';
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const angle = (i / 20) * Math.PI * 2;
        const radius = 30 + Math.random() * 40;
        particle.style.left = (50 + Math.cos(angle) * radius) + '%';
        particle.style.top = (50 + Math.sin(angle) * radius) + '%';
        const tx = (Math.random() - 0.5) * 60;
        const ty = (Math.random() - 0.5) * 60;
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        squishyParticles.appendChild(particle);
    }
}

if (squishyBall) {
    squishyBall.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        if (isSqueezing) return;
        isSqueezing = true;
        squishyBall.classList.add('squeezing');
        audioContext.playSquish();
        if (navigator.vibrate && gameState.hapticEnabled) {
            navigator.vibrate(30);
        }
    });

    squishyBall.addEventListener('pointerup', (e) => {
        e.preventDefault();
        if (!isSqueezing) return;
        isSqueezing = false;
        squishyBall.classList.remove('squeezing');
        squeezeCount++;
        gameState.totalPops++;
        gameState.sessionPops++;
        if (squishySqueezesEl) squishySqueezesEl.textContent = squeezeCount.toLocaleString();
        updateStats();
        checkAchievements();
    });

    squishyBall.addEventListener('pointerleave', () => {
        if (!isSqueezing) return;
        isSqueezing = false;
        squishyBall.classList.remove('squeezing');
        squeezeCount++;
        gameState.totalPops++;
        gameState.sessionPops++;
        if (squishySqueezesEl) squishySqueezesEl.textContent = squeezeCount.toLocaleString();
        updateStats();
        checkAchievements();
    });
}

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    createPopitBoard();
    createSquishyParticles();
    updateStats();
    applySkin();
    
    // 首次点击初始化 AudioContext
    document.body.addEventListener('click', () => audioContext.init(), { once: true });
});

// 页面关闭前保存
window.addEventListener('beforeunload', saveState);
