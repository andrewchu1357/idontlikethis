document.addEventListener('DOMContentLoaded', () => {
	// Mobile nav toggle
	const navToggle = document.querySelector('.nav-toggle');
	const nav = document.querySelector('.nav');
	if (navToggle && nav) {
		navToggle.addEventListener('click', () => {
			const expanded = navToggle.getAttribute('aria-expanded') === 'true';
			navToggle.setAttribute('aria-expanded', String(!expanded));
			nav.style.display = expanded ? 'none' : 'block';
		});
	}

	// Smooth scroll for internal links
	document.querySelectorAll('a[href^="#"]').forEach(a => {
		a.addEventListener('click', (e) => {
			const href = a.getAttribute('href');
			if (href.length > 1) {
				e.preventDefault();
				const target = document.querySelector(href);
				if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		});
	});

	// Theme toggle (light/dark)
	const themeToggle = document.getElementById('themeToggle');
	if (themeToggle) {
		themeToggle.addEventListener('click', () => {
			document.body.classList.toggle('dark');
		});
	}

	// Simple contact form handling (client-side only)
	const contactForm = document.getElementById('contactForm');
	if (contactForm) {
		contactForm.addEventListener('submit', (e) => {
			e.preventDefault();
			const status = contactForm.querySelector('.form-status');
			status.textContent = 'Sending message...';
			// Simulate async send
			setTimeout(() => {
				status.textContent = 'Thanks — message received (demo only).';
				contactForm.reset();
			}, 800);
		});
	}
});
