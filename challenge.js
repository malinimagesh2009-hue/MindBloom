document.addEventListener('DOMContentLoaded', () => {
  const tasks = [
    {id:'water',icon:'💧',title:'Drink water',detail:'Have a glass of water when you feel thirsty.'},
    {id:'walk',icon:'🚶',title:'Take a 15-minute walk',detail:'Move in a way that feels comfortable for you.'},
    {id:'read',icon:'📚',title:'Read a few pages',detail:'Enjoy a book, article, or something you like.'},
    {id:'pause',icon:'🧘',title:'Take a mindful pause',detail:'Try five minutes of quiet time or breathing.'},
    {id:'rest',icon:'🌙',title:'Make room for rest',detail:'Choose a bedtime routine that suits your schedule.'}
  ];
  function todayState() {
    let state = MB.get('challengeState', {});
    if (state.date !== MB.today()) state = {date:MB.today(),completed:[]};
    return state;
  }
  function calculateStreak() {
    const history = MB.get('challengeHistory', {});
    let streak = 0, date = new Date();
    while (true) {
      const key = date.toLocaleDateString('en-CA');
      if ((history[key] || []).length !== tasks.length) break;
      streak++; date.setDate(date.getDate() - 1);
    }
    return streak;
  }
  function render() {
    const state = todayState(); MB.set('challengeState', state);
    const done = state.completed.length, percent = Math.round(done / tasks.length * 100);
    document.getElementById('challenge-percent').textContent = `${percent}%`;
    document.getElementById('challenge-ring').style.setProperty('--progress', `${percent}%`);
    document.getElementById('challenge-progress').style.width = `${percent}%`;
    document.getElementById('challenge-count').textContent = `${done} of ${tasks.length} completed`;
    document.getElementById('challenge-streak').textContent = `${calculateStreak()}-day streak`;
    document.getElementById('challenge-list').innerHTML = tasks.map(task => `<div class="challenge-item ${state.completed.includes(task.id) ? 'done' : ''}"><span>${task.icon}</span><input type="checkbox" id="task-${task.id}" data-task="${task.id}" ${state.completed.includes(task.id) ? 'checked' : ''}><label for="task-${task.id}">${task.title}<br><small>${task.detail}</small></label></div>`).join('');
    document.querySelectorAll('[data-task]').forEach(input => input.addEventListener('change', () => {
      const latest = todayState();
      latest.completed = input.checked ? [...new Set([...latest.completed, input.dataset.task])] : latest.completed.filter(id => id !== input.dataset.task);
      MB.set('challengeState', latest);
      const history = MB.get('challengeHistory', {}); history[MB.today()] = latest.completed; MB.set('challengeHistory', history);
      render();
    }));
  }
  render();
});