
    if ('scrollRestoration' in history) {
        history.scrollRestoration = "auto";
    }
    window.addEventListener('beforeunload', function() {
        sessionStorage.setItem('scrollY', window.scrollY);
    });
    window.addEventListener('DOMContentLoaded', function() {
        const y = sessionStorage.getItem('scrollY');
        if (y !== null) {
        window.scrollTo(0, parseInt(y, 10));
        sessionStorage.removeItem('scrollY');
        }
    });


    // Mobile menu functionality

    document.addEventListener('DOMContentLoaded', function() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileClose = document.querySelector('.mobile-close');
        const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
        const body = document.body;
        if (mobileMenuBtn && mobileMenu && mobileClose) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.add('active');
                body.classList.add('menu-open');
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
            });
            mobileClose.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                body.classList.remove('menu-open');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
            mobileMenuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                    body.classList.remove('menu-open');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                });
            });
        }
    });