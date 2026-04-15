document.addEventListener('DOMContentLoaded', () => {

    // 1. Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // trigger once immediately

    // 2. 3D Tilt Effect for Photo Grid Items
    const bentoItems = document.querySelectorAll('.bento-item');
    
    bentoItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xOffset = (x / rect.width - 0.5) * 15; // Max 15 degree rotation
            const yOffset = (y / rect.height - 0.5) * 15;
            
            item.style.transform = `perspective(1000px) rotateX(${-yOffset}deg) rotateY(${xOffset}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
            item.style.transition = `transform 0.5s ease`;
        });

        item.addEventListener('mouseenter', () => {
            item.style.transition = `none`; // remove transition for smooth tracking
        });
    });

    // 3. New Year Fireworks Effect (Canvas)
    const canvas = document.getElementById('fireworksCanvas');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        class Particle {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                this.color = color;
                this.radius = Math.random() * 2 + 1.5;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 6 + 2;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.friction = 0.95;
                this.gravity = 0.05;
                this.alpha = 1;
                this.decay = Math.random() * 0.015 + 0.015;
            }

            update() {
                this.vx *= this.friction;
                this.vy *= this.friction;
                this.vy += this.gravity;
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= this.decay;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                /* shadowBlur dinonaktifkan murni agar performa ngescroll HP super halus (60fps) */
                ctx.fill();
                ctx.restore();
            }
        }

        let particles = [];
        const colors = ['#f43f5e', '#ec4899', '#d946ef', '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#facc15'];

        function createFireworks(x, y) {
            const particleCount = 50;
            const color = colors[Math.floor(Math.random() * colors.length)];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(x, y, color));
            }
        }

        function animateFireworks() {
            requestAnimationFrame(animateFireworks);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle, index) => {
                if (particle.alpha <= 0) {
                    particles.splice(index, 1);
                } else {
                    particle.update();
                    particle.draw();
                }
            });
        }

        // Jalankan kembang api secukupnya di awal (biar HP tidak lag saat layarnya di-scroll)
        setTimeout(() => createFireworks(canvas.width * 0.2, canvas.height * 0.3), 500);
        setTimeout(() => createFireworks(canvas.width * 0.8, canvas.height * 0.4), 1200);
        setTimeout(() => createFireworks(canvas.width * 0.5, canvas.height * 0.2), 2000);
        
        animateFireworks();

        // 4. Gift Box Logic inside Fireworks Context
        const giftBoxBtn = document.getElementById('giftBoxBtn');
        if (giftBoxBtn) {
            giftBoxBtn.addEventListener('click', function() {
                // Mencegah klik berulang kali saat sudah ditekan
                if (this.dataset.opening === "true") return;
                this.dataset.opening = "true";

                const giftBoxContainer = document.getElementById('giftBoxContainer');
                const giftHint = this.querySelector('.gift-hint');
                const giftIcon = this.querySelector('.gift-icon');
                const grid = document.getElementById('wkwkwkGrid');
                
                // Mengubah animasi kado bergetar lebih cepat
                giftIcon.style.animation = 'wiggle 0.3s infinite ease-in-out';
                giftIcon.style.transform = 'scale(1.2)';
                this.style.background = 'rgba(255, 230, 240, 0.9)';
                
                let timeLeft = 5;
                giftHint.textContent = `Tunggu... Membuka dalam ${timeLeft}`;
                
                // Hitung Mundur
                const countdown = setInterval(() => {
                    timeLeft--;
                    if (timeLeft > 0) {
                        giftHint.textContent = `Tunggu... Membuka dalam ${timeLeft}`;
                        giftIcon.style.transform = `scale(${1.2 + (5 - timeLeft) * 0.1})`; // Makin lama makin besar
                    } else {
                        // Waktu Habis - BUKA KADONYA
                        clearInterval(countdown);
                        
                        // Sembunyikan Kado
                        giftBoxContainer.style.display = 'none';
                        
                        // Tampilkan Grid Aib
                        grid.classList.add('show-grid');

                        // Ledakkan kembang api super meriah
                        setTimeout(() => createFireworks(canvas.width * 0.2, canvas.height * 0.4), 100);
                        setTimeout(() => createFireworks(canvas.width * 0.5, canvas.height * 0.3), 300);
                        setTimeout(() => createFireworks(canvas.width * 0.8, canvas.height * 0.4), 500);
                        setTimeout(() => createFireworks(canvas.width * 0.5, canvas.height * 0.6), 800);
                    }
                }, 1000); // 1 detik interval
            });
        }
    }

    // 5. Lightbox Logic (Fitur Klik Perbesar Gambar)
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.querySelector('.lightbox-close');
    const allBentoItems = document.querySelectorAll('.bento-item');

    if (lightbox && lightboxImg) {
        allBentoItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (img) {
                    lightboxImg.src = img.src;
                    lightbox.classList.add('show');
                    document.body.style.overflow = 'hidden'; // Kunci scroll layar saat dibuka
                }
            });
        });

        // Fitur Tombol Tutup
        const closeLightbox = () => {
            lightbox.classList.remove('show');
            document.body.style.overflow = 'auto'; // Buka kunci scroll
        };

        if(lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

        // Jika mengklik di area hitam (bukan pada gambar), tutup juga
        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) {
                closeLightbox();
            }
        });
    }

});
