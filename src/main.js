// HTML delivers all content. JavaScript enhances navigation, media and enquiries.
document.documentElement.classList.add('js');
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#mobile-menu');
const mobile = matchMedia('(max-width: 850px)');
if (toggle && menu) {
  toggle.hidden = false;
  const setMenu = (open, restoreFocus = false) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? toggle.dataset.closeLabel : toggle.dataset.openLabel);
    menu.hidden = !open;
    if (open) menu.querySelector('a')?.focus();
    if (!open && restoreFocus) toggle.focus();
  };
  toggle.addEventListener('click', () => setMenu(menu.hidden, !menu.hidden));
  menu.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    setMenu(false);
    const target = document.querySelector(link.hash);
    if (target) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) { event.preventDefault(); setMenu(false, true); }
  });
  document.addEventListener('pointerdown', event => {
    if (!menu.hidden && !event.target.closest('.site-header')) setMenu(false);
  });
  // Disclosure navigation is not a modal; retain the normal page Tab order.
  document.querySelector('.site-header').addEventListener('focusout', event => {
    if (!menu.hidden && event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setMenu(false);
  });
  mobile.addEventListener('change', () => setMenu(false));
}
document.querySelectorAll('.language-links a').forEach(link => {
  link.addEventListener('click', () => { if (location.hash) link.hash = location.hash; });
});
const legacySections = { '#about': '#ueber-mich', '#services': '#leistungen', '#portfolio': '#eindruck', '#booking': '#kontakt', '#top': '#main' };
if (legacySections[location.hash]) {
  const anchor = legacySections[location.hash];
  history.replaceState(null, '', anchor);
  document.querySelector(anchor)?.scrollIntoView();
}
document.querySelectorAll('video').forEach(video => {
  const fallback = video.closest('figure')?.querySelector('[data-video-fallback]');
  const showFallback = () => { if (fallback) fallback.hidden = false; };
  video.addEventListener('error', showFallback);
  video.querySelectorAll('source').forEach(source => source.addEventListener('error', showFallback));
  video.addEventListener('play', () => {
    document.querySelectorAll('video').forEach(other => { if (other !== video) other.pause(); });
  });
});
const form = document.querySelector('.enquiry-form');
if (form) {
  const fields = [...form.querySelectorAll('[required]')];
  const status = form.querySelector('.form-status');
  const submit = form.querySelector('button[type="submit"]');
  const label = form.querySelector('[data-submit-label]');
  const originalLabel = label.textContent;
  let sending = false;
  form.noValidate = true; // Native validation remains when JavaScript is unavailable.
  const validateField = field => {
    const error = document.getElementById(`${field.id}-error`);
    const valid = field.value.trim() !== '' && field.validity.valid;
    field.setAttribute('aria-invalid', String(!valid));
    error.hidden = valid;
    error.textContent = valid ? '' : field.validity.typeMismatch ? form.dataset.invalidEmail : form.dataset.required;
    return valid;
  };
  const announce = (message, state) => {
    status.dataset.state = state;
    status.setAttribute('role', state === 'error' ? 'alert' : 'status');
    status.textContent = message;
  };
  fields.forEach(field => field.addEventListener('input', () => {
    if (field.getAttribute('aria-invalid') === 'true') validateField(field);
  }));
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending) return;
    const invalid = fields.filter(field => !validateField(field));
    if (invalid.length) { announce(form.dataset.invalid, 'error'); invalid[0].focus(); return; }
    sending = true;
    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    label.textContent = form.dataset.pending;
    announce(form.dataset.pending, 'pending');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const payload = Object.fromEntries(new FormData(form).entries());
      payload.service = form.elements.service.selectedOptions[0].textContent;
      const endpoint = new URL(form.action);
      endpoint.pathname = `/ajax${endpoint.pathname}`;
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload), signal: controller.signal });
      const result = await response.json();
      if (!response.ok || (result.success !== true && result.success !== 'true')) throw new Error('Submission was not accepted');
      announce(form.dataset.success, 'success');
      form.reset();
      fields.forEach(field => field.removeAttribute('aria-invalid'));
    } catch { announce(form.dataset.error, 'error'); }
    finally {
      clearTimeout(timeout);
      sending = false;
      submit.disabled = false;
      form.removeAttribute('aria-busy');
      label.textContent = originalLabel;
      status.focus({ preventScroll: true });
    }
  });
}
