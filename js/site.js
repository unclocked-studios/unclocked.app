/*
 * Site-wide behavior, loaded on every page (deferred).
 * Pages work without this script: navigation links are plain HTML, and the
 * Appearance menu and Menu button stay hidden until it runs.
 *
 *   setUpAppearance()   System / Light / Dark menu (js/theme.js applies it on load)
 *   setUpProductsMenu() closes the Products <details> menu when focus or clicks move away
 *   setUpMobileMenu()   the Menu button that opens the navigation below 900px
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var STORAGE_KEY = 'unclocked-appearance';
  // Matches the 900px navigation breakpoint in css/src/02-header.css.
  var DESKTOP_QUERY = '(min-width: 901px)';

  /** Shows the Appearance menu and saves the visitor's choice when storage is available. */
  function setUpAppearance() {
    var appearance = document.getElementById('appearance');
    if (!appearance) return;
    appearance.value = root.dataset.appearance || 'system';
    appearance.addEventListener('change', function () {
      root.dataset.appearance = appearance.value;
      try { localStorage.setItem(STORAGE_KEY, appearance.value); } catch (_) { /* Private browsing: the choice lasts for this page only. */ }
    });
    appearance.closest('.appearance-control').hidden = false;
  }

  /** Closes the Products menu when a click or keyboard focus lands outside it. Returns a close function. */
  function setUpProductsMenu() {
    var products = document.querySelector('.products-dropdown');
    function closeProducts() {
      if (products) products.open = false;
    }
    if (products) {
      document.addEventListener('click', function (event) {
        if (!products.contains(event.target)) closeProducts();
      });
      document.addEventListener('focusin', function (event) {
        if (!products.contains(event.target)) closeProducts();
      });
    }
    return { element: products, close: closeProducts };
  }

  /**
   * Reveals the Menu button and toggles the navigation panel on narrow screens.
   * Escape closes the Products menu first, then the navigation, returning focus
   * to the control that opened it.
   */
  function setUpMobileMenu(productsMenu) {
    var button = document.querySelector('.menu-toggle');
    var navigation = document.getElementById('site-navigation');
    if (!button || !navigation) return;

    var products = productsMenu.element;
    button.hidden = false;
    root.classList.add('navigation-ready'); // CSS hides the panel until it is opened.

    function closeMenu() {
      button.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('is-open');
      productsMenu.close();
    }

    button.addEventListener('click', function () {
      var open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      navigation.classList.toggle('is-open', open);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      if (products && products.open) {
        productsMenu.close();
        products.querySelector('summary').focus();
      } else if (button.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        button.focus();
      }
    });

    // Following a link closes the panel; so does widening the window to desktop.
    navigation.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu();
    });
    window.matchMedia(DESKTOP_QUERY).addEventListener('change', closeMenu);
  }

  setUpAppearance();
  setUpMobileMenu(setUpProductsMenu());
})();
