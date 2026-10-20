
/* =========================================
   1. DISPLAY THE CURRENT YEAR
   ========================================= */

const yearElement = document.getElementById("current-year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* =========================================
   2. HIGHLIGHT THE CURRENT SECTION
   ========================================= */

const sections = document.querySelectorAll(
    "main section[id]"
);

const navigationLinks = document.querySelectorAll(
    ".nav-links a"
);

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            navigationLinks.forEach((link) => {
                const isActive =
                    link.getAttribute("href") ===
                    `#${entry.target.id}`;

                link.classList.toggle("active", isActive);

                if (isActive) {
                    link.setAttribute("aria-current", "location");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        });
    },
    {
        rootMargin: "-20% 0px -60% 0px"
    }
);

sections.forEach((section) => {
    sectionObserver.observe(section);
});



/* =========================================
   EDUCATION MODULE CAROUSEL
   Images: 2 seconds
   Videos: play until finished
   ========================================= */

const moduleCarousel = document.getElementById("module-carousel");

if (moduleCarousel) {

    const moduleSlides = Array.from(
        moduleCarousel.querySelectorAll(".module-slide")
    );

    const previousButton = document.getElementById(
        "module-previous"
    );

    const nextButton = document.getElementById(
        "module-next"
    );

    const counter = document.getElementById(
        "module-counter"
    );

    const totalModules = moduleSlides.length;
    const imageDelay = 2000;

    let currentModule = 0;
    let autoplayTimer = null;

    let touchStartX = 0;
    let touchStartY = 0;


    /* Clear any pending automatic transition */

    function clearAutoplayTimer() {
        clearTimeout(autoplayTimer);
        autoplayTimer = null;
    }


    /* Show the next or previous slide */

    function showModule(index) {

        clearAutoplayTimer();

        currentModule =
            (index + totalModules) % totalModules;

        moduleSlides.forEach((slide, i) => {

            const isActive = i === currentModule;

            slide.classList.toggle("active", isActive);

            slide.setAttribute(
                "aria-hidden",
                String(!isActive)
            );

            const video = slide.querySelector("video");

            if (video && !isActive) {
                video.pause();

                /* Restart the video if it is shown again */
                try {
                    video.currentTime = 0;
                } catch (error) {
                    // The video may not have loaded yet.
                }
            }
        });

        counter.textContent =
            `${String(currentModule + 1).padStart(2, "0")} / ` +
            `${String(totalModules).padStart(2, "0")}`;

        const activeSlide = moduleSlides[currentModule];
        const activeVideo = activeSlide.querySelector("video");


        /* VIDEO: wait until playback finishes */

        if (activeVideo) {

            activeVideo.muted = true;
            activeVideo.playsInline = true;

            const playPromise = activeVideo.play();

            if (playPromise !== undefined) {

                playPromise.catch(() => {

                    /*
                     * If autoplay is blocked, give the visitor
                     * two seconds before moving on. If they
                     * start the video, the timer is cancelled.
                     */

                    if (
                        moduleSlides[currentModule] === activeSlide &&
                        activeVideo.paused
                    ) {
                        autoplayTimer = setTimeout(() => {
                            showModule(currentModule + 1);
                        }, imageDelay);
                    }

                });
            }

        } else {

            /* IMAGE: show it for two seconds */

            autoplayTimer = setTimeout(() => {
                showModule(currentModule + 1);
            }, imageDelay);

        }
    }


    /* Manual navigation */

    function moveModule(direction) {
        showModule(currentModule + direction);
    }

    previousButton.addEventListener("click", () => {
        moveModule(-1);
    });

    nextButton.addEventListener("click", () => {
        moveModule(1);
    });


    /* When a video finishes, move to the next slide */

    moduleSlides.forEach((slide) => {

        const video = slide.querySelector("video");

        if (!video) {
            return;
        }

        video.addEventListener("ended", () => {

            if (moduleSlides[currentModule] === slide) {
                showModule(currentModule + 1);
            }

        });

        /*
         * If autoplay was blocked but the visitor starts
         * the video manually, cancel the fallback timer.
         */

        video.addEventListener("play", () => {

            if (moduleSlides[currentModule] === slide) {
                clearAutoplayTimer();
            }

        });

        /* If playback fails, don't leave the carousel stuck */

        video.addEventListener("error", () => {

            if (moduleSlides[currentModule] === slide) {
                clearAutoplayTimer();

                autoplayTimer = setTimeout(() => {
                    showModule(currentModule + 1);
                }, imageDelay);
            }

        });
    });


    /* Swipe navigation for phones */

    moduleCarousel.addEventListener("touchstart", (event) => {

        if (event.touches.length !== 1) {
            return;
        }

        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;

    }, { passive: true });


    moduleCarousel.addEventListener("touchend", (event) => {

        if (event.changedTouches.length !== 1) {
            return;
        }

        const endX = event.changedTouches[0].clientX;
        const endY = event.changedTouches[0].clientY;

        const differenceX = endX - touchStartX;
        const differenceY = endY - touchStartY;

        if (
            Math.abs(differenceX) > 45 &&
            Math.abs(differenceX) > Math.abs(differenceY)
        ) {
            moveModule(differenceX < 0 ? 1 : -1);
        }

    }, { passive: true });


    /* Start with Module 1 */

    showModule(0);

}







/* =========================================
   WORK EXPERIENCE CAROUSEL
   ========================================= */

const workViewport = document.getElementById("work-carousel-viewport");

