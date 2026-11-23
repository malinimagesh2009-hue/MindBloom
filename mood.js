document.addEventListener('DOMContentLoaded', () => {
  const moods = [{name:'Happy',emoji:'😀',score:5},{name:'Good',emoji:'🙂',score:4},{name:'Neutral',emoji:'😐',score:3},{name:'Sad',emoji:'😔',score:2},{name:'Stressed',emoji:'😭',score:1}];
  let selected = null;
  const options = document.querySelectorAll('.mood-option');
  const saveButton = document.getElementById('save-mood');
  const noteInput = document.getElementById('mood-note');
  const feedback = document.getElementById('mood-feedback');
  options.forEach(button => button.addEventListener('click', () => {
    options.forEach(item => item.classList.remove('selected'));
    button.classList.add('selected');
    selected = moods.find(m => m.name === button.dataset.mood);
    saveButton.disabled = false;
    feedback.textContent = `${selected.emoji} ${selected.name} selected.`;
  }));
  function render() {
    const entries = MB.get('moods');
    document.getElementById('mood-total').textContent = `${entries.length} check-in${entries.length === 1 ? '' : 's'}`;
    const list = document.getElementById('mood-history');
    if (!entries.length) { list.innerHTML = '<p class="empty-state">Your saved mood check-ins will appear here.</p>'; return; }
    list.innerHTML = entries.slice().reverse().map(entry => `<article class="history-item"><span class="history-emoji">${entry.emoji}</span><div class="history-content"><strong>${MB.escapeHTML(entry.mood)}</strong><span class="history-date">${MB.formatDate(entry.date)}</span>${entry.note ? `<p>${MB.escapeHTML(entry.note)}</p>` : ''}</div><button class="delete-button" data-delete="${entry.id}" aria-label="Delete mood entry"><i class="fa-solid fa-trash"></i></button></article>`).join('');
    list.querySelectorAll('[data-delete]').forEach(button => button.addEventListener('click', () => {
      MB.set('moods', MB.get('moods').filter(entry => entry.id !== button.dataset.delete)); render();
    }));
  }
  saveButton.addEventListener('click', () => {
    if (!selected) return;
    const entries = MB.get('moods');
    const record = {id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), date: MB.today(), mood: selected.name, emoji: selected.emoji, score: selected.score, note: noteInput.value.trim()};
    const existing = entries.findIndex(entry => entry.date === record.date);
    if (existing >= 0) entries[existing] = record; else entries.push(record);
    MB.set('moods', entries);
    feedback.textContent = 'Your mood check-in has been saved. Thank you for checking in.';
    noteInput.value = ''; saveButton.disabled = true; selected = null; options.forEach(item => item.classList.remove('selected')); render();
  });
  render();
});