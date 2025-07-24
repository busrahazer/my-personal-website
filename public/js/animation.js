// Navigasyon – dokunma!
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

// Dil Değiştirici
document.getElementById('langSwitcher').addEventListener('change', function () {
  i18next.changeLanguage(this.value, () => {
    $('body').localize();
  });
});

// CANVAS
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// SPRITE'lar
const sprites = {
  idle:     { src: 'img/piskel/idle.png',     frames: 6, loop: true },
  walk:     { src: 'img/piskel/walk.png',     frames: 8, loop: true },
  run:      { src: 'img/piskel/run.png',      frames: 8, loop: true },
  attack:   { src: 'img/piskel/attack1.png',  frames: 6, loop: false },
  die:      { src: 'img/piskel/die.png',      frames: 5, loop: false },
  attack2:  { src: 'img/piskel/attack2.png',  frames: 10, loop: false },
  attack4:  { src: 'img/piskel/attack4.png',  frames: 3, loop: false },
  jump:     { src: 'img/piskel/jump.png',     frames: 8, loop: false },
  hurt:     { src: 'img/piskel/hurt.png',     frames: 2, loop: false },
};

let images = {};
let loaded = 0;
let currentAnim = 'idle';
let frame = 0;
let animSpeed = 0.15;
let lastFrameTime = 0;
let isDying = false;
let isAttacking = false;

// Pozisyon
let charX = window.innerWidth / 2;
let charY = window.innerHeight / 2;
let targetX = charX;
let targetY = charY;

// Mouse
let lastMouse = { x: charX, y: charY, time: Date.now() };
let mouseSpeed = 0;
let lastMouseMoveTime = Date.now();

// Sprite yükle
Object.keys(sprites).forEach(key => {
  const img = new Image();
  img.src = sprites[key].src;
  img.onload = () => {
    loaded++;
    images[key] = img;
  };
});

// Mouse hareket
window.addEventListener('mousemove', e => {
  const now = Date.now();
  targetX = e.clientX;
  targetY = e.clientY;

  const dx = targetX - lastMouse.x;
  const dy = targetY - lastMouse.y;
  const dt = now - lastMouse.time;
  mouseSpeed = Math.sqrt(dx * dx + dy * dy) / dt;

  lastMouse = { x: targetX, y: targetY, time: now };
  lastMouseMoveTime = now;

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

// Mouse tıklama — attack1
window.addEventListener('click', () => {
  if (!isDying) {
    currentAnim = 'attack';
    frame = 0;
    isAttacking = true;
  }
});

// Mouse basılı — attack4
window.addEventListener('mousedown', () => {
  if (!isDying) {
    currentAnim = 'attack4';
    frame = 0;
    isAttacking = true;
  }
});

// Hareketsizlik — attack2
setInterval(() => {
  if (!isAttacking && !isDying && Date.now() - lastMouseMoveTime > 3000) {
    currentAnim = 'attack2';
    frame = 0;
    isAttacking = true;
  }
}, 1000);

// Scroll ile jump / die / hurt
let jumped = false;
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;

  if (scrollY > 100 && !jumped && !isDying) {
    currentAnim = 'jump';
    frame = 0;
    isAttacking = true;
    jumped = true;
  }

  if (scrollY >= maxScroll - 10 && !isDying) {
    currentAnim = 'die';
    frame = 0;
    isDying = true;
  }

  if (scrollY < 50 && isDying) {
    currentAnim = 'hurt';
    frame = 0;
    isDying = false;
  }
});

// Çizim
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

  // Frame ilerlet
  if (Date.now() - lastFrameTime > 1000 / 24) {
    frame += animSpeed * 2;
    if (frame >= sprite.frames) {
      if (sprite.loop) {
        frame = 0;
      } else {
        frame = sprite.frames - 1;

        if (['attack', 'attack2', 'attack4', 'jump', 'hurt'].includes(currentAnim)) {
          isAttacking = false;
          currentAnim = mouseSpeed > 0.5 ? 'run' : mouseSpeed > 0.05 ? 'walk' : 'idle';
          frame = 0;
        }

        if (currentAnim === 'die') {
          // Ölü kaldı
        }
      }
    }
    lastFrameTime = Date.now();
  }

  requestAnimationFrame(draw);
}

function checkLoaded() {
  if (loaded >= Object.keys(sprites).length) {
    draw();
  } else {
    setTimeout(checkLoaded, 100);
  }
}
checkLoaded();
