document.addEventListener('DOMContentLoaded', () => {
  const circle = document.getElementById('breath-circle');
  const phaseText = document.getElementById('breath-phase');
  const timerText = document.getElementById('breath-timer');
  const instruction = document.getElementById('breath-instruction');
  const startButton = document.getElementById('breath-start');
  const pauseButton = document.getElementById('breath-pause');
  const resetButton = document.getElementById('breath-reset');
  const phases = [{name:'Inhale',seconds:4,css:'inhale',tip:'Breathe in gently.'},{name:'Hold',seconds:4,css:'hold',tip:'Pause comfortably.'},{name:'Exhale',seconds:4,css:'exhale',tip:'Breathe out slowly.'}];
  let phaseIndex = 0, remaining = 4, timer = null, running = false;
  function display() {
    const phase = phases[phaseIndex];
    phaseText.textContent = phase.name; timerText.textContent = remaining;
    instruction.textContent = phase.tip; circle.className = `breath-circle ${running ? phase.css : ''}`;
    startButton.disabled = running; pauseButton.disabled = !running;
    startButton.innerHTML = '<i class="fa-solid fa-play"></i> Start session';
  }
  function tick() {
    remaining--;
    if (remaining <= 0) { phaseIndex = (phaseIndex + 1) % phases.length; remaining = phases[phaseIndex].seconds; }
    display();
  }
  function start() { if (running) return; running = true; display(); timer = setInterval(tick, 1000); }
  function pause() { running = false; clearInterval(timer); circle.className = 'breath-circle'; instruction.textContent = 'Paused. Resume whenever you feel ready.'; startButton.disabled = false; pauseButton.disabled = true; }
  function reset() { running = false; clearInterval(timer); phaseIndex = 0; remaining = 4; phaseText.textContent = 'Ready?'; timerText.textContent = '4'; instruction.textContent = 'Press start when you\'re ready.'; circle.className = 'breath-circle'; startButton.disabled = false; pauseButton.disabled = true; }
  startButton.addEventListener('click', start); pauseButton.addEventListener('click', pause); resetButton.addEventListener('click', reset);
  reset();
});