// NAVİGASYON
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

// ANİMASYONLAR
window.addEventListener('DOMContentLoaded', () => {
    const girl = document.getElementById("pixelGirl");
    if (!girl) {
        console.warn("pixelGirl bulunamadı!");
        return;
    }

    // --- EL SALLAMA ---
    let waving = true;
    let waveFrame = 1;
    const waveInterval = setInterval(() => {
        if (!waving) return;
        waveFrame = waveFrame === 1 ? 2 : 1;
        girl.src = `img/pixel-elsallama${waveFrame}.png`;
    }, 500);

    // --- YÜRÜME ---
    let walkIndex = 1;
    let walking = false;
    let walkInterval;

    function startWalking() {
        waving = false;
        clearInterval(waveInterval);
        if (walking) return;
        walking = true;
        walkInterval = setInterval(() => {
            walkIndex = walkIndex % 4 + 1;
            girl.src = `img/pixel-yurume${walkIndex}.png`;
        }, 200);
    }

    function stopWalking() {
        walking = false;
        clearInterval(walkInterval);
        girl.src = "img/pixel-duzdurus1.png";
    }

    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => startWalking());
        card.addEventListener('mouseleave', () => {
            stopWalking();
            waving = true;
        });
    });

    // --- İNİŞ ANİMASYONU ---
    function playLandingAnimation() {
        const frames = [
            "img/pixel-inis1.png",
            "img/pixel-inis2.png",
            "img/pixel-inis3.png",
            "img/pixel-inis4.png"
        ];
        let index = 0;
        const interval = setInterval(() => {
            girl.src = frames[index];
            index++;
            if (index >= frames.length) {
                clearInterval(interval);
                girl.src = "img/pixel-duzdurus1.png";
            }
        }, 200);
    }

    // --- SCROLL TETİKLEYİCİ ---
    let landingPlayed = false;
    window.addEventListener('scroll', () => {
        const aboutSection = document.getElementById("about");
        if (!aboutSection) return;

        const top = aboutSection.getBoundingClientRect().top;
        if (top < window.innerHeight / 2 && !landingPlayed) {
            landingPlayed = true;
            playLandingAnimation();
        }
    });
});
