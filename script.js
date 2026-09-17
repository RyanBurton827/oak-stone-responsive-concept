(() => {
  const menuButton = document.querySelector('.menu-button');
  const navigation = document.querySelector('#site-nav');
  const header = document.querySelector('[data-header]');
  const form = document.querySelector('[data-demo-form]');
  const status = document.querySelector('[data-form-status]');

  const closeMenu = () => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  };

  menuButton?.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    navigation?.classList.toggle('is-open', !isOpen);
  });

  navigation?.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener(
    'scroll',
    () => header?.classList.toggle('is-scrolled', window.scrollY > 12),
    { passive: true },
  );

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    if (status) {
      status.textContent = `Thanks${name ? `, ${name}` : ''}. In a live website, this request would now be sent securely.`;
      status.focus?.();
    }
  });

  // Enable controls only after the local-only submit handler is installed.
  // Without JavaScript, the disabled baseline cannot submit real information.
  if (form && status) {
    form.querySelectorAll('input, select, textarea, button').forEach(control => {
      control.disabled = false;
    });
  }
})();
