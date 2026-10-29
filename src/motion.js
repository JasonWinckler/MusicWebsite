// Progressive motion: content is always visible in HTML/CSS, even without JS.
// Animate an element only when it first enters view; never hold it hidden.
const preference = matchMedia('(prefers-reduced-motion: reduce)');
const completed = new WeakSet();
const active = new Map();
let observer;

function cancelMotion() {
  observer?.disconnect();
  for (const animation of active.values()) animation.cancel();
  active.clear();
}

function reveal(element) {
  observer?.unobserve(element);
  completed.add(element);
  if (preference.matches || element.contains(document.activeElement)) return;
  const animation = element.animate([
    { opacity: 0.2, transform: 'translate3d(0, 20px, 0)' },
    { opacity: 1, transform: 'translate3d(0, 0, 0)' },
  ], { duration: 650, easing: 'cubic-bezier(.2,.7,.2,1)' });
  active.set(element, animation);
  animation.finished.then(() => active.delete(element), () => active.delete(element));
}

function initialise() {
  cancelMotion();
  if (preference.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target); });
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(element => {
    if (!completed.has(element)) observer.observe(element);
  });
}

// Keep focused controls still and fully visible for keyboard users.
document.addEventListener('focusin', event => {
  for (const [element, animation] of active) {
    if (element.contains(event.target)) { animation.cancel(); active.delete(element); }
  }
});
preference.addEventListener('change', initialise);
initialise();