if (workViewport) {
    const workTrack = document.getElementById("work-carousel-track");
    const workCards = Array.from(
        workTrack.querySelectorAll(".work-carousel-card")
    );
    const workPrevious = document.getElementById("work-previous");
    const workNext = document.getElementById("work-next");
    const workCounter = document.getElementById("work-counter");

    let workIndex = 1;
    let startX = 0;
    let startY = 0;

    function showWorkCard(index) {
        workIndex = (index + workCards.length) % workCards.length;

        workCards.forEach((card, i) => {
            card.classList.toggle("active", i === workIndex);
        });

        const card = workCards[workIndex];
        const offset =
            workViewport.clientWidth / 2 -
            card.offsetLeft -
            card.offsetWidth / 2;

        workTrack.style.transform = `translateX(${offset}px)`;

        workCounter.textContent =
            `${String(workIndex + 1).padStart(2, "0")} / ` +
            `${String(workCards.length).padStart(2, "0")}`;


    }

    workPrevious.addEventListener("click", () => {
        showWorkCard(workIndex - 1);
    });

    workNext.addEventListener("click", () => {
        showWorkCard(workIndex + 1);
    });

    workViewport.addEventListener("touchstart", (event) => {
        if (event.touches.length !== 1) return;

        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
    }, { passive: true });

    workViewport.addEventListener("touchend", (event) => {
        if (event.changedTouches.length !== 1) return;

        const differenceX = event.changedTouches[0].clientX - startX;
        const differenceY = event.changedTouches[0].clientY - startY;

        if (
            Math.abs(differenceX) > 45 &&
            Math.abs(differenceX) > Math.abs(differenceY)
        ) {
            showWorkCard(workIndex + (differenceX < 0 ? 1 : -1));
        }
    }, { passive: true });

    window.addEventListener("resize", () => {
        showWorkCard(workIndex);
    });

    showWorkCard(1);
}


/* =========================================
   PROJECT SKILLS CAROUSELS
   Images autoplay every 2s.
   Videos autoplay and advance when ended.
   ========================================= */

document.querySelectorAll(".project-carousel").forEach((carousel) => {
    const track = carousel.querySelector(".project-carousel-track");
    const cards = Array.from(
        track.querySelectorAll(".project-skill-card")
    );

    const carouselId = carousel.id;
    const counter = document.getElementById(
        carouselId === "year3-carousel"
            ? "year3-counter"
            : "year4-counter"
    );

    const buttons = document.querySelectorAll(
        `[data-project-carousel="${carouselId}"]`
    );

    const imageDelay = 2000;

    let currentIndex = 1;
    let startX = 0;
    let startY = 0;
    let autoplayTimer = null;

    function clearAutoplayTimer() {
        clearTimeout(autoplayTimer);
        autoplayTimer = null;
    }

    /* Images advance on a 2s timer; videos advance on "ended". */
    function scheduleAutoplay() {
        clearAutoplayTimer();

        const activeCard = cards[currentIndex];
        const activeVideo = activeCard.querySelector("video");

        if (activeVideo) {
            return;
        }

        autoplayTimer = setTimeout(() => {
            showCard(currentIndex + 1);
        }, imageDelay);
    }

    function showCard(index) {
        clearAutoplayTimer();

        currentIndex = (index + cards.length) % cards.length;

        cards.forEach((card, i) => {
            const isActive = i === currentIndex;
            card.classList.toggle("active", isActive);

            const video = card.querySelector("video");
            if (!video) return;

            if (!isActive) {
                video.pause();
                try {
                    video.currentTime = 0;
                } catch (error) {
                    /* The video may not have loaded yet. */
                }
                return;
            }

            video.muted = true;
            video.playsInline = true;

            const playPromise = video.play();

            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    /* Autoplay blocked — fall back to the 2s timer. */
                    if (cards[currentIndex] === card) {
                        autoplayTimer = setTimeout(() => {
                            showCard(currentIndex + 1);
                        }, imageDelay);
                    }
                });
            }
        });

        const activeCard = cards[currentIndex];
        const offset =
            carousel.clientWidth / 2 -
            activeCard.offsetLeft -
            activeCard.offsetWidth / 2;

        track.style.transform = `translateX(${offset}px)`;

        counter.textContent =
            `${String(currentIndex + 1).padStart(2, "0")} / ` +
            `${String(cards.length).padStart(2, "0")}`;

        scheduleAutoplay();
    }

    /* Per-card video listeners */
    cards.forEach((card) => {
        const video = card.querySelector("video");
        if (!video) return;

        video.addEventListener("ended", () => {
            if (cards[currentIndex] === card) {
                showCard(currentIndex + 1);
            }
        });

        video.addEventListener("play", () => {
            if (cards[currentIndex] === card) {
                clearAutoplayTimer();
            }
        });

        video.addEventListener("error", () => {
            if (cards[currentIndex] === card) {
                clearAutoplayTimer();
                autoplayTimer = setTimeout(() => {
                    showCard(currentIndex + 1);
                }, imageDelay);
            }
        });
    });

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            showCard(
                currentIndex + Number(button.dataset.direction)
            );
        });
    });

    carousel.addEventListener("touchstart", (event) => {
        if (event.touches.length !== 1) return;
        clearAutoplayTimer();
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
    }, { passive: true });

    carousel.addEventListener("touchend", (event) => {
        if (event.changedTouches.length !== 1) return;

        const dx = event.changedTouches[0].clientX - startX;
        const dy = event.changedTouches[0].clientY - startY;

        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
            showCard(currentIndex + (dx < 0 ? 1 : -1));
        } else {
            scheduleAutoplay();
        }
    }, { passive: true });

    window.addEventListener("resize", () => {
        showCard(currentIndex);
    });

    showCard(currentIndex);
});
