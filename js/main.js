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
    ratchet: [
        { id: 'steel', name: '🔩 不锈钢', premium: false },
        { id: 'titanium', name: '⚫ 钛合金', premium: false },
        { id: 'gold', name: '🏆 镀金版', premium: false }
    ],
    chain: [
        { id: 'silver', name: '⛓️ 银色链', premium: false },
        { id: 'black', name: '🖤 黑色链', premium: false },
        { id: 'rainbow', name: '🌈 彩虹链', premium: false }
    ],
    squishy: [
        { id: 'lava', name: '🌋 熔岩流沙', premium: false },
        { id: 'galaxy', name: '🌌 星空银河', premium: false },
        { id: 'jelly', name: '🍮 渐变果冻', premium: false },
        { id: 'jade', name: '💚 翡翠玉石', premium: false },
        { id: 'amethyst', name: '💜 紫晶洞', premium: false },
        { id: 'choco', name: '🍫 巧克力', premium: false }
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

// ========== 音效系统 - 真实 ASMR 级多層音效 ==========
const audioContext = {
    ctx: null,
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },
    
    // 🌀 指尖陀螺音效 - 4 层合成
    playSpinner(velocity = 1) {
        if (!gameState.soundEnabled) return;
        this.init();
        const now = this.ctx.currentTime;
        
        // 层 1: 低频轴承旋转声
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.connect(gain1);
        gain1.connect(this.ctx.destination);
        osc1.frequency.setValueAtTime(60 + velocity * 25, now);
        osc1.frequency.exponentialRampToValueAtTime(40 + velocity * 15, now + 0.3);
        osc1.type = 'triangle';
        gain1.gain.setValueAtTime(0.15 * velocity, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc1.start(now);
        osc1.stop(now + 0.4);
        
        // 层 2: 中频轴承滚珠声
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.frequency.setValueAtTime(300 + velocity * 100, now);
        osc2.type = 'sine';
        gain2.gain.setValueAtTime(0.08 * velocity, now);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc2.start(now);
        osc2.stop(now + 0.2);
        
        // 层 3: 高频空气切割声（高速时）
        if (velocity > 0.6) {
            const osc3 = this.ctx.createOscillator();
            const gain3 = this.ctx.createGain();
            osc3.connect(gain3);
            gain3.connect(this.ctx.destination);
            osc3.frequency.setValueAtTime(1800 + velocity * 600, now);
            osc3.frequency.exponentialRampToValueAtTime(1200 + velocity * 400, now + 0.15);
            osc3.type = 'sine';
            gain3.gain.setValueAtTime(0.04 * velocity, now);
            gain3.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc3.start(now);
            osc3.stop(now + 0.2);
        }
        
        // 层 4: 金属轴承质感（机械音效包）
        if (gameState.soundPack === 'mechanical') {
            const osc4 = this.ctx.createOscillator();
            const gain4 = this.ctx.createGain();
            osc4.connect(gain4);
            gain4.connect(this.ctx.destination);
            osc4.frequency.setValueAtTime(1200, now);
            osc4.type = 'square';
            gain4.gain.setValueAtTime(0.06, now);
            gain4.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc4.start(now);
            osc4.stop(now + 0.1);
        }
        
        // ASMR 包：添加更多高频细节
        if (gameState.soundPack === 'asmr' && velocity > 0.5) {
            const osc5 = this.ctx.createOscillator();
            const gain5 = this.ctx.createGain();
            osc5.connect(gain5);
            gain5.connect(this.ctx.destination);
            osc5.frequency.setValueAtTime(3000 + Math.random() * 1000, now);
            osc5.type = 'triangle';
            gain5.gain.setValueAtTime(0.02, now);
            gain5.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc5.start(now);
            osc5.stop(now + 0.25);
        }
    },
    
    // 🔘 按压泡泡音效 - 3 层合成 + 连击
    playPop(intensity = 1) {
        if (!gameState.soundEnabled) return;
        this.init();
        const now = this.ctx.currentTime;
        
        // 层 1: 橡胶 popping 声（中低频）
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        const baseFreq = 320 + Math.random() * 280 + intensity * 120;
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.45, now + 0.1);
        osc.type = 'sine';
        
        if (gameState.soundPack === 'asmr') {
            gain.gain.setValueAtTime(0.5 * intensity, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        } else {
            gain.gain.setValueAtTime(0.4 * intensity, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        }
        
        osc.start(now);
        osc.stop(now + 0.15);
        
        // 层 2: 橡胶表面高频点击
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.connect(clickGain);
        clickGain.connect(this.ctx.destination);
        clickOsc.frequency.setValueAtTime(1100 + Math.random() * 500, now);
        clickOsc.type = 'triangle';
        clickGain.gain.setValueAtTime(0.18 * intensity, now);
        clickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
        clickOsc.start(now);
        clickOsc.stop(now + 0.06);
        
        // 层 3: 气泡破裂感（ASMR 包）
        if (gameState.soundPack === 'asmr') {
            const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.1, this.ctx.sampleRate);
            const noiseData = noiseBuffer.getChannelData(0);
            for (let i = 0; i < noiseData.length; i++) {
                noiseData[i] = (Math.random() * 2 - 1) * 0.15;
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = noiseBuffer;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 2000;
            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(0.2 * intensity, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(this.ctx.destination);
            noise.start(now);
            noise.stop(now + 0.1);
        }
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
    
    // 🔮 磁力捏捏球音效 - 5 层超丰富合成
    playSquish(squeezeIntensity = 1) {
        if (!gameState.soundEnabled) return;
        this.init();
        const now = this.ctx.currentTime;
        
        // 层 1: 低频噗叽声（湿润感）
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        const baseFreq = 130 + squeezeIntensity * 60;
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + 0.3);
        
        if (gameState.soundPack === 'asmr') {
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.45 * squeezeIntensity, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        } else {
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.35 * squeezeIntensity, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        }
        
        osc.start(now);
        osc.stop(now + 0.35);
        
        // 层 2: 颗粒流动"沙沙"声（白噪声）
        const bufferSize = this.ctx.sampleRate * 0.4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.25;
        }
        
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 500 + squeezeIntensity * 200;
        filter.Q.value = 1.5;
        
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.18 * squeezeIntensity, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noise.start(now);
        noise.stop(now + 0.35);
        
        // 层 3-5: 磁性颗粒细微咔嗒（随机 4-7 次）
        const numClicks = Math.floor(4 + squeezeIntensity * 3 + Math.random() * 2);
        for (let i = 0; i < numClicks; i++) {
            const clickTime = now + (i * 0.04) + (Math.random() * 0.025);
            const clickOsc = this.ctx.createOscillator();
            const clickGain = this.ctx.createGain();
            clickOsc.connect(clickGain);
            clickGain.connect(this.ctx.destination);
            clickOsc.frequency.setValueAtTime(700 + Math.random() * 500, clickTime);
            clickOsc.type = 'triangle';
            clickGain.gain.setValueAtTime(0.06, clickTime);
            clickGain.gain.exponentialRampToValueAtTime(0.01, clickTime + 0.035);
            clickOsc.start(clickTime);
            clickOsc.stop(clickTime + 0.035);
        }
        
        // ASMR 包：添加更多高频细节
        if (gameState.soundPack === 'asmr') {
            const highOsc = this.ctx.createOscillator();
            const highGain = this.ctx.createGain();
            highOsc.connect(highGain);
            highGain.connect(this.ctx.destination);
            highOsc.frequency.setValueAtTime(2500 + Math.random() * 800, now);
            highOsc.type = 'sine';
            highGain.gain.setValueAtTime(0.03, now);
            highGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            highOsc.start(now);
            highOsc.stop(now + 0.2);
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
    
    // 🔁 棘轮戒指音效 - 棘齿咔嗒声
    playRatchetClick(velocity = 1) {
        if (!gameState.soundEnabled) return;
        this.init();
        const now = this.ctx.currentTime;
        
        // 棘齿咔嗒声（中频）
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.frequency.setValueAtTime(800 + Math.random() * 200, now);
        osc.type = gameState.soundPack === 'mechanical' ? 'square' : 'triangle';
        gain.gain.setValueAtTime(0.15 * velocity, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
        
        // 金属旋转声（高频）
        const metalOsc = this.ctx.createOscillator();
        const metalGain = this.ctx.createGain();
        metalOsc.connect(metalGain);
        metalGain.connect(this.ctx.destination);
        metalOsc.frequency.setValueAtTime(1500 + Math.random() * 500, now);
        metalOsc.type = 'sine';
        metalGain.gain.setValueAtTime(0.08 * velocity, now);
        metalGain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
        metalOsc.start(now);
        metalOsc.stop(now + 0.03);
    },
    
    // ⛓️ 磁力链音效 - 金属链条碰撞声
    playChainClack(velocity = 1) {
        if (!gameState.soundEnabled) return;
        this.init();
        const now = this.ctx.currentTime;
        
        // 金属碰撞声（高频随机）
        for (let i = 0; i < 3 + Math.random() * 2; i++) {
            const clickTime = now + (i * 0.03);
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.frequency.setValueAtTime(1200 + Math.random() * 800, clickTime);
            osc.type = 'triangle';
            gain.gain.setValueAtTime(0.12 * velocity, clickTime);
            gain.gain.exponentialRampToValueAtTime(0.01, clickTime + 0.05);
            osc.start(clickTime);
            osc.stop(clickTime + 0.05);
        }
        
        // 磁力吸附声（低频）
        const magOsc = this.ctx.createOscillator();
        const magGain = this.ctx.createGain();
        magOsc.connect(magGain);
        magGain.connect(this.ctx.destination);
        magOsc.frequency.setValueAtTime(200, now);
        magOsc.type = 'sine';
        magGain.gain.setValueAtTime(0.1 * velocity, now);
        magGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        magOsc.start(now);
        magOsc.stop(now + 0.08);
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

// ========== 棘轮戒指 ==========
function initRatchetRing() {
    const ratchetRing = document.getElementById('ring-outer');
    const ratchetClicksEl = document.getElementById('ratchet-clicks');
    if (!ratchetRing) return;
    
    let ratchetRotation = 0;
    let ratchetClicks = 0;
    let ratchetMode = 'one-way';
    let ratchetVelocity = 0;
    let lastRatchetClick = 0;
    
    // 模式切换
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            ratchetMode = btn.dataset.mode;
        });
    });
    
    let startAngle = 0;
    let isRotating = false;
    
    function getAngle(x, y) {
        const rect = ratchetRing.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        return Math.atan2(y - centerY, x - centerX) * 180 / Math.PI;
    }
    
    ratchetRing.addEventListener('pointerdown', (e) => {
        isRotating = true;
        startAngle = getAngle(e.clientX, e.clientY);
        ratchetRing.setPointerCapture(e.pointerId);
    });
    
    ratchetRing.addEventListener('pointermove', (e) => {
        if (!isRotating) return;
        const currentAngle = getAngle(e.clientX, e.clientY);
        let deltaAngle = currentAngle - startAngle;
        
        if (deltaAngle > 180) deltaAngle -= 360;
        if (deltaAngle < -180) deltaAngle += 360;
        
        const clickThreshold = 15;
        const now = Date.now();
        
        if (Math.abs(deltaAngle) >= clickThreshold) {
            const shouldClick = ratchetMode === 'two-way' || 
                               (ratchetMode === 'one-way' && deltaAngle > 0);
            
            if (shouldClick && now - lastRatchetClick > 50) {
                ratchetClicks++;
                ratchetRotation += deltaAngle > 0 ? 1 : -1;
                ratchetVelocity = Math.abs(deltaAngle) / 10;
                
                audioContext.playRatchetClick(Math.min(ratchetVelocity, 2));
                
                if (ratchetClicksEl) ratchetClicksEl.textContent = ratchetClicks.toLocaleString();
                
                if (navigator.vibrate && gameState.hapticEnabled) {
                    navigator.vibrate(15);
                }
                
                lastRatchetClick = now;
                startAngle = currentAngle;
            }
        }
        
        ratchetRing.style.transform = `rotate(${ratchetRotation * 15}deg)`;
    });
    
    ratchetRing.addEventListener('pointerup', (e) => {
        isRotating = false;
        try { ratchetRing.releasePointerCapture(e.pointerId); } catch(err) {}
    });
    
    ratchetRing.addEventListener('pointercancel', () => {
        isRotating = false;
    });
}

// ========== 磁力链 ==========
function initFidgetChain() {
    const fidgetChain = document.getElementById('fidget-chain');
    const chainClacksEl = document.getElementById('chain-clacks');
    if (!fidgetChain) return;
    
    let chainClacks = 0;
    let chainSegments = [];
    
    function createChainSegments() {
        fidgetChain.innerHTML = '';
        chainSegments = [];
        
        for (let i = 0; i < 8; i++) {
            const segment = document.createElement('div');
            segment.className = 'chain-segment';
            segment.style.transform = `translate(-50%, -50%) rotate(${i * 20 - 70}deg) translateY(${i * 8}px)`;
            segment.dataset.index = i;
            
            segment.addEventListener('pointerdown', () => {
                animateChainSegment(segment);
                playChainClack();
            });
            
            fidgetChain.appendChild(segment);
            chainSegments.push(segment);
        }
    }
    
    function animateChainSegment(segment) {
        const index = parseInt(segment.dataset.index);
        segment.style.transform = `translate(-50%, -50%) rotate(${index * 20 - 70 + 30}deg) translateY(${index * 8 + 10}px)`;
        
        setTimeout(() => {
            segment.style.transform = `translate(-50%, -50%) rotate(${index * 20 - 70}deg) translateY(${index * 8}px)`;
        }, 150);
    }
    
    function playChainClack() {
        chainClacks++;
        gameState.totalSpins++;
        gameState.sessionSpins++;
        if (chainClacksEl) chainClacksEl.textContent = chainClacks.toLocaleString();
        updateStats();
        
        audioContext.playChainClack(1);
        
        if (navigator.vibrate && gameState.hapticEnabled) {
            navigator.vibrate(20);
        }
        
        checkAchievements();
    }
    
    // 甩动链条
    let lastX = 0, lastY = 0, lastTime = 0;
    
    fidgetChain.addEventListener('pointermove', (e) => {
        const now = Date.now();
        const deltaX = e.clientX - lastX;
        const deltaY = e.clientY - lastY;
        const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / (now - lastTime + 1);
        
        if (velocity > 2 && now - lastTime > 100) {
            chainSegments.forEach((seg, i) => {
                if (Math.random() > 0.5) {
                    setTimeout(() => animateChainSegment(seg), i * 30);
                }
            });
            playChainClack();
        }
        
        lastX = e.clientX;
        lastY = e.clientY;
        lastTime = now;
    });
    
    createChainSegments();
}

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    createPopitBoard();
    createSquishyParticles();
    initRatchetRing();
    initFidgetChain();
    updateStats();
    applySkin();
    
    // 首次点击初始化 AudioContext
    document.body.addEventListener('click', () => audioContext.init(), { once: true });
});

// 页面关闭前保存
window.addEventListener('beforeunload', saveState);
