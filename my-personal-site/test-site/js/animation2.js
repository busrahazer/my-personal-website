// CANVAS OLUŞTUR
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Tam ekran ayarla
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // İlk başta çalıştır

// SPRITE TANIMLARI
const sprites = {
  idle:   { src: 'img-test/idle.png',   frames: 6, loop: true },
  walk:   { src: 'img-test/walk.png',   frames: 8, loop: true },
  run:    { src: 'img-test/run.png',    frames: 8, loop: true },
  attack: { src: 'img-test/attack.png', frames: 6, loop: false },
  die:    { src: 'img-test/die.png',    frames: 5, loop: false },
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

// Mouse hızı
let lastMouse = { x: charX, y: charY, time: Date.now() };
let mouseSpeed = 0;

// SPRITE'LARI YÜKLE
Object.keys(sprites).forEach(key => {
  const img = new Image();
  img.src = sprites[key].src;
  img.onload = () => {
    loaded++;
    images[key] = img;
  };
});

// MOUSE HAREKETİ
window.addEventListener('mousemove', e => {
  const now = Date.now();
  targetX = e.clientX;
  targetY = e.clientY;

  const dx = targetX - lastMouse.x;
  const dy = targetY - lastMouse.y;
  const dt = now - lastMouse.time;
  mouseSpeed = Math.sqrt(dx * dx + dy * dy) / dt;

  lastMouse = { x: targetX, y: targetY, time: now };

  if (!isAttacking && !isDying) {
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

// TIKLAMA — ATTACK ANİMASYONU
window.addEventListener('click', () => {
  if (!isDying) {
    currentAnim = 'attack';
    frame = 0;
    isAttacking = true;
  }
});

// SCROLL — DIE ANİMASYONU
window.addEventListener('scroll', () => {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const scrollY = window.scrollY;

  if (scrollY >= maxScroll - 10 && !isDying) {
    currentAnim = 'die';
    frame = 0;
    isDying = true;
  }
});

// ANİMASYON ÇİZİMİ
function draw() {
  if (loaded < Object.keys(sprites).length) {
    requestAnimationFrame(draw);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Konum güncelle
  charX += (targetX - charX) * animSpeed;
  charY += (targetY - charY) * animSpeed;

  const sprite = sprites[currentAnim];
  const img = images[currentAnim];
  const frameWidth = img.width / sprite.frames;

  ctx.drawImage(
    img,
    Math.floor(frame) * frameWidth, 0, frameWidth, img.height,
    charX - frameWidth / 2, charY - img.height / 2,
    frameWidth, img.height
  );

  // Frame ilerletme
  if (Date.now() - lastFrameTime > 1000 / 24) {
    frame += animSpeed * 2;
    if (frame >= sprite.frames) {
      if (sprite.loop) {
        frame = 0;
      } else {
        frame = sprite.frames - 1;

        if (currentAnim === 'attack') {
          isAttacking = false;
          currentAnim = mouseSpeed > 0.5 ? 'run' : mouseSpeed > 0.05 ? 'walk' : 'idle';
          frame = 0;
        }

        if (currentAnim === 'die') {
          // Karakter ölü kaldı, tekrar animasyon başlamaz
        }
      }
    }
    lastFrameTime = Date.now();
  }

  requestAnimationFrame(draw);
}

// YÜKLENME TAMAMSA BAŞLAT
function checkLoaded() {
  if (loaded >= Object.keys(sprites).length) {
    draw();
  } else {
    setTimeout(checkLoaded, 100);
  }
}
checkLoaded();
