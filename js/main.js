document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const reveals = document.querySelectorAll('.reveal');
    const statNumbers = document.querySelectorAll('.stat-number');
    const feedbackForm = document.getElementById('feedback-form');

    // Sticky Header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Animate hamburger to X (optional, simply toggle class for now)
            menuToggle.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.innerHTML = '☰';
        });
    });

    // Scroll Reveal Animation
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load

    // Number Counter Animation
    let counted = false;
    const statsSection = document.querySelector('.stats');

    if (statsSection && statNumbers.length > 0) {
        const startCounting = () => {
            statNumbers.forEach(num => {
                const target = +num.getAttribute('data-target');
                const count = +num.innerText;
                const increment = target / 100; // Speed of counter

                if (count < target) {
                    num.innerText = Math.ceil(count + increment);
                    setTimeout(startCounting, 20); // Recursion for smooth animation
                } else {
                    num.innerText = target + (num.getAttribute('data-suffix') || '');
                }
            });
        };

        const observer = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting && !counted) {
                startCounting();
                counted = true;
            }
        });

        observer.observe(statsSection);
    }

    // Form Submission (Google Forms)
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            const btn = feedbackForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.disabled = true;
        
            const name = encodeURIComponent(document.getElementById('name').value);
            const contact = encodeURIComponent(document.getElementById('contact').value);
            const email = encodeURIComponent(document.getElementById('email').value);
            const details = encodeURIComponent(document.getElementById('details').value);
        
            // Google Forms Endpoint
            const formURL = `https://docs.google.com/forms/d/e/1FAIpQLSeBJwzbNJFJ3FoampKT3ulglyNU0fKrGSHKbvJqEoZLZzXAvQ/formResponse?entry.1134360881=${name}&entry.1808078490=${contact}&entry.2020861878=${email}&entry.334732365=${details}`;
        
            fetch(formURL, {
                method: "GET",
                mode: "no-cors"
            })
            .then(() => {
                alert("✅ Feedback submitted successfully!");
                feedbackForm.reset();
                btn.innerText = originalText;
                btn.disabled = false;
            })
            .catch((err) => {
                console.error("Submission error:", err);
                alert("❌ Submission failed. Please try again.");
                btn.innerText = originalText;
                btn.disabled = false;
            });
        });
    }
});
