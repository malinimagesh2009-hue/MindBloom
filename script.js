const MB = {
  get(key, fallback = []) {
    try { return JSON.parse(localStorage.getItem(`mindbloom_${key}`)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) { localStorage.setItem(`mindbloom_${key}`, JSON.stringify(value)); },
  today() { return new Date().toLocaleDateString('en-CA'); },
  formatDate(dateString) {
    return new Date(`${dateString}T12:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  },
  escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  },
  quotes: [
    'Your mental health matters.',
    'Small progress is still progress.',
    'Believe in yourself.',
    'You can take things one step at a time.',
    'Rest is productive when you need it.',
    'You deserve the same kindness you give others.',
    'A fresh start can begin with one small choice.'
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.current-year').forEach(el => el.textContent = new Date().getFullYear());
  const themeButton = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('mindbloom_theme');
  if (savedTheme === 'dark') document.body.classList.add('dark');
  const updateThemeIcon = () => {
    if (themeButton) themeButton.innerHTML = document.body.classList.contains('dark') ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  };
  updateThemeIcon();
  themeButton?.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('mindbloom_theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    updateThemeIcon();
  });
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  menuButton?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  const setQuote = target => { if (target) target.textContent = MB.quotes[Math.floor(Math.random() * MB.quotes.length)]; };
  setQuote(document.getElementById('daily-quote'));
  setQuote(document.getElementById('home-quote'));
  document.getElementById('next-quote')?.addEventListener('click', () => setQuote(document.getElementById('daily-quote')));
  document.getElementById('home-next-quote')?.addEventListener('click', () => setQuote(document.getElementById('home-quote')));
});