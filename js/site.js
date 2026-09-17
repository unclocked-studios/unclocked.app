(function () {
  'use strict';
  var root = document.documentElement;
  var appearance = document.getElementById('appearance');
  if (appearance) {
    appearance.value = root.dataset.appearance || 'system';
    appearance.addEventListener('change', function () {
      root.dataset.appearance = appearance.value;
      try { localStorage.setItem('unclocked-appearance', appearance.value); } catch (_) {}
    });
    appearance.closest('.appearance-control').hidden = false;
  }
  var button = document.querySelector('.menu-toggle');
  var navigation = document.getElementById('site-navigation');
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
  if (button && navigation) {
    button.hidden = false;
    root.classList.add('navigation-ready');
    function closeMenu() {
      button.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('is-open');
      closeProducts();
    }
    button.addEventListener('click', function () {
      var open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      navigation.classList.toggle('is-open', open);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      if (products && products.open) {
        closeProducts();
        products.querySelector('summary').focus();
      } else if (button.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        button.focus();
      }
    });
    navigation.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu();
    });
    window.matchMedia('(min-width: 901px)').addEventListener('change', closeMenu);
  }
})();
