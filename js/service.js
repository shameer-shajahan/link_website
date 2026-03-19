document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // 1. Initial Hero Stagger
    gsap.from('.service-hero .slide-content > *', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power4.out',
        delay: 0.5
    });

    // 2. Intro Text Reveal
    gsap.from('.intro-content-premium > *', {
        scrollTrigger: {
            trigger: '.service-intro',
            start: 'top 80%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    });

    // 3. Bento Grid Cards Reveal
    const cards = gsap.utils.toArray('.service-card');
    cards.forEach((card, i) => {
        const isLeft = card.classList.contains('alternate-left');
        
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            x: isLeft ? -50 : 50,
            opacity: 0,
            duration: 1.2,
            ease: 'expo.out',
        });

        // Image Parallax within cards
        const img = card.querySelector('img');
        if (img) {
            gsap.to(img, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                },
                yPercent: 10,
                ease: 'none'
            });
        }
    });

    // 4. Hover Magnetic effect for buttons (Optional but premium)
    const btns = document.querySelectorAll('.service-btn');
    btns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 1.5,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
});
