import { enhanceOverlay } from './paypal-overlay.js';

// Keep the existing link as the no-JS fallback. Contact PayPal only after a click.
const button = document.querySelector('[data-paypal-donate]');
const feedback = document.querySelector('.linkhub-donation-feedback');
const status = document.querySelector('[data-paypal-status]');
const fallback = document.querySelector('[data-paypal-fallback]');
const english = document.documentElement.lang === 'en';
const sdkUrl = 'https://www.paypalobjects.com/donate/sdk/donate-sdk.js';
let sdkPromise;
let opening = false;
let checkout;
let background = [];
let session = 0;

function loadSdk() {
  if (window.PayPal?.Donation?.Checkout) return Promise.resolve();
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = sdkUrl;
    script.async = true;
    script.charset = 'UTF-8';
    const fail = () => {
      clearTimeout(timeout);
      script.remove();
      reject(new Error('PayPal Donation SDK unavailable'));
    };
    const timeout = setTimeout(fail, 15000);
    script.onerror = fail;
    script.onload = () => {
      if (!window.PayPal?.Donation?.Checkout) return fail();
      clearTimeout(timeout);
      resolve();
    };
    document.head.append(script);
  }).catch(error => {
    sdkPromise = undefined;
    throw error;
  });
  return sdkPromise;
}

function restorePage() {
  session += 1;
  opening = false;
  checkout = undefined;
  button.removeAttribute('aria-busy');
  background.forEach(([element, inert]) => { element.inert = inert; });
  background = [];
  document.body.classList.remove('paypal-checkout-open');
  button.focus({ preventScroll: true });
}

function showError(activeSession) {
  if (activeSession !== session) return;
  const failedCheckout = checkout;
  restorePage();
  // A failed embedded checkout never navigates away or opens another tab.
  failedCheckout?.close().catch(() => {});
  feedback.hidden = false;
  fallback.hidden = false;
  status.textContent = english
    ? 'PayPal could not be loaded. Please try again or open PayPal directly.'
    : 'PayPal konnte nicht geladen werden. Bitte erneut versuchen oder PayPal direkt öffnen.';
}

if (button) {
  button.setAttribute('aria-haspopup', 'dialog');
  button.addEventListener('click', async event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (opening || checkout) return;
    const activeSession = ++session;
    opening = true;
    button.setAttribute('aria-busy', 'true');
    feedback.hidden = false;
    fallback.hidden = true;
    status.textContent = english ? 'Loading PayPal …' : 'PayPal wird geladen …';
    try {
      await loadSdk();
      checkout = window.PayPal.Donation.Checkout({
        env: 'production',
        hosted_button_id: new URL(button.href).searchParams.get('hosted_button_id'),
        onDisplay: () => { if (activeSession === session) enhanceOverlay(checkout); },
        onClose: () => { if (activeSession === session) restorePage(); },
        onError: () => showError(activeSession),
      });
      background = [...document.querySelectorAll('.skip-link, .linkhub-topbar, .linkhub-shell, .linkhub-footer')]
        .map(element => [element, element.inert]);
      background.forEach(([element]) => { element.inert = true; });
      document.body.classList.add('paypal-checkout-open');
      feedback.hidden = true;
      // Explicit iframe context displays PayPal's own overlay in this page.
      // renderTo() has an automatic top-page redirect fallback, so use render().
      await checkout.render('body', 'iframe');
      if (activeSession === session) button.removeAttribute('aria-busy');
    } catch {
      showError(activeSession);
    }
  });
}
