/* Apply before the stylesheet paints; storage is optional. */
(function () {
  'use strict';
  var preference = 'system';
  try {
    var saved = localStorage.getItem('unclocked-appearance');
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch (_) { /* Private browsing still follows the system. */ }
  document.documentElement.dataset.appearance = preference;
})();
