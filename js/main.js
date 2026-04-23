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

// 玩具形态配置 - 全部免费体验
const toySkins = {
    spinner: [
        { id: 'classic', name: '🌀 三叶经典', premium: false },
        { id: 'star', name: '⭐ 六叶星形', premium: false },
        { id: 'yin-yang', name: '☯️ 太极阴阳', premium: false }
    ],
    popit: [
        { id: 'rainbow', name: '🌈 彩虹渐变', premium: false },
        { id: 'mono', name: '⚪ 单色极简', premium: false },
        { id: 'glow', name: '✨ 夜光模式', premium: false }
    ],
    slider: [
        { id: 'metal', name: '🔩 金属质感', premium: false },
        { id: 'carbon', name: '⬛ 碳纤维', premium: false },
        { id: 'gradient', name: '🌸 彩色渐变', premium: false }
    ],
    infinity: [
        { id: 'classic', name: '🎨 经典 6 色', premium: false },
        { id: 'mono', name: '⚫ 单色高级', premium: false },
        { id: 'crystal', name: '💎 透明水晶', premium: false }
    ],
    squishy: [
        { id: 'lava', name: '🌋 熔岩流沙', premium: false },
        { id: 'galaxy', name: '🌌 星空银河', premium: false },
        { id: 'jelly', name: '🍮 渐变果冻', premium: false }
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
            const newPack = e.target.value;
            gameState.soundPack = newPack;
            saveState();
            
            // 显示音效包切换提示
            showSoundPackToast(newPack);
        });
    }
}

