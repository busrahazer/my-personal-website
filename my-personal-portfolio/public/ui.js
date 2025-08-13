
        // Animated Background Particles
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 50;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.width = Math.random() * 4 + 2 + 'px';
                particle.style.height = particle.style.width;
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = Math.random() * 4 + 4 + 's';
                particlesContainer.appendChild(particle);
            }
        }

        // Smooth Scrolling
        function smoothScroll() {
            const links = document.querySelectorAll('a[href^="#"]');
            links.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        }

        // Scroll Animation Observer
        function observeElements() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            const elementsToObserve = document.querySelectorAll('.experience-item, .project-card, .blog-post');
            elementsToObserve.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(50px)';
                el.style.transition = 'all 0.8s ease';
                observer.observe(el);
            });
        }

        // Header Scroll Effect
        function headerScrollEffect() {
            const header = document.querySelector('header');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    // header.style.background = 'rgba(0, 0, 0, 0.9)';
                    header.style.backdropFilter = 'blur(20px)';
                } else {
                    // header.style.background = 'rgba(255, 255, 255, 0.1)';
                    header.style.backdropFilter = 'blur(10px)';
                }
            });
        }

        // Mouse Move Parallax Effect
        function parallaxEffect() {
            document.addEventListener('mousemove', (e) => {
                const mouseX = e.clientX / window.innerWidth;
                const mouseY = e.clientY / window.innerHeight;
                
                const particles = document.querySelectorAll('.particle');
                particles.forEach((particle, index) => {
                    const speed = (index % 5 + 1) * 0.5;
                    const x = (mouseX - 0.5) * speed;
                    const y = (mouseY - 0.5) * speed;
                    particle.style.transform = `translate(${x}px, ${y}px)`;
                });
            });
        }

        // Add a function to animate hero section on load
        function animateHero() {
            let delay = 0.5;
            const heroElements = document.querySelectorAll('.hero-text h1, .hero-text .subtitle, .hero-text .subsubtitle, .hero-text .description, .hero-text .cta-button, .hero-visual');
            heroElements.forEach(el => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, delay * 1000);
                delay += 0.2;
            });
        }

        // Initialize all functions
        document.addEventListener('DOMContentLoaded', () => {
            createParticles();
            smoothScroll();
            observeElements();
            headerScrollEffect();
            parallaxEffect();
            
        });
        
       