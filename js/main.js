// Import Lenis for smooth scrolling
document.addEventListener("DOMContentLoaded", () => {
    let scrollStateTimeout;
    // 1. Initialize Smooth Scrolling with Lenis
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    // lenis.on('scroll', (e) => {
    //     console.log(e)
    // })

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // GSAP ScrollTrigger Integration with Lenis
    gsap.registerPlugin(ScrollTrigger);

    lenis.on('scroll', ScrollTrigger.update)

    // Mobile scroll state for card overlay visibility
    lenis.on('scroll', () => {
        if (!document.body.classList.contains('home-page')) return;
        if (!window.matchMedia('(max-width: 600px)').matches) return;

        document.body.classList.add('is-scrolling');
        clearTimeout(scrollStateTimeout);
        scrollStateTimeout = setTimeout(() => {
            document.body.classList.remove('is-scrolling');
        }, 180);
    });

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    // Homepage image loading states
    const homeImagePairs = [
        ['.home-page .service-card .image', '.service-card'],
        ['.home-page .product-link .image', '.product-link'],
        ['.home-page .card-image .image', '.card-image'],
        ['.home-page .product-card-image .image', '.product-card-image'],
        ['.home-page .brand-card .brand-logo', '.brand-card'],
        ['.home-page .sticky-big-image img', '.sticky-big-image'],
        ['.home-page .sticky-small-image img', '.sticky-small-image'],
        ['.home-page .sticky-medium-image img', '.sticky-medium-image'],
        ['.home-page .sticky-component img', '.sticky-component']
    ];

    homeImagePairs.forEach(([imageSelector, wrapperSelector]) => {
        document.querySelectorAll(imageSelector).forEach((img) => {
            const wrapper = img.closest(wrapperSelector);
            if (!wrapper) return;

            const markLoaded = () => wrapper.classList.add('is-loaded');

            if (img.complete) {
                markLoaded();
            } else {
                img.addEventListener('load', markLoaded, { once: true });
                img.addEventListener('error', markLoaded, { once: true });
            }
        });
    });

    // 3. Gallery Page Animations
    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-up');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all elements with fade-up class
    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(element => {
        galleryObserver.observe(element);
    });
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const hasHoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    if (!hasHoverPointer) {
        if (cursorDot) cursorDot.remove();
        if (cursorOutline) cursorOutline.remove();
    }

    if (cursorDot && cursorOutline && hasHoverPointer) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        function animateCursor() {
            let dx = mouseX - outlineX;
            let dy = mouseY - outlineY;

            outlineX += dx * 0.15;
            outlineY += dy * 0.15;

            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();
    }

    const linksAndBtns = document.querySelectorAll('a, button, .product-card, .small-card, .gallery-item-enhanced, .staff-card-enhanced, .info-block, .menu-button, .menu-link, .social-link, .map-btn, .glass-submit-btn');
    linksAndBtns.forEach(el => {
        if (!cursorOutline) return;
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.backgroundColor = 'rgba(255, 140, 0, 0.2)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.backgroundColor = 'transparent';
        });
    });

    // 3. Dynamic Island Header - Hide on scroll down, show on scroll up
    const liquidHeader = document.querySelector('.liquid-header');
    let lastScrollY = 0;
    let ticking = false;

    // Use Lenis scroll event for smoother detection
    if (liquidHeader) {
        lenis.on('scroll', ({ scroll }) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const currentScrollY = scroll;

                    if (currentScrollY > lastScrollY && currentScrollY > 100) {
                        liquidHeader.classList.add('hidden');
                    } else if (currentScrollY < lastScrollY) {
                        liquidHeader.classList.remove('hidden');
                    }

                    lastScrollY = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (e.clientY < 100) {
                liquidHeader.classList.remove('hidden');
            }
        });
    }

    // Header cursor effects
    if (liquidHeader && cursorOutline) {
        liquidHeader.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.3)';
            cursorOutline.style.borderColor = 'rgba(255, 140, 0, 0.5)';
        });

        liquidHeader.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.borderColor = 'rgba(255, 140, 0, 0.5)';
        });
    }

    // Simple Menu Button Toggle
    const menuButton = document.getElementById('menuButton');
    const expandedMenu = document.querySelector('.expanded-menu');
    const logoLink = document.querySelector('.logo-link');
    let menuOpen = false;

    // Scroll to top when clicking logo on index page
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            const href = logoLink.getAttribute('href');
            if (href === 'index.html' || href === './' || href === '/') {
                e.preventDefault();
                lenis.scrollTo(0, { duration: 1.5 });
                // Close menu if open
                if (menuOpen) {
                    menuOpen = false;
                    expandedMenu.style.transform = 'translateX(-50%) scaleY(0)';
                    expandedMenu.style.opacity = '0';
                    expandedMenu.style.visibility = 'hidden';
                    menuButton.classList.remove('active');
                }
            }
        });
    }

    if (menuButton && expandedMenu) {
        menuButton.addEventListener('click', () => {
            menuOpen = !menuOpen;
            if (menuOpen) {
                expandedMenu.style.transform = 'translateX(-50%) scaleY(1)';
                expandedMenu.style.opacity = '1';
                expandedMenu.style.visibility = 'visible';
                menuButton.classList.add('active');
            } else {
                expandedMenu.style.transform = 'translateX(-50%) scaleY(0)';
                expandedMenu.style.opacity = '0';
                expandedMenu.style.visibility = 'hidden';
                menuButton.classList.remove('active');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuButton.contains(e.target) && !expandedMenu.contains(e.target) && menuOpen) {
                menuOpen = false;
                expandedMenu.style.transform = 'translateX(-50%) scaleY(0)';
                expandedMenu.style.opacity = '0';
                expandedMenu.style.visibility = 'hidden';
                menuButton.classList.remove('active');
            }
        });

        // Enhanced cursor effects for menu button
        menuButton.addEventListener('mouseenter', () => {
            if (!cursorOutline) return;
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.backgroundColor = 'rgba(255, 140, 0, 0.2)';
        });

        menuButton.addEventListener('mouseleave', () => {
            if (!cursorOutline) return;
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.backgroundColor = 'transparent';
        });
    }

    // 4. Banner Video - Mouse movement control (use section as container)
    const bannerVideo = document.getElementById('bannerVideo');
    const videoSection = document.getElementById('banner-video');

    if (bannerVideo && videoSection && window.matchMedia('(hover: hover)').matches) {
        bannerVideo.muted = true;
        bannerVideo.playsInline = true;
        bannerVideo.loop = true;
        bannerVideo.pause();
        bannerVideo.currentTime = 0;

        bannerVideo.addEventListener('loadedmetadata', () => {
            bannerVideo.pause();
            bannerVideo.currentTime = 0;
        }, { once: true });

        let targetProgress = 0;
        let currentProgress = 0;
        let isMouseOverVideo = false;

        videoSection.addEventListener('mouseenter', () => { isMouseOverVideo = true; });
        videoSection.addEventListener('mouseleave', () => { isMouseOverVideo = false; });

        videoSection.addEventListener('mousemove', (e) => {
            if (!isMouseOverVideo) return;
            const rect = videoSection.getBoundingClientRect();
            const mouseY = e.clientY - rect.top;
            targetProgress = Math.max(0, Math.min(1, mouseY / rect.height));
        });

        function updateVideoFrame() {
            if (bannerVideo.duration && bannerVideo.readyState >= 2) {
                const lerpSpeed = 0.15;
                currentProgress += (targetProgress - currentProgress) * lerpSpeed;
                const targetTime = currentProgress * bannerVideo.duration;
                if (Math.abs(bannerVideo.currentTime - targetTime) > 0.02) {
                    bannerVideo.currentTime = targetTime;
                }
            }
            requestAnimationFrame(updateVideoFrame);
        }
        updateVideoFrame();

        videoSection.addEventListener('click', () => {
            if (!isMouseOverVideo) {
                bannerVideo.play().catch(e => console.log("Play failed:", e));
            }
        });
    }

    // Mobile Image Slider - First Slider (6 slides)
    const mobileSlider = document.getElementById('mobileSlider');
    if (mobileSlider) {
        const slides = mobileSlider.querySelectorAll('.slide');
        let currentSlide = 0;
        let slideInterval;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.remove('active', 'prev');
                if (i === index) {
                    slide.classList.add('active');
                } else if (i < index) {
                    // Previous slides slide out to the right
                    slide.classList.add('prev');
                } else {
                    // Next slides slide out to the left
                    slide.classList.add('prev');
                }
            });

            currentSlide = index;
        }

        function nextSlide() {
            const next = (currentSlide + 1) % slides.length;
            showSlide(next);
        }

        function prevSlide() {
            const prev = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(prev);
        }

        // Auto-play
        function startInterval() {
            slideInterval = setInterval(nextSlide, 4000);
        }

        function resetInterval() {
            clearInterval(slideInterval);
            startInterval();
        }

        // Touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        const sliderContainer = mobileSlider.querySelector('.slider-container');
        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                resetInterval();
            }
        }

        // Start auto-play
        startInterval();
    }

    // Mobile Image Slider - Second Slider
    const mobileSlider2 = document.getElementById('mobileSlider2');
    if (mobileSlider2) {
        const slides2 = mobileSlider2.querySelectorAll('.slide');
        let currentSlide2 = 0;
        let slideInterval2;

        function showSlide2(index) {
            slides2.forEach((slide, i) => {
                slide.classList.remove('active', 'prev');
                if (i === index) {
                    slide.classList.add('active');
                } else if (i === 0 && index === 1) {
                    // First slide becomes previous when second is active - slide left
                    slide.classList.add('prev');
                } else if (i === 1 && index === 0) {
                    // Second slide becomes previous when first is active - slide right
                    slide.classList.add('prev');
                }
            });

            currentSlide2 = index;
        }

        function nextSlide2() {
            const next = (currentSlide2 + 1) % slides2.length;
            showSlide2(next);
        }

        function prevSlide2() {
            const prev = (currentSlide2 - 1 + slides2.length) % slides2.length;
            showSlide2(prev);
        }

        // Auto-play
        function startInterval2() {
            slideInterval2 = setInterval(nextSlide2, 4000);
        }

        function resetInterval2() {
            clearInterval(slideInterval2);
            startInterval2();
        }

        // Touch swipe support
        let touchStartX2 = 0;
        let touchEndX2 = 0;

        const sliderContainer2 = mobileSlider2.querySelector('.slider-container');
        sliderContainer2.addEventListener('touchstart', (e) => {
            touchStartX2 = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderContainer2.addEventListener('touchend', (e) => {
            touchEndX2 = e.changedTouches[0].screenX;
            handleSwipe2();
        }, { passive: true });

        function handleSwipe2() {
            const diff = touchStartX2 - touchEndX2;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide2();
                } else {
                    prevSlide2();
                }
                resetInterval2();
            }
        }

        // Start auto-play
        startInterval2();
    }

    // 5. Homepage scroll animations

    // Header Blur on Scroll
    if (document.querySelector(".header-glass")) {
        gsap.to(".header-glass", {
            scrollTrigger: {
                trigger: "body",
                start: "top -50",
                end: "top -50",
                toggleActions: "play none reverse none",
            },
            background: "rgba(255, 255, 255, 0.95)",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.05)",
            duration: 0.3
        });
    }

    // Hero Section Parallax Storytelling
    if (document.body.classList.contains('home-page')) {
        const isMobileScreen = window.matchMedia('(max-width: 900px)').matches;
        const revealGroups = [
            { trigger: '.bento-wrapper', targets: '.bento-wrapper .bento-header, .bento-wrapper .service-card', y: isMobileScreen ? 16 : 48, stagger: 0.12 },
            { trigger: '.timeline-header', targets: '.timeline-header', y: isMobileScreen ? 14 : 42, stagger: 0 },
            { trigger: '.sticky-wrapper', targets: '.sticky-wrapper .sticky-component, .sticky-wrapper .sticky-big-image, .sticky-wrapper .sticky-text, .sticky-wrapper .sticky-small-image, .sticky-wrapper .sticky-medium-image', y: isMobileScreen ? 18 : 54, stagger: 0.1 },
            { trigger: '.products-wrapper', targets: '.products-wrapper .products-header, .products-wrapper .w-dyn-item, .trusted-brands-wrapper .brand-card', y: isMobileScreen ? 14 : 42, stagger: 0.08 }
        ];

        revealGroups.forEach(({ trigger, targets, y, stagger }) => {
            const triggerEl = document.querySelector(trigger);
            const targetEls = document.querySelectorAll(targets);
            if (!triggerEl || !targetEls.length) return;

            gsap.from(targetEls, {
                scrollTrigger: {
                    trigger: triggerEl,
                    start: "top 82%",
                    once: true
                },
                y,
                opacity: 0,
                duration: 0.85,
                stagger,
                ease: "power3.out"
            });
        });

        if (window.matchMedia('(min-width: 901px)').matches) {
            gsap.utils.toArray('.sticky-wrapper .image-parallax').forEach((image) => {
                gsap.to(image, {
                    yPercent: 10,
                    ease: "none",
                    scrollTrigger: {
                        trigger: image.closest('.sticky-wrapper'),
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                });
            });

            const stickyHeroImage = document.querySelector('.sticky-component img');
            if (stickyHeroImage) {
                gsap.to(stickyHeroImage, {
                    yPercent: 8,
                    scale: 1.06,
                    ease: "none",
                    scrollTrigger: {
                        trigger: '.sticky-wrapper',
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                });
            }

            gsap.utils.toArray('.sticky-wrapper .sticky-text').forEach((card, index) => {
                gsap.fromTo(card,
                    { y: 36, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: card,
                            start: `top ${82 - index * 4}%`,
                            once: true
                        }
                    }
                );
            });
        }
    }

    // Product Cards Reveal
    const productCards = document.querySelectorAll('.product-card');
    if (productCards.length > 0) {
        gsap.from(productCards, {
            scrollTrigger: {
                trigger: '.shop-grid',
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power3.out"
        });
    }

    // Mobile products show more toggle
    const productsGrid = document.querySelector('.home-page .products-cards');
    const productsShowMoreBtn = document.getElementById('productsShowMoreBtn');
    if (productsGrid && productsShowMoreBtn) {
        productsShowMoreBtn.addEventListener('click', () => {
            const isExpanded = productsGrid.classList.toggle('is-expanded');
            productsShowMoreBtn.textContent = isExpanded ? 'Show Less' : 'Show More';
        });
    }

    // Page Transition Logic (Animate Skill + Page Links)
    const overlay = document.querySelector('.page-transition');
    document.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || !overlay) return;

            // Allow smooth scroll to anchors on the same page
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    lenis.scrollTo(target);
                }
                return;
            }

            // Exclude external links or target=_blank
            if (href.startsWith('http') || this.getAttribute('target') === '_blank' || href.startsWith('mailto:')) return;

            e.preventDefault();

            // Trigger transition out
            gsap.to(overlay, {
                y: "0%",
                duration: 0.5,
                ease: "power4.inOut",
                onComplete: () => {
                    window.location.href = href;
                }
            });
        });
    });

    // Animate page in
    gsap.fromTo(overlay,
        { y: "0%" },
        { y: "-100%", duration: 0.6, delay: 0.1, ease: "power4.inOut" }
    );

    // Desktop Split Banner Slider Logic
    const desktopSliderTrack = document.getElementById('desktopSliderTrack');
    const desktopSliderDotsContainer = document.getElementById('desktopSliderDots');
    if (desktopSliderTrack && desktopSliderDotsContainer) {
        let desktopCurrentSlide = 0;
        const dSlides = desktopSliderTrack.querySelectorAll('.slide');
        const dDots = desktopSliderDotsContainer.querySelectorAll('.dot');
        
        function advanceDesktopSlide(index) {
            dSlides[desktopCurrentSlide].classList.remove('active');
            dDots[desktopCurrentSlide].classList.remove('active');
            desktopCurrentSlide = (index + dSlides.length) % dSlides.length;
            dSlides[desktopCurrentSlide].classList.add('active');
            dDots[desktopCurrentSlide].classList.add('active');
        }

        dDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                advanceDesktopSlide(index);
            });
        });

        // Autoplay
        setInterval(() => {
            advanceDesktopSlide(desktopCurrentSlide + 1);
        }, 4000);
    }
});
