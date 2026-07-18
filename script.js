document.addEventListener('DOMContentLoaded', () => {
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Enables reveal-on-scroll styles only when JS runs, so content
	// is never hidden for users without JS.
	document.body.classList.add('js-anim');

	// ── Theme toggle ──
	const themeToggle = document.getElementById('themeToggle');
	if (themeToggle) {
		themeToggle.addEventListener('click', () => {
			const root = document.documentElement;
			const isDark = root.getAttribute('data-theme') === 'dark';
			if (isDark) {
				root.removeAttribute('data-theme');
			} else {
				root.setAttribute('data-theme', 'dark');
			}
			try { localStorage.setItem('idlt-theme', isDark ? 'light' : 'dark'); } catch (e) {}
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
				if (target) target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
			}
		});
	});

	// ── Reveal-on-scroll ──
	const revealEls = document.querySelectorAll('[data-reveal]');
	if (revealEls.length) {
		const revealObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				// Reveal when entering the viewport, or if the element was
				// jumped past entirely (e.g. anchor links) and sits above it.
				if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
					entry.target.classList.add('revealed');
					revealObserver.unobserve(entry.target);
				}
			});
		}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
		revealEls.forEach(el => revealObserver.observe(el));

		// Safety net: anything still hidden but inside/above the viewport on
		// scroll end gets revealed (covers instant jumps IO can miss).
		let revealCheckTimer = null;
		window.addEventListener('scroll', () => {
			clearTimeout(revealCheckTimer);
			revealCheckTimer = setTimeout(() => {
				document.querySelectorAll('[data-reveal]:not(.revealed)').forEach(el => {
					if (el.getBoundingClientRect().top < window.innerHeight - 40) {
						el.classList.add('revealed');
					}
				});
			}, 120);
		}, { passive: true });
	}

	// ── Hero strikethrough ──
	const strikeWord = document.getElementById('strikeWord');
	if (strikeWord) {
		setTimeout(() => strikeWord.classList.add('struck'), 900);
	}

	// ── Ticker: duplicate the group so the loop is seamless ──
	const ticker = document.getElementById('ticker');
	if (ticker) {
		const group = ticker.querySelector('.ticker-group');
		if (group) {
			const clone = group.cloneNode(true);
			clone.setAttribute('aria-hidden', 'true');
			ticker.appendChild(clone);
		}
	}

	// ── Scroll progress + header hide/show + back-to-top ──
	const progressBar = document.getElementById('scrollProgress');
	const header = document.getElementById('siteHeader') || document.querySelector('.site-header');
	const backToTop = document.getElementById('backToTop');
	let lastY = window.scrollY;
	let scrollTicking = false;

	function onScroll() {
		const y = window.scrollY;
		const max = document.documentElement.scrollHeight - window.innerHeight;

		if (progressBar) {
			progressBar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
		}

		if (header) {
			const goingDown = y > lastY;
			const pastHeader = y > 220;
			const mobileNavOpen = mobileNav && mobileNav.classList.contains('open');
			header.classList.toggle('header-hidden', goingDown && pastHeader && !mobileNavOpen);
		}

		if (backToTop) {
			backToTop.classList.toggle('visible', y > 600);
		}

		lastY = y;
		scrollTicking = false;
	}

	window.addEventListener('scroll', () => {
		if (!scrollTicking) {
			scrollTicking = true;
			requestAnimationFrame(onScroll);
		}
	}, { passive: true });
	onScroll();

	if (backToTop) {
		backToTop.addEventListener('click', () => {
			window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
		});
	}

	// ── Dislike counter ──
	const dislikeBtn = document.getElementById('dislikeBtn');
	const dislikeCount = document.getElementById('dislikeCount');
	const dislikeMsg = document.getElementById('dislikeMsg');

	if (dislikeBtn && dislikeCount) {
		let count = 0;
		try { count = parseInt(localStorage.getItem('idlt-dislikes'), 10) || 0; } catch (e) {}
		dislikeCount.textContent = String(count);

		const milestones = {
			1:   'Noted.',
			5:   'Okay, we heard you the first time.',
			10:  'We get it.',
			25:  'Impressive commitment to the bit.',
			50:  'You really don’t like this.',
			100: 'Achievement unlocked: professional hater.',
			250: 'At this point it’s a hobby.',
			500: 'Please. Go outside.'
		};

		let msgTimer = null;

		dislikeBtn.addEventListener('click', (e) => {
			count += 1;
			try { localStorage.setItem('idlt-dislikes', String(count)); } catch (err) {}
			dislikeCount.textContent = String(count);

			// Springy pop on the number (Motion if loaded, CSS-free fallback otherwise)
			if (window.__motion && !prefersReducedMotion) {
				window.__motion.animate(dislikeCount,
					{ scale: [1.45, 1] },
					{ type: 'spring', stiffness: 500, damping: 14 });
			}

			// Floating "-1" particle from the click point
			if (!prefersReducedMotion) {
				const p = document.createElement('span');
				p.className = 'dislike-particle';
				p.textContent = '−1';
				p.style.left = e.clientX + 'px';
				p.style.top = e.clientY + 'px';
				p.style.setProperty('--px', (Math.random() * 60 - 30) + 'px');
				p.style.setProperty('--pr', (Math.random() * 40 - 20) + 'deg');
				document.body.appendChild(p);
				setTimeout(() => p.remove(), 950);
			}

			if (dislikeMsg && milestones[count]) {
				dislikeMsg.textContent = milestones[count];
				dislikeMsg.classList.add('show');
				clearTimeout(msgTimer);
				msgTimer = setTimeout(() => dislikeMsg.classList.remove('show'), 3200);
			}
		});
	}

	// ── FAQ accordion (used on /faq/) ──
	document.querySelectorAll('.faq-question').forEach(btn => {
		btn.addEventListener('click', function () {
			const item = this.closest('.faq-item');
			const isOpen = item.classList.contains('open');
			document.querySelectorAll('.faq-item').forEach(el => {
				el.classList.remove('open');
				const q = el.querySelector('.faq-question');
				if (q) q.setAttribute('aria-expanded', 'false');
			});
			if (!isOpen) {
				item.classList.add('open');
				this.setAttribute('aria-expanded', 'true');
			}
		});
	});

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
					if (item.background) wrapper.style.background = item.background;
					if (item.textColor) wrapper.style.color = item.textColor;
					let contentParent = wrapper;
					if (item.url) {
						const a = document.createElement('a');
						a.className = 'banner-link';
						a.href = item.url;
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
						for (let i = 0; i < 4; i += 1) {
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
				const updateBannerHeight = () => {
					const h = bannerRoot ? bannerRoot.offsetHeight : 0;
					document.documentElement.style.setProperty('--banner-h', h + 'px');
				};
				updateBannerHeight();
				window.addEventListener('resize', updateBannerHeight);
			})
			.catch(() => { /* fail silently */ });
	})();

	// ── Motion (Framer Motion's vanilla library) — progressive enhancement ──
	// Loaded from CDN; everything above works without it. When available it
	// adds spring physics to hover states and the dislike counter.
	if (!prefersReducedMotion) {
		import('https://cdn.jsdelivr.net/npm/motion@11.13.5/+esm')
			.then((motion) => {
				window.__motion = motion;

				// Springy hover on cards and the about badge
				document.querySelectorAll('.card').forEach(card => {
					card.addEventListener('pointerenter', () => {
						motion.animate(card, { y: [-2, 0] }, { type: 'spring', stiffness: 400, damping: 18 });
					});
				});

				// Gentle spring entrance for the hero kicker pill
				const kicker = document.querySelector('.hero-kicker');
				if (kicker) {
					motion.animate(kicker, { rotate: [-4, 0] }, { type: 'spring', stiffness: 200, damping: 10, delay: 0.3 });
				}
			})
			.catch(() => { /* no CDN, no springs — site still works */ });
	}
});
