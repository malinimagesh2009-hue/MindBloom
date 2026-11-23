document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('journal-entry');
  const count = document.getElementById('journal-count');
  const feedback = document.getElementById('journal-feedback');
  const history = document.getElementById('journal-history');
  textarea.addEventListener('input', () => count.textContent = `${textarea.value.length} / 3000 characters`);
  function render() {
    const entries = MB.get('journals');
    document.getElementById('journal-total').textContent = `${entries.length} entr${entries.length === 1 ? 'y' : 'ies'}`;
    if (!entries.length) { history.innerHTML = '<p class="empty-state">Your journal entries will appear here.</p>'; return; }
    history.innerHTML = entries.slice().reverse().map(entry => `<article class="history-item"><span class="history-emoji">📖</span><div class="history-content"><strong>${MB.formatDate(entry.date)}</strong><p>${MB.escapeHTML(entry.text).replace(/\n/g,'<br>')}</p></div><button class="delete-button" data-delete="${entry.id}" aria-label="Delete journal entry"><i class="fa-solid fa-trash"></i></button></article>`).join('');
    history.querySelectorAll('[data-delete]').forEach(button => button.addEventListener('click', () => {
      MB.set('journals', MB.get('journals').filter(entry => entry.id !== button.dataset.delete)); render();
    }));
  }
  document.getElementById('save-entry').addEventListener('click', () => {
    const text = textarea.value.trim();
    if (!text) { feedback.textContent = 'Write a few words before saving.'; feedback.classList.add('error'); return; }
    const entries = MB.get('journals');
    entries.push({id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), date: MB.today(), text});
    MB.set('journals', entries); textarea.value = ''; count.textContent = '0 / 3000 characters';
    feedback.textContent = 'Your entry has been saved.'; feedback.classList.remove('error'); render();
  });
  render();
});