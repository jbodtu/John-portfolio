
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