// 音效包切换提示
function showSoundPackToast(packId) {
    const packNames = {
        'free': '🆓 基础音效包',
        'asmr': '💎 ASMR 音效包',
        'mechanical': '⚙️ 机械轴音效包',
        'nature': '🌿 自然音效包'
    };
    
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    toast.innerHTML = `
        <span class="emoji">🔊</span>
        <strong>音效包已切换</strong><br>
        <small>${packNames[packId] || packId}</small>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 2000);
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
    
    if (!skin) return;
    
    gameState.currentSkin = skinId;
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
    if (gameState.currentToy === 'spinner') {
        const spinner = document.getElementById('fidget-spinner');
        if (spinner) spinner.classList.add(`skin-${gameState.currentSkin}`);
    } else if (gameState.currentToy === 'popit') {
        const board = document.getElementById('popit-board');
        if (board) board.classList.add(`skin-${gameState.currentSkin}`);
    } else if (gameState.currentToy === 'slider') {
        const track = document.getElementById('slider-track');
        if (track) track.classList.add(`skin-${gameState.currentSkin}`);
    } else if (gameState.currentToy === 'infinity') {
        const cube = document.getElementById('infinity-cube');
        if (cube) cube.classList.add(`skin-${gameState.currentSkin}`);
    } else if (gameState.currentToy === 'squishy') {
        const ball = document.getElementById('squishy-ball');
        if (ball) ball.classList.add(`skin-${gameState.currentSkin}`);
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

// ========== 音效系统 - 真实 ASMR 级音效 ==========
const audioContext = {
    ctx: null,
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },
    
    // 🌀 指尖陀螺音效 - 轴承旋转 + 空气切割声
    playSpinner(velocity = 1) {
        if (!gameState.soundEnabled) return;
        this.init();
        
        const now = this.ctx.currentTime;
        
        // 低频轴承声
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.connect(gain1);
        gain1.connect(this.ctx.destination);
        osc1.frequency.setValueAtTime(80 + velocity * 30, now);
        osc1.type = 'triangle';
        gain1.gain.setValueAtTime(0.12 * velocity, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc1.start(now);
        osc1.stop(now + 0.3);
        
        // 高频空气切割声（高速时）
        if (velocity > 0.8) {
            const osc2 = this.ctx.createOscillator();
            const gain2 = this.ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(this.ctx.destination);
            osc2.frequency.setValueAtTime(2000 + velocity * 500, now);
            osc2.type = 'sine';
            gain2.gain.setValueAtTime(0.03 * velocity, now);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            osc2.start(now);
            osc2.stop(now + 0.15);
        }
        
        // 金属轴承质感（机械音效包）
        if (gameState.soundPack === 'mechanical') {
            const osc3 = this.ctx.createOscillator();
            const gain3 = this.ctx.createGain();
            osc3.connect(gain3);
            gain3.connect(this.ctx.destination);
            osc3.frequency.setValueAtTime(1500, now);
            osc3.type = 'square';
            gain3.gain.setValueAtTime(0.05, now);
            gain3.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            osc3.start(now);
            osc3.stop(now + 0.08);
        }
    },
    
    // 🔘 按压泡泡音效 - 橡胶 popping 声
    playPop(intensity = 1) {
        if (!gameState.soundEnabled) return;
        this.init();
        const now = this.ctx.currentTime;
        
        // 基础 popping 声
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        // 随机音高增加真实感
        const baseFreq = 350 + Math.random() * 250 + intensity * 100;
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.08);
        osc.type = 'sine';
        
        // ASMR 模式：更丰富
        if (gameState.soundPack === 'asmr') {
            gain.gain.setValueAtTime(0.45 * intensity, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        } else {
            gain.gain.setValueAtTime(0.35 * intensity, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        }
        
        osc.start(now);
        osc.stop(now + 0.12);
        
        // 橡胶质感（高频点击）
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.connect(clickGain);
        clickGain.connect(this.ctx.destination);
        clickOsc.frequency.setValueAtTime(1200 + Math.random() * 400, now);
        clickOsc.type = 'triangle';
        clickGain.gain.setValueAtTime(0.15 * intensity, now);
        clickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        clickOsc.start(now);
        clickOsc.stop(now + 0.05);
    },
    
    // 🔘 重置音效 - 刷刷声
    playReset() {
        if (!gameState.soundEnabled) return;
        this.init();
        const now = this.ctx.currentTime;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.frequency.setValueAtTime(600, now);
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    },
    
    // 🔲 磁力滑块音效 - 磁力咔嗒 + 滑动摩擦
    playSliderClick(velocity = 1) {
        if (!gameState.soundEnabled) return;
        this.init();
        const now = this.ctx.currentTime;
        
        // 基础咔嗒声
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        // 机械轴音效包：更像 Cherry 轴
        if (gameState.soundPack === 'mechanical') {
            osc.frequency.setValueAtTime(1400, now);
            osc.type = 'square';
            gain.gain.setValueAtTime(0.12 * velocity, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
        } else {
            osc.frequency.setValueAtTime(900, now);
            osc.type = 'triangle';
            gain.gain.setValueAtTime(0.15 * velocity, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
        }
        
        osc.start(now);
        osc.stop(now + 0.06);
        
        // 金属碰撞声（高频）
        const metalOsc = this.ctx.createOscillator();
        const metalGain = this.ctx.createGain();
        metalOsc.connect(metalGain);
        metalGain.connect(this.ctx.destination);
        metalOsc.frequency.setValueAtTime(2000 + Math.random() * 500, now);
        metalOsc.type = 'sine';
        metalGain.gain.setValueAtTime(0.08 * velocity, now);
        metalGain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
        metalOsc.start(now);
        metalOsc.stop(now + 0.03);
    },
    
    // 🔲 滑块滑动摩擦声
    playSliderSlide(position) {
        if (!gameState.soundEnabled) return;
        if (!this.sliderNoiseNode) return;
        
        const now = this.ctx.currentTime;
        this.sliderGain.gain.setValueAtTime(
            Math.min(Math.abs(position) / 50, 0.08),
            now
        );
    },
    
    startSliderSlide() {
        if (!gameState.soundEnabled) return;
        this.init();
        
        // 创建白噪声模拟摩擦声
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        this.sliderNoiseNode = this.ctx.createBufferSource();
        this.sliderNoiseNode.buffer = buffer;
        this.sliderNoiseNode.loop = true;
        
        // 低通滤波让声音更柔和
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        
        this.sliderGain = this.ctx.createGain();
        this.sliderGain.gain.value = 0;
        
        this.sliderNoiseNode.connect(filter);
        filter.connect(this.sliderGain);
        this.sliderGain.connect(this.ctx.destination);
        this.sliderNoiseNode.start();
    },
    
    stopSliderSlide() {
        if (this.sliderGain) {
            const now = this.ctx.currentTime;
            this.sliderGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        }
        setTimeout(() => {
            if (this.sliderNoiseNode) {
                this.sliderNoiseNode.stop();
                this.sliderNoiseNode = null;
            }
        }, 100);
    },
    
    // 🎲 无限魔方音效 - 折叠咔嗒声
    playFold() {
        if (!gameState.soundEnabled) return;
        this.init();
        const now = this.ctx.currentTime;
        
        // 基础咔嗒声
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        // ASMR 模式：更清脆
        if (gameState.soundPack === 'asmr') {
            osc.frequency.setValueAtTime(1100, now);
            osc.type = 'square';
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        } else {
            osc.frequency.setValueAtTime(850, now);
            osc.type = 'triangle';
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        }
        
        osc.start(now);
        osc.stop(now + 0.1);
        
        // 塑料/金属碰撞质感
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.connect(clickGain);
        clickGain.connect(this.ctx.destination);
        clickOsc.frequency.setValueAtTime(1800 + Math.random() * 400, now);
        clickOsc.type = 'sine';
        clickGain.gain.setValueAtTime(0.1, now);
        clickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        clickOsc.start(now);
        clickOsc.stop(now + 0.05);
    },
    
    // 🔮 磁力捏捏球音效 - 挤压噗叽 + 颗粒流动 + 磁性咔嗒
    playSquish(squeezeIntensity = 1) {
        if (!gameState.soundEnabled) return;
        this.init();
        const now = this.ctx.currentTime;
        
        // 基础噗叽声（低频）
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        const baseFreq = 150 + squeezeIntensity * 50;
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.25);
        
        // ASMR 模式：更湿润
        if (gameState.soundPack === 'asmr') {
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.4 * squeezeIntensity, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        } else {
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.3 * squeezeIntensity, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        }
        
        osc.start(now);
        osc.stop(now + 0.3);
        
        // 颗粒流动"沙沙"声
        if (this.squishyNoiseNode) {
            this.squishyNoiseNode.stop();
        }
        const bufferSize = this.ctx.sampleRate * 0.5;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.3;
        }
        
        this.squishyNoiseNode = this.ctx.createBufferSource();
        this.squishyNoiseNode.buffer = buffer;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 600;
        
        const squishyGain = this.ctx.createGain();
        squishyGain.gain.setValueAtTime(0.15 * squeezeIntensity, now);
        squishyGain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        
        this.squishyNoiseNode.connect(filter);
        filter.connect(squishyGain);
        squishyGain.connect(this.ctx.destination);
        this.squishyNoiseNode.start(now);
        this.squishyNoiseNode.stop(now + 0.25);
        
        // 磁性颗粒细微咔嗒（随机）
        for (let i = 0; i < 3 + squeezeIntensity * 2; i++) {
            const clickTime = now + (i * 0.05) + (Math.random() * 0.03);
            const clickOsc = this.ctx.createOscillator();
            const clickGain = this.ctx.createGain();
            clickOsc.connect(clickGain);
            clickGain.connect(this.ctx.destination);
            clickOsc.frequency.setValueAtTime(800 + Math.random() * 400, clickTime);
            clickOsc.type = 'triangle';
            clickGain.gain.setValueAtTime(0.05, clickTime);
            clickGain.gain.exponentialRampToValueAtTime(0.01, clickTime + 0.03);
            clickOsc.start(clickTime);
            clickOsc.stop(clickTime + 0.03);
        }
    },
    
    // 🔮 捏捏球回弹音效
    playSquishRelease() {
        if (!gameState.soundEnabled) return;
        this.init();
        const now = this.ctx.currentTime;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(420, now + 0.12);
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
    },
    
    // ⚙️ 通用点击音效
    playClick() {
        if (!gameState.soundEnabled) return;
        this.init();
        const now = this.ctx.currentTime;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.frequency.setValueAtTime(1000, now);
        osc.type = gameState.soundPack === 'mechanical' ? 'square' : 'triangle';
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
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
    // 不重置形态，让每个玩具记住自己的形态
    // gameState.currentSkin = 'classic';
    
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
    
    // 更新速度指示器
    updateSpeedIndicator(rotationVelocity);
    
    // 根据速度调整音效
    if (rotationVelocity > 5 && gameState.soundEnabled && Math.random() < 0.02) {
        audioContext.playSpinner(Math.min(rotationVelocity / 20, 1.5));
    }
    
    if (Math.abs(rotationVelocity) > 0.5) {
        requestAnimationFrame(animateSpinner);
    } else {
        isSpinning = false;
        rotationVelocity = 0;
        spinner.classList.remove('spinning');
        // 清除速度指示器
        const speedBars = document.querySelectorAll('.speed-bar');
        speedBars.forEach(bar => bar.classList.remove('active'));
    }
}

// 速度指示器
function updateSpeedIndicator(velocity) {
    const speedBars = document.querySelectorAll('.speed-bar');
    const activeBars = Math.min(Math.ceil(velocity / 10), 5);
    speedBars.forEach((bar, i) => {
        bar.classList.toggle('active', i < activeBars);
    });
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
    
    // 播放音效（根据速度）
    audioContext.playSpinner(Math.min(Math.abs(rotationVelocity) / 20, 1.5));
    
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
let popCombo = 0;
let popComboTimer = null;
let lastPopTime = 0;

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
        
        // 连击系统
        const now = Date.now();
        if (now - lastPopTime < 300) {
            popCombo++;
        } else {
            popCombo = 1;
        }
        lastPopTime = now;
        
        // 清除之前的定时器
        if (popComboTimer) clearTimeout(popComboTimer);
        popComboTimer = setTimeout(() => { popCombo = 0; }, 500);
        
        // 力度感应（根据连击数）
        const intensity = Math.min(0.5 + popCombo * 0.1, 1.5);
        audioContext.playPop(intensity);
        
        // 更新连击显示
        updateComboDisplay(popCombo);
        
        if (navigator.vibrate && gameState.hapticEnabled) {
            navigator.vibrate(20 + popCombo * 5);
        }
        
        if (e) {
            createParticles(e.clientX, e.clientY);
        }
        
        checkAchievements();
    }
}

// 连击显示
function updateComboDisplay(combo) {
    const display = document.getElementById('combo-display');
    if (!display) return;
    
    if (combo > 1) {
        display.textContent = `🔥 x${combo}`;
        display.classList.add('show', 'pop');
        setTimeout(() => display.classList.remove('pop'), 300);
    } else {
        display.classList.remove('show');
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
    audioContext.playSliderClick();
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
        audioContext.startSliderSlide();
    });

    sliderBottom.addEventListener('pointerdown', (e) => {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartPosition = sliderPosition;
        audioContext.startSliderSlide();
    });

    document.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - dragStartX;
        let newPosition = dragStartPosition + deltaX * 0.5;
        newPosition = Math.max(-maxSlide - 20, Math.min(maxSlide + 20, newPosition));
        
        // 滑动音效
        const velocity = Math.abs(newPosition - sliderPosition);
        audioContext.playSliderSlide(velocity);
        
        sliderPosition = newPosition;
        updateSliderPosition();
    });

    document.addEventListener('pointerup', () => {
        if (!isDragging) return;
        isDragging = false;
        audioContext.stopSliderSlide();
        
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
    audioContext.playFold();
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
let currentDeformation = 0; // 累积变形 0-1
let deformationDecay = 0.995; // 变形衰减

function createSquishyParticles() {
    if (!squishyParticles) return;
    squishyParticles.innerHTML = '';
    for (let i = 0; i < 24; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const angle = (i / 24) * Math.PI * 2;
        const radius = 30 + Math.random() * 40;
        particle.style.left = (50 + Math.cos(angle) * radius) + '%';
        particle.style.top = (50 + Math.sin(angle) * radius) + '%';
        const tx = (Math.random() - 0.5) * 60;
        const ty = (Math.random() - 0.5) * 60;
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        particle.style.transitionDelay = (i * 0.02) + 's';
        squishyParticles.appendChild(particle);
    }
}

// 捏捏球变形动画
function updateSquishyDeformation() {
    if (!squishyBall) return;
    
    // 衰减累积变形
    currentDeformation *= deformationDecay;
    if (currentDeformation < 0.01) currentDeformation = 0;
    
    // 应用变形
    const baseScale = isSqueezing ? 0.78 : 1 - currentDeformation * 0.15;
    const translateY = isSqueezing ? 10 : -currentDeformation * 5;
    squishyBall.style.transform = `scale(${baseScale}) translateY(${translateY}px)`;
    
    // 更新挤压指示器
    const squeezeFill = document.getElementById('squeeze-fill');
    if (squeezeFill) {
        squeezeFill.style.width = (currentDeformation * 100) + '%';
    }
    
    // 粒子流动效果
    const particles = squishyParticles?.querySelectorAll('.particle') || [];
    particles.forEach((p, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const spread = isSqueezing ? 1.4 : 1 + currentDeformation * 0.3;
        const tx = Math.cos(angle) * spread * 50 + (Math.random() - 0.5) * 10;
        const ty = Math.sin(angle) * spread * 50 + (Math.random() - 0.5) * 10;
        p.style.setProperty('--tx', tx + 'px');
        p.style.setProperty('--ty', ty + 'px');
    });
    
    requestAnimationFrame(updateSquishyDeformation);
}

if (squishyBall) {
    squishyBall.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        if (isSqueezing) return;
        isSqueezing = true;
        
        // 累积变形
        currentDeformation = Math.min(currentDeformation + 0.2, 1);
        
        // 根据累积程度播放不同音效
        const intensity = 0.5 + currentDeformation * 0.5;
        audioContext.playSquish(intensity);
        
        if (navigator.vibrate && gameState.hapticEnabled) {
            navigator.vibrate(30 + currentDeformation * 20);
        }
    });

    squishyBall.addEventListener('pointerup', (e) => {
        e.preventDefault();
        if (!isSqueezing) return;
        isSqueezing = false;
        
        // 回弹音效
        setTimeout(() => audioContext.playSquishRelease(), 100);
        
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
        setTimeout(() => audioContext.playSquishRelease(), 100);
        squeezeCount++;
        gameState.totalPops++;
        gameState.sessionPops++;
        if (squishySqueezesEl) squishySqueezesEl.textContent = squeezeCount.toLocaleString();
        updateStats();
        checkAchievements();
    });
    
    // 启动变形动画循环
    updateSquishyDeformation();
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
