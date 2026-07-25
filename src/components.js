import { navigation } from './data.js';

export function header(home = true) {
  const links = home ? navigation.map(([id, label]) => `<a href="#${id}">${label}</a>`).join('') : '<a href="/">Home</a><a href="/affiliates/">Affiliates</a><a href="/impressum/">Impressum</a>';
  return `<header class="site-header"><a class="brand" href="/" aria-label="Jason Shadow homepage">Jason Shadow</a><nav class="main-nav desktop-nav" aria-label="Main navigation">${links}</nav>${home ? `<div class="language-switcher desktop-language" aria-label="Language selection"><button class="language-button is-active" data-lang="en" aria-pressed="true">EN</button><button class="language-button" data-lang="de" aria-pressed="false">DE</button></div><button class="menu-toggle" type="button" aria-controls="mobile-site-menu" aria-expanded="false" aria-label="Open menu"><span></span><span></span><span></span></button><div class="menu-backdrop" data-menu-backdrop hidden></div><aside id="mobile-site-menu" class="mobile-menu-panel"><nav class="main-nav mobile-nav" aria-label="Mobile navigation">${links}</nav><div class="language-switcher mobile-language" aria-label="Language selection"><button class="language-button is-active" data-lang="en" aria-pressed="true">EN</button><button class="language-button" data-lang="de" aria-pressed="false">DE</button></div></aside>` : ''}</header>`;
}

export function footer() {
  return `<footer class="site-footer"><p>© 2026 Jason Shadow · The Healing Shadow · Baritone Singer &amp; Speaker</p><a href="/affiliates/">Affiliate Links</a><a href="/impressum/">Impressum</a><a href="/datenschutz/">Datenschutzerklärung</a></footer>`;
}

export function initMenu() {
  const head = document.querySelector('.site-header'); const toggle = document.querySelector('.menu-toggle'); const backdrop = document.querySelector('[data-menu-backdrop]');
  const set = (open) => { head?.classList.toggle('is-menu-open', open); document.body.classList.toggle('menu-open', open); toggle?.setAttribute('aria-expanded', String(open)); toggle?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); if (backdrop) backdrop.hidden = !open; };
  toggle?.addEventListener('click', () => set(toggle.getAttribute('aria-expanded') !== 'true')); backdrop?.addEventListener('click', () => set(false));
  document.querySelectorAll('.mobile-nav a').forEach(a => a.addEventListener('click', () => set(false))); document.addEventListener('keydown', e => e.key === 'Escape' && set(false));
}

export function reveal() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { document.querySelectorAll('[data-animate]').forEach(e => e.classList.add('is-visible')); return; }
  const observer = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('is-visible')), { threshold: .12 });
  document.querySelectorAll('[data-animate]').forEach(e => observer.observe(e));
}
