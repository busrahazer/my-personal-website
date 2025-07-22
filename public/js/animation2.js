/**
 * animation.js
 * Enchantress karakter animasyonlarını web site hareketlerine entegre eder.
 * Karakterin animasyonları: idle, walk, run, die, attack
 * Animasyonlar PNG sprite sheet olarak varsayılmıştır.
 */
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');

      if (href === '#footer') {
        e.preventDefault();
        document.querySelector('footer').scrollIntoView({ behavior: 'smooth' });

        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });

const canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 400;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Sprite sheet bilgileri
const sprites = {
    idle: { src: 'idle.png', frames: 6, loop: true },
    walk: { src: 'walk.png', frames: 8, loop: true },
    run: { src: 'run.png', frames: 8, loop: true },
    die: { src: 'die.png', frames: 5, loop: false },
    attack: { src: 'attack.png', frames: 6, loop: false }
};

let images = {};
let loaded = 0;
let currentAnim = 'idle';
let frame = 0;
let animSpeed = 0.15;
let lastFrameTime = 0;
let isDying = false;
let isAttacking = false;

// Karakter pozisyonu
let charX = canvas.width / 2;
let charY = canvas.height / 2;
let targetX = charX;
let targetY = charY;

// Mouse hareketi için
let lastMouse = { x: charX, y: charY, time: Date.now() };
let mouseSpeed = 0;

// Sprite'ları yükle
Object.keys(sprites).forEach(key => {
    const img = new Image();
    img.src = sprites[key].src;
    img.onload = () => {
        loaded++;
        images[key] = img;
    };
});

// Scroll hareketi
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    charY = canvas.height / 2 + (scrollY / maxScroll) * (canvas.height / 2 - 50);

    // En alt sayfa: ölme animasyonu
    if (scrollY >= maxScroll - 5 && !isDying) {
        currentAnim = 'die';
        frame = 0;
        isDying = true;
    }
});

// Mouse hareketi
window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    targetX = e.clientX - rect.left;
    targetY = e.clientY - rect.top;

    // Mouse hızı
    const now = Date.now();
    const dx = targetX - lastMouse.x;
    const dy = targetY - lastMouse.y;
    const dt = now - lastMouse.time;
    mouseSpeed = Math.sqrt(dx * dx + dy * dy) / dt;

    lastMouse = { x: targetX, y: targetY, time: now };

    // Animasyon seçimi
    if (!isDying && !isAttacking) {
        if (mouseSpeed > 0.5) {
            currentAnim = 'run';
            animSpeed = 0.25;
        } else if (mouseSpeed > 0.05) {
            currentAnim = 'walk';
            animSpeed = 0.15;
        } else {
            currentAnim = 'idle';
            animSpeed = 0.1;
        }
    }
});

// Tıklama: attack animasyonu
window.addEventListener('click', () => {
    if (!isDying) {
        currentAnim = 'attack';
        frame = 0;
        isAttacking = true;
    }
});

// Animasyon döngüsü
function draw() {
    if (loaded < Object.keys(sprites).length) {
        requestAnimationFrame(draw);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Karakteri mouse'a doğru hareket ettir
    charX += (targetX - charX) * animSpeed;
    charY += (targetY - charY) * animSpeed;

    // Sprite çizimi
    const sprite = sprites[currentAnim];
    const img = images[currentAnim];
    const frameWidth = img.width / sprite.frames;
    ctx.drawImage(
        img,
        Math.floor(frame) * frameWidth, 0, frameWidth, img.height,
        charX - frameWidth / 2, charY - img.height / 2, frameWidth, img.height
    );

    // Frame ilerletme
    if (Date.now() - lastFrameTime > 1000 / 24) {
        frame += animSpeed * 2;
        if (frame >= sprite.frames) {
            if (sprite.loop) {
                frame = 0;
            } else {
                frame = sprite.frames - 1;
                // Die veya attack bittiğinde eski animasyona dön
                if (currentAnim === 'die') {
                    // Karakter öldü, animasyon durur
                } else if (currentAnim === 'attack') {
                    isAttacking = false;
                    currentAnim = mouseSpeed > 0.5 ? 'run' : mouseSpeed > 0.05 ? 'walk' : 'idle';
                    frame = 0;
                }
            }
        }
        lastFrameTime = Date.now();
    }

    requestAnimationFrame(draw);
}

// Giriş sayfası kontrolü
if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    currentAnim = 'idle';
}

draw();