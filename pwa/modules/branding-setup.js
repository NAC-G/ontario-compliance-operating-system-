/**
 * T3 Custom branding — thin helper for the branding setup screen.
 * The main UI wiring lives in app.js; this module handles data serialization.
 */

export function collectBrandingFormData() {
  const logoInput    = document.getElementById('logo-file-input');
  const primaryHex   = document.getElementById('brand-primary-hex')?.value?.trim() || '#080A07';
  const accentHex    = document.getElementById('brand-accent-hex')?.value?.trim()  || '#5EE830';
  const companyName  = document.getElementById('brand-company-name')?.value?.trim() || '';
  const footerLine   = document.getElementById('brand-footer-line')?.value?.trim()  || '';

  const fd = new FormData();
  if (logoInput?.files?.[0]) fd.append('logo', logoInput.files[0]);
  fd.append('primaryColour', primaryHex);
  fd.append('accentColour',  accentHex);
  fd.append('companyName',   companyName);
  fd.append('footerLine',    footerLine);

  return fd;
}

export function isValidHex(hex) {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}
