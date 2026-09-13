/* ---------------------------------------------------------------
   Theme toggle.

   The theme itself is applied by the small inline script in each
   page's <head>, which runs before first paint so the page never
   flashes the wrong colours. This file only wires up the button
   and keeps following the operating system until the visitor
   makes a choice of their own.
   --------------------------------------------------------------- */

(function () {
  var root = document.documentElement;
  var button = document.querySelector('[data-theme-toggle]');
  var query = window.matchMedia('(prefers-color-scheme: light)');

  function stored() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }

  function describe() {
    if (!button) return;
    var isDark = root.getAttribute('data-theme') === 'dark';
    button.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
  }

  function apply(theme, remember) {
    root.setAttribute('data-theme', theme);
    if (remember) {
      // Private browsing and blocked storage both throw here; the
      // toggle should still work for the current page in that case.
      try { localStorage.setItem('theme', theme); } catch (e) {}
    }
    describe();
  }

  describe();

  if (button) {
    button.addEventListener('click', function () {
      apply(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
    });
  }

  function followSystem(event) {
    if (!stored()) apply(event.matches ? 'light' : 'dark', false);
  }

  if (query.addEventListener) query.addEventListener('change', followSystem);
  else if (query.addListener) query.addListener(followSystem);
})();
