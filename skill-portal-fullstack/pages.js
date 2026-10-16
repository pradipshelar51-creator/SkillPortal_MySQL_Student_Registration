// Shared interactions for SkillPortal sub-pages
const byId = (id) => document.getElementById(id);
const menuToggle = byId('menuToggle');
if (menuToggle) menuToggle.addEventListener('click', () => {
  const nav = byId('mainNav'); if (!nav) return;
  nav.classList.toggle('open'); menuToggle.setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');
});
function addSearch(searchId, cardsId, emptyId, levelId) {
  const search = byId(searchId), cards = byId(cardsId), empty = byId(emptyId), level = levelId ? byId(levelId) : null;
  if (!search || !cards) return;
  const update = () => {
    const term = search.value.trim().toLowerCase(), selected = level ? level.value : 'all'; let shown = 0;
    cards.querySelectorAll('[data-search]').forEach(card => {
      const matchesText = card.dataset.search.toLowerCase().includes(term) || card.textContent.toLowerCase().includes(term);
      const matchesLevel = selected === 'all' || card.dataset.level === selected;
      card.hidden = !(matchesText && matchesLevel); if (!card.hidden) shown++;
    });
    if (empty) empty.style.display = shown ? 'none' : 'block';
  };
  search.addEventListener('input', update); if (level) level.addEventListener('change', update);
}
addSearch('skillSearch','skillCards','skillEmpty','skillLevel');
addSearch('companySearch','companyCards','companyEmpty');
addSearch('projectSearch','projectCards','projectEmpty','projectLevel');
const prepList = byId('prepList');
if (prepList) {
  const checks = [...prepList.querySelectorAll('input[type="checkbox"]')];
  const updateProgress = () => { const count = checks.filter(c => c.checked).length; const pct = Math.round(count / checks.length * 100); byId('prepPercent').textContent = pct + '%'; byId('prepFill').style.width = pct + '%'; };
  checks.forEach(c => c.addEventListener('change', updateProgress)); updateProgress();
}
const quiz = byId('placementQuiz');
if (quiz) quiz.addEventListener('submit', event => {
  event.preventDefault(); const answers = {q1:'a',q2:'b',q3:'a'}; let score = 0, answered = 0;
  Object.entries(answers).forEach(([q,answer]) => { const chosen = quiz.querySelector(`input[name="${q}"]:checked`); if (chosen) { answered++; if (chosen.value === answer) score++; } });
  byId('quizResult').textContent = `You scored ${score}/3 (${answered} answered). ${score === 3 ? 'Excellent work!' : 'Review the topics and try again.'}`;
});
