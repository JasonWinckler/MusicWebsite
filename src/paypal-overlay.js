import overlayStyles from '../assets/css/paypal-overlay.css?inline';

// Enhance only PayPal's same-origin overlay shell, never its payment document.
export function enhanceOverlay(checkout) {
  const frame = document.querySelector('iframe[title="PayPal Checkout Overlay"]');
  if (!frame) return;
  let overlayDocument;
  try { overlayDocument = frame.contentDocument; } catch { return; }
  const overlay = overlayDocument?.querySelector('.paypal-checkout-overlay');
  const closeButton = overlay?.querySelector('.paypal-checkout-close');
  if (!overlay || !closeButton || overlay.dataset.siteEnhanced) return;

  const english = document.documentElement.lang === 'en';
  const title = english ? 'PayPal donation' : 'PayPal-Spende';
  const closeLabel = english ? 'Close PayPal donation window' : 'PayPal-Spendenfenster schließen';
  const style = overlayDocument.createElement('style');
  style.textContent = overlayStyles;
  // The SDK builds its shell from DOM nodes and may omit a <head> element.
  (overlayDocument.head || overlayDocument.documentElement).append(style);
  frame.style.border = '0';
  frame.setAttribute('aria-label', title);
  overlayDocument.documentElement.lang = english ? 'en' : 'de';
  overlay.dataset.siteEnhanced = 'true';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', title);
  closeButton.setAttribute('aria-label', closeLabel);
  closeButton.title = closeLabel;
  closeButton.addEventListener('keydown', event => {
    // The SDK close control is an anchor with role="button".
    if (event.key === ' ') {
      event.preventDefault();
      closeButton.click();
    }
  });
  overlayDocument.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    checkout.close().catch(() => {});
  });
  closeButton.focus({ preventScroll: true });
}
