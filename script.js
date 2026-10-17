
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
