document.addEventListener('DOMContentLoaded', () => {
  const moods = MB.get('moods');
  const journals = MB.get('journals');
  const todayState = MB.get('challengeState', {});
  const completed = todayState.date === MB.today() ? (todayState.completed || []).length : 0;
  const history = MB.get('challengeHistory', {});
  let streak = 0, date = new Date();
  while ((history[date.toLocaleDateString('en-CA')] || []).length === 5) { streak++; date.setDate(date.getDate()-1); }
  document.getElementById('dash-moods').textContent = moods.length;
  document.getElementById('dash-journals').textContent = journals.length;
  document.getElementById('dash-challenges').textContent = completed;
  document.getElementById('dash-streak').textContent = `${streak} days`;
  const labels = [], values = [];
  for (let i=6; i>=0; i--) {
    const day = new Date(); day.setDate(day.getDate()-i);
    const key = day.toLocaleDateString('en-CA');
    const found = moods.find(item => item.date === key);
    labels.push(day.toLocaleDateString(undefined,{weekday:'short'})); values.push(found ? found.score : null);
  }
  const historyForToday = MB.get('challengeState', {});
  const done = historyForToday.date === MB.today() ? (historyForToday.completed || []).length : 0;
  if (typeof Chart === 'undefined') {
    document.querySelectorAll('.chart-wrap').forEach(el => el.innerHTML = '<p class="empty-state">Charts need an internet connection to load Chart.js. Your saved data is still available.</p>');
    return;
  }
  const isDark = document.body.classList.contains('dark');
  const textColor = isDark ? '#c6d4c9' : '#718078';
  const gridColor = isDark ? '#34483a' : '#e4ebe4';
  new Chart(document.getElementById('mood-chart'), {type:'line',data:{labels,datasets:[{label:'Mood score',data:values,borderColor:'#659775',backgroundColor:'rgba(101,151,117,.15)',fill:true,tension:.35,spanGaps:false,pointRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{min:1,max:5,ticks:{stepSize:1,color:textColor},grid:{color:gridColor}},x:{ticks:{color:textColor},grid:{display:false}}}}});
  new Chart(document.getElementById('challenge-chart'), {type:'doughnut',data:{labels:['Completed','Remaining'],datasets:[{data:[done,5-done],backgroundColor:['#659775',isDark?'#34483a':'#e7eee7'],borderWidth:0,hoverOffset:4}]},options:{responsive:true,maintainAspectRatio:false,cutout:'72%',plugins:{legend:{position:'bottom',labels:{color:textColor,padding:18}}}}});
});