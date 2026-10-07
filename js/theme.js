/*
 * Applies the saved appearance before the stylesheet paints, so dark-mode
 * visitors never see a flash of the light theme. Loaded without defer in the
 * shared head. Sets <html data-appearance="system|light|dark">, which
 * css/src/00-tokens.css reads. Storage is optional; without it the page
 * follows the system setting.
 */
(function () {
  'use strict';
  var preference = 'system';
  try {
    var saved = localStorage.getItem('unclocked-appearance');
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch (_) { /* Private browsing still follows the system. */ }
  document.documentElement.dataset.appearance = preference;
})();
