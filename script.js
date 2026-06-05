document.addEventListener('DOMContentLoaded', () => {
	// Mobile nav toggle
	const navToggle = document.querySelector('.nav-toggle');
	const nav = document.querySelector('.nav');
	if (navToggle && nav) {
		navToggle.addEventListener('click', () => {
			const expanded = navToggle.getAttribute('aria-expanded') === 'true';
			navToggle.setAttribute('aria-expanded', String(!expanded));
			nav.classList.toggle('open');
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

	// Contact form removed — no client-side handling required
});
