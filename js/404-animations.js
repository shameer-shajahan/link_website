document.addEventListener("DOMContentLoaded", () => {
    // Interactive crumpled paper physics
    const papers = document.querySelectorAll('.paper-sheet');
    const jammedPaper = document.querySelector('.jammed-paper');
    
    // Mouse interaction with crumpled papers
    papers.forEach(paper => {
        const speed = parseFloat(paper.dataset.speed) || 0.5;
        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) * speed;
            mouseY = (e.clientY - window.innerHeight / 2) * speed;
        });
        
        function animatePaper() {
            currentX += (mouseX - currentX) * 0.1;
            currentY += (mouseY - currentY) * 0.1;
            
            const baseTransform = paper.style.transform || '';
            const rotation = baseTransform.match(/rotate\([^)]+\)/) ? baseTransform.match(/rotate\([^)]+\)/)[0] : 'rotate(0deg)';
            const scale = baseTransform.match(/scale\([^)]+\)/) ? baseTransform.match(/scale\([^)]+\)/)[0] : 'scale(1)';
            
            paper.style.transform = `${rotation} ${scale} translate(${currentX}px, ${currentY}px)`;
            
            requestAnimationFrame(animatePaper);
        }
        animatePaper();
    });
    
    // Jammed paper shake effect
    if (jammedPaper) {
        setInterval(() => {
            jammedPaper.style.animation = 'none';
            setTimeout(() => {
                jammedPaper.style.animation = 'jammedShake 0.5s infinite alternate';
            }, 10);
        }, 3000);
    }
    
    // Particle system
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        const duration = 8 + Math.random() * 4;
        const delay = index * 1.5;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
    });
    
    // Error button interaction
    const errorButton = document.querySelector('.error-button');
    if (errorButton) {
        errorButton.addEventListener('click', () => {
            // Create paper explosion effect
            createPaperExplosion();
        });
    }
    
    function createPaperExplosion() {
        const explosionContainer = document.createElement('div');
        explosionContainer.style.position = 'absolute';
        explosionContainer.style.top = '50%';
        explosionContainer.style.left = '50%';
        explosionContainer.style.transform = 'translate(-50%, -50%)';
        explosionContainer.style.pointerEvents = 'none';
        explosionContainer.style.zIndex = '20';
        
        for (let i = 0; i < 20; i++) {
            const paper = document.createElement('div');
            paper.style.position = 'absolute';
            paper.style.width = '20px';
            paper.style.height = '30px';
            paper.style.background = 'white';
            paper.style.border = '1px solid var(--light-grey)';
            paper.style.borderRadius = '2px';
            paper.style.left = '0';
            paper.style.top = '0';
            paper.style.transform = 'translate(-50%, -50%)';
            
            const angle = (Math.PI * 2 * i) / 20;
            const velocity = 200 + Math.random() * 300;
            const lifetime = 1000 + Math.random() * 1000;
            
            document.body.appendChild(paper);
            
            let startTime = Date.now();
            let opacity = 1;
            
            function animateExplosion() {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / lifetime;
                
                if (progress >= 1) {
                    paper.remove();
                    return;
                }
                
                const distance = velocity * progress;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance + (progress * progress * 100);
                const rotation = progress * 720;
                
                paper.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rotation}deg)`;
                paper.style.opacity = 1 - progress;
                
                requestAnimationFrame(animateExplosion);
            }
            
            animateExplosion();
        }
    }
    
    // Parallax effect on scroll (though page doesn't scroll, for completeness)
    let ticking = false;
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.paper-sheet, .particle');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Add hover effects to error title
    const errorTitle = document.querySelector('.error-title');
    if (errorTitle) {
        errorTitle.addEventListener('mouseenter', () => {
            errorTitle.style.animation = 'errorPulse 0.5s infinite alternate, shake 0.2s infinite';
        });
        
        errorTitle.addEventListener('mouseleave', () => {
            errorTitle.style.animation = 'errorPulse 2s infinite alternate';
        });
    }
    
    // Add shake animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
});
