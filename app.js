/**
 * app.js — Adrian Ackerman Portfolio
 *
 * What lives here (in order):
 *
 *  [1] REDUCED MOTION — read once, used everywhere
 *  [2] TYPEWRITER — hero + skills typewriters (with instant fallback)
 *  [3] EXPERIENCE ACCORDION — bullet stagger + View Transitions
 *  [4] YOUTUBE HOVER-TO-PLAY — IFrame API, injected asynchronously
 *  [5] MOBILE SIDEBAR — open/close + keyboard focus management
 *  [6] CONTACT FORM — client validation + Fetch AJAX + status states
 *  [7] CURSOR-GLOW — --mouse-x/--mouse-y driven radial gradient on cards
 *  [8] 3D TILT — perspective transform on project video boxes
 *  [9] createRevealObserver — reusable IntersectionObserver factory
 * [10] PROJECT CARD STAGGER — IntersectionObserver-triggered entrance
 * [11] HERO HEADING WORD REVEAL — split h1 into words, animate in
 */

document.addEventListener('DOMContentLoaded', () => {

  // ════════════════════════════════════════════════════════════════════════════
  // [1] REDUCED MOTION
  // Read once at startup. Every animation utility checks this flag before
  // running — users who opt out of motion see immediate/static results.
  // ════════════════════════════════════════════════════════════════════════════

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  // ════════════════════════════════════════════════════════════════════════════
  // [2] TYPEWRITER
  // ════════════════════════════════════════════════════════════════════════════

  const COPY = {
    title:      'Photo and Video Editor Portfolio',
    para:       'I am an experienced media professional and passionate storyteller, always on the lookout for something creative.',
    passion:    'Growing up, I watched behind-the-scenes videos of all my favorite movies. This just fueled my passion for professional storytelling. Editing isn\'t just my profession, it\'s my passion. I enjoy crafting compelling narratives. I wrote and produced several videos, photographed large events, edited podcast audio, managed social media, and wrote blog posts.',
    producer:   'I excel at crafting compelling video, photo, and audio content that have real world impact. From promotional series screened in the UK to data-driven presentations that shaped real city policy. Have a story that needs telling? Let\'s talk.',
    strategist: 'I design standout social media content and brand identities — from marketing materials to websites, I\'ve helped nonprofits, small businesses, and local governments grow their presence. Have a brand that needs a boost? Reach out.',
  };

  /**
   * Types text into a DOM element one character at a time.
   *
   * When prefers-reduced-motion is set, the full text is written
   * instantly so no one has to wait through an animation they
   * opted out of.
   *
   * @param {string}   id      - The element's id attribute
   * @param {string}   text    - Text to type out
   * @param {number}   speed   - Milliseconds between characters
   * @param {Function} [done]  - Optional callback when complete
   */
  const typeWriter = (id, text, speed, done) => {
    const el = document.getElementById(id);
    if (!el) return;

    if (prefersReducedMotion) {
      el.textContent = text;
      done?.();
      return;
    }

    let i = 0;
    el.classList.add('typing-active'); // CSS adds the blinking cursor via ::after

    const tick = () => {
      if (i < text.length) {
        el.textContent += text[i++];
        setTimeout(tick, speed);
      } else {
        el.classList.remove('typing-active');
        done?.(); // Optional chaining: safe if done is undefined
      }
    };

    tick();
  };

  // Chain hero typewriters: title → paragraph → passion card
  typeWriter('typewriter-title', COPY.title, 60, () => {
    typeWriter('typewriter-p', COPY.para, 35, () => {
      typeWriter('typewriter-passion', COPY.passion, 25);
    });
  });

  // Skills typewriters fire once when the section is 30% visible in viewport.
  // disconnect() prevents re-running every time the user scrolls back.
  const skillsSection = document.querySelector('.skills-section');
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        typeWriter('typewriter-producer', COPY.producer, 25, () => {
          typeWriter('typewriter-strategist', COPY.strategist, 25);
        });
        skillsObserver.disconnect();
      });
    }, { threshold: 0.3 });

    skillsObserver.observe(skillsSection);
  }


  // ════════════════════════════════════════════════════════════════════════════
  // [3] EXPERIENCE ACCORDION — bullet stagger + View Transitions
  //
  // Native <details>/<summary> handles the toggle without JS.
  // We intercept the click on <summary> to:
  //   a) assign staggered transition-delays to each bullet via --delay
  //   b) wrap the DOM update in document.startViewTransition() so the
  //      browser captures a before/after snapshot and crossfades them.
  //
  // Each accordion gets a unique view-transition-name so multiple cards
  // can animate simultaneously without sharing a snapshot group.
  // ════════════════════════════════════════════════════════════════════════════

  document.querySelectorAll('.job-details').forEach((details, idx) => {
    const ul    = details.querySelector('.job-bullets');
    const items = ul?.querySelectorAll('li') ?? [];

    // Assign CSS custom property to each bullet so the transition-delay staggers
    items.forEach((li, i) => {
      li.style.setProperty('--delay', `${i * 0.15}s`);
    });

    // Give each accordion a unique name for independent View Transition snapshots.
    // CSS.supports check: graceful no-op in browsers without view-transition-name.
    if (CSS.supports('view-transition-name', 'auto')) {
      details.style.viewTransitionName = `accordion-${idx}`;
    }

    details.querySelector('.job-summary')?.addEventListener('click', (e) => {
      e.preventDefault(); // We control the toggle manually

      const applyToggle = () => {
        details.open = !details.open;
        ul?.classList.toggle('is-open', details.open);
      };

      // startViewTransition wraps the DOM change in a morphing animation.
      // Falls back to a plain toggle in browsers without View Transitions.
      if (document.startViewTransition && !prefersReducedMotion) {
        document.startViewTransition(applyToggle);
      } else {
        applyToggle();
      }
    });
  });


  // ════════════════════════════════════════════════════════════════════════════
  // [4] YOUTUBE HOVER-TO-PLAY
  //
  // We inject the IFrame API script here (not in HTML) so it doesn't
  // block the initial page parse. YouTube calls onYouTubeIframeAPIReady
  // when it's ready — that function must live on window.
  // ════════════════════════════════════════════════════════════════════════════

  const ytScript = document.createElement('script');
  ytScript.src   = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(ytScript);

  window.onYouTubeIframeAPIReady = () => {
    document.querySelectorAll('.project-vidbox iframe').forEach((iframe, i) => {
      // enablejsapi=1 must be in the URL for YT.Player to control the embed
      const url = new URL(iframe.src);
      url.searchParams.set('enablejsapi', '1');
      iframe.src = url.toString();
      iframe.id  = `yt-player-${i}`;

      new YT.Player(iframe.id, {
        events: {
          onReady: ({ target }) => {
            const box = iframe.closest('.project-vidbox');
            // Attach to the box so the full hover area triggers play,
            // not just the precise edge of the iframe
            box.addEventListener('mouseenter', () => target.playVideo());
            box.addEventListener('mouseleave', () => target.pauseVideo());
          },
        },
      });
    });
  };


  // ════════════════════════════════════════════════════════════════════════════
  // [5] MOBILE SIDEBAR
  //
  // Focus is moved to the close button on open, and back to the
  // menu button on close — keeps keyboard users in the right place.
  // Escape key closes the sidebar from anywhere on the page.
  // ════════════════════════════════════════════════════════════════════════════

  const menuBtn  = document.querySelector('.menu-icon');
  const sidebar  = document.getElementById('mobile-sidebar');
  const closeBtn = sidebar?.querySelector('.close-icon');

  const openSidebar = () => {
    sidebar.classList.remove('close-sidebar');
    sidebar.classList.add('open-sidebar');
    sidebar.setAttribute('aria-hidden', 'false');
    menuBtn?.setAttribute('aria-expanded', 'true');
    closeBtn?.focus();
  };

  const closeSidebar = () => {
    sidebar.classList.remove('open-sidebar');
    sidebar.classList.add('close-sidebar');
    sidebar.setAttribute('aria-hidden', 'true');
    menuBtn?.setAttribute('aria-expanded', 'false');
    menuBtn?.focus();
  };

  menuBtn?.addEventListener('click', openSidebar);
  closeBtn?.addEventListener('click', closeSidebar);

  // Tapping a nav link in the sidebar closes it automatically
  sidebar?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeSidebar);
  });

  // Escape key closes from anywhere on the page
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar?.classList.contains('open-sidebar')) {
      closeSidebar();
    }
  });


  // ════════════════════════════════════════════════════════════════════════════
  // [6] CONTACT FORM — client-side validation + Fetch AJAX
  //
  // novalidate is set on the form so we control validation UX ourselves.
  // setLoading() disables the button and changes its label during the request.
  // showStatus() wraps the DOM update in startViewTransition for a smooth morph.
  // aria-live="polite" on .form-status means screen readers announce changes.
  // ════════════════════════════════════════════════════════════════════════════

  const form      = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const statusEl  = form?.querySelector('.form-status');

  const setLoading = (loading) => {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    const label = submitBtn.querySelector('.btn-label');
    if (label) label.textContent = loading ? 'Sending…' : 'Send Message';
  };

  const showStatus = (message, type) => {
    if (!statusEl) return;

    const update = () => {
      statusEl.textContent = message;
      statusEl.className   = `form-status ${type}`;
    };

    // View Transition: crossfades the status text when it changes
    if (document.startViewTransition && !prefersReducedMotion) {
      document.startViewTransition(update);
    } else {
      update();
    }
  };

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = form.querySelector('#contact-name').value.trim();
    const email   = form.querySelector('#contact-email').value.trim();
    const message = form.querySelector('#contact-message').value.trim();

    // Client-side validation — gives immediate feedback without a round trip
    if (!name || !email || !message) {
      showStatus('Please fill in all fields.', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(form.action, {
        method:  'POST',
        headers: { Accept: 'application/json' },
        body:    new FormData(form),
      });

      if (res.ok) {
        showStatus('Message sent! I\'ll get back to you soon. 🚀', 'success');
        form.reset();
      } else {
        // Formspree returns structured error messages in the JSON body
        const data = await res.json().catch(() => ({}));
        const msg  = data?.errors?.map((err) => err.message).join(', ')
          || 'Something went wrong. Please try again.';
        showStatus(msg, 'error');
      }
    } catch {
      // Network failure — the user is probably offline
      showStatus('Could not send — check your connection and try again.', 'error');
    } finally {
      setLoading(false);
    }
  });


  // ════════════════════════════════════════════════════════════════════════════
  // [7] CURSOR-TRACKING GLOW EFFECT
  //
  // HOW IT WORKS:
  //   On mousemove over .card or .job-card, we calculate where the cursor
  //   is as a percentage of the element's width and height, then write
  //   those values into CSS custom properties --mouse-x and --mouse-y.
  //
  //   The CSS background on these elements reads those properties and renders
  //   a radial-gradient "spotlight" that literally follows the cursor.
  //   Starting values of -200 put the gradient centre off-screen so it's
  //   invisible until the mouse enters.
  //
  //   { passive: true } tells the browser this handler won't call
  //   preventDefault() — so it can process scroll and paint without
  //   waiting for JS. Critical for 60 fps on touchscreens and trackpads.
  // ════════════════════════════════════════════════════════════════════════════

  if (!prefersReducedMotion) {
    document.querySelectorAll('.card, .job-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width)  * 100;
        const y = ((e.clientY - rect.top)  / rect.height) * 100;
        // toFixed(1): trims micro-jitter that would cause unnecessary repaints
        card.style.setProperty('--mouse-x', x.toFixed(1));
        card.style.setProperty('--mouse-y', y.toFixed(1));
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        // Return gradient centre off-screen so the glow fades away
        card.style.setProperty('--mouse-x', '-200');
        card.style.setProperty('--mouse-y', '-200');
      }, { passive: true });
    });
  }


  // ════════════════════════════════════════════════════════════════════════════
  // [8] 3D TILT ON PROJECT VIDEO BOXES
  //
  // HOW IT WORKS:
  //   We calculate the cursor's distance from the box's geometric centre,
  //   normalised to [-1, 1], then scale that to a small rotation angle.
  //
  //   perspective() in the transform gives the 3D illusion.
  //   scale3d(1.03) makes the box pop slightly out of the page.
  //
  //   will-change: transform in CSS (set on .project-vidbox) hints to the
  //   browser to promote this element to its own compositor layer, so the
  //   GPU handles the repaint rather than the CPU — critical for 60 fps.
  //
  //   On mousemove: fast linear transition so the tilt tracks the cursor.
  //   On mouseleave: spring-like easing so the card "bounces" back.
  // ════════════════════════════════════════════════════════════════════════════

  if (!prefersReducedMotion) {
    document.querySelectorAll('.project-vidbox').forEach((box) => {
      box.addEventListener('mousemove', (e) => {
        const rect = box.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;

        // Normalised offset from centre (-1 to +1), scaled to max ±6 degrees
        const rotX = ((e.clientY - cy) / (rect.height / 2)) * -6;
        const rotY = ((e.clientX - cx) / (rect.width  / 2)) *  6;

        box.style.transition = 'transform 0.06s linear';
        box.style.transform  =
          `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.03,1.03,1.03)`;
      }, { passive: true });

      box.addEventListener('mouseleave', () => {
        // Cubic bezier mimics a spring: overshoots slightly then settles
        box.style.transition = 'transform 0.45s cubic-bezier(0.23, 1, 0.32, 1)';
        box.style.transform  =
          'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
      });
    });
  }


  // ════════════════════════════════════════════════════════════════════════════
  // [9] createRevealObserver — REUSABLE INTERSECTIONOBSERVER UTILITY
  //
  // A small factory function. Call it with a list of elements and an
  // options object. It returns the observer so callers can disconnect it.
  //
  // staggerMs spaces out the class additions by index so elements in the
  // same batch appear one after another — no extra CSS needed for the stagger.
  //
  // once: true means we unobserve after the first trigger, so the observer
  // isn't processing every scroll event for already-visible elements.
  // ════════════════════════════════════════════════════════════════════════════

  /**
   * @param {Element[]} elements
   * @param {{
   *   threshold?:  number,
   *   rootMargin?: string,
   *   staggerMs?:  number,
   *   className?:  string,
   *   once?:       boolean
   * }} opts
   * @returns {IntersectionObserver}
   */
  const createRevealObserver = (elements, opts = {}) => {
    const {
      threshold  = 0.15,
      rootMargin = '0px',
      staggerMs  = 0,
      className  = 'revealed',
      once       = true,
    } = opts;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const idx   = elements.indexOf(entry.target);
        const delay = staggerMs * Math.max(idx, 0);

        setTimeout(() => {
          entry.target.classList.add(className);
          if (once) observer.unobserve(entry.target);
        }, delay);
      });
    }, { threshold, rootMargin });

    elements.forEach((el) => observer.observe(el));
    return observer;
  };


  // ════════════════════════════════════════════════════════════════════════════
  // [10] PROJECT CARD STAGGERED ENTRANCE
  //
  // Each .project-card starts with opacity: 0 and translateY(30px) in CSS.
  // The observer adds .card-visible when the card enters the viewport,
  // triggering the transition. staggerMs: 80 means cards 80ms apart.
  // ════════════════════════════════════════════════════════════════════════════

  const projectCards = [...document.querySelectorAll('.project-card')];

  if (!prefersReducedMotion && projectCards.length) {
    createRevealObserver(projectCards, {
      className:  'card-visible',
      staggerMs:  80,
      threshold:  0.1,
      rootMargin: '0px 0px -40px 0px',
    });
  } else {
    // Reduced motion: make all cards immediately visible
    projectCards.forEach((c) => c.classList.add('card-visible'));
  }


  // Hero heading is left to the existing .hero-info autoBlur scroll animation —
  // no word-by-word split applied here so it behaves exactly as the original.


  // ════════════════════════════════════════════════════════════════════════════
  // HOVER SIGN (first project card pointer hint)
  // ════════════════════════════════════════════════════════════════════════════

  const hoverSign = document.querySelector('.hover-sign');
  document.querySelectorAll('.project-vidbox video').forEach((video) => {
    video.addEventListener('mouseenter', () => {
      video.play();
      hoverSign?.classList.add('active');
    });
    video.addEventListener('mouseleave', () => {
      video.pause();
      hoverSign?.classList.remove('active');
    });
  });

});
