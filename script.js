document.addEventListener('DOMContentLoaded', () => {
	// ── Announcement Bar close ──
	const closeBtn = document.getElementById('closeAnnouncement');
	const bar = document.getElementById('announcementBar');
	if (closeBtn && bar) {
		closeBtn.addEventListener('click', () => {
			bar.style.display = 'none';
		});
	}

	// ── Mobile nav toggle ──
	const navToggle = document.getElementById('navToggle');
	const mobileNav = document.getElementById('mobileNav');
	const overlay   = document.getElementById('mobileNavOverlay');

	function closeMobileNav() {
		if (!mobileNav) return;
		mobileNav.classList.remove('open');
		if (overlay) overlay.classList.remove('active');
		if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
	}

	if (navToggle && mobileNav) {
		navToggle.addEventListener('click', () => {
			const isOpen = mobileNav.classList.toggle('open');
			navToggle.setAttribute('aria-expanded', String(isOpen));
			if (overlay) overlay.classList.toggle('active', isOpen);
		});
	}

	if (overlay) {
		overlay.addEventListener('click', closeMobileNav);
	}

	// Close mobile nav when a link is clicked
	if (mobileNav) {
		mobileNav.querySelectorAll('a').forEach(a => {
			a.addEventListener('click', closeMobileNav);
		});
	}

	// ── Smooth scroll for in-page hash links ──
	document.querySelectorAll('a[href^="#"]').forEach(a => {
		a.addEventListener('click', (e) => {
			const href = a.getAttribute('href');
			if (href && href.length > 1) {
				e.preventDefault();
				const target = document.querySelector(href);
				if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		});
	});

	// ── Active nav link highlight on scroll ──
	const sections = document.querySelectorAll('section[id]');
	const navLinks = document.querySelectorAll('.nav a[href^="#"]');

	if (sections.length && navLinks.length) {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					navLinks.forEach(link => {
						link.classList.toggle(
							'active',
							link.getAttribute('href') === '#' + entry.target.id
						);
					});
				}
			});
		}, { rootMargin: '-40% 0px -55% 0px' });

		sections.forEach(s => observer.observe(s));
	}

	// ── Load dynamic banner from /banner.json ──
	(function loadBanner(){
		const bannerRoot = document.getElementById('siteBanner');
		if (!bannerRoot) return;
		fetch('/banner.json', { cache: 'no-store' })
			.then(res => res.json())
			.then(data => {
				const items = Array.isArray(data) ? data : [data];
				if (!items.length) return;
				items.forEach(item => {
					const name = item.name ? item.name.trim() : '';
					const text = item.text ? item.text.trim() : '';
					const anim = (item.animation || 'rolling').toLowerCase();
					const allowed = ['rolling','flashing','vibrating'];
					const mode = allowed.includes(anim) ? anim : 'rolling';
					const wrapper = document.createElement('div');
					wrapper.className = 'banner-item banner--' + mode;
					// Apply optional background and text color (accept any CSS color string, e.g., "rgb(255,0,0)")
					if (item.background) wrapper.style.background = item.background;
					if (item.textColor) wrapper.style.color = item.textColor;
				let contentParent = wrapper;
				if (item.url) {
					const a = document.createElement('a');
					a.className = 'banner-link';
					a.href = item.url;
					// optional target handling
					if (item.target && item.target === '_blank') {
						a.target = '_blank';
						a.rel = 'noopener noreferrer';
					}
					wrapper.appendChild(a);
					contentParent = a;
				}
				if (mode === 'rolling') {
					const track = document.createElement('div');
					track.className = 'banner-track';
					for (let i = 0; i < 2; i += 1) {
						const span = document.createElement('span');
						span.className = 'banner-text';
						span.textContent = (name ? name + ' — ' : '') + text;
						track.appendChild(span);
					}
					contentParent.appendChild(track);
				} else {
					const span = document.createElement('span');
					span.className = 'banner-text';
					span.textContent = (name ? name + ' — ' : '') + text;
					contentParent.appendChild(span);
				}
					bannerRoot.appendChild(wrapper);
				});
					// update CSS variable for banner height so scroll offsets work correctly
					const updateBannerHeight = () => {
						const h = bannerRoot ? bannerRoot.offsetHeight : 0;
						document.documentElement.style.setProperty('--banner-h', h + 'px');
					};
					updateBannerHeight();
					// update on window resize in case banners wrap/change height
					window.addEventListener('resize', updateBannerHeight);
				})
			.catch(() => { /* fail silently */ });
	})();
});
