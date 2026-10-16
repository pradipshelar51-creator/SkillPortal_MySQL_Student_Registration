// SkillPortal standalone frontend. Student registration is saved through the Express API to MySQL.
const $ = (selector) => document.querySelector(selector);
const API_BASE = 'http://localhost:5000/api';
const loginModal = $('#loginModal');
const toast = $('#toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}
function openLogin() {
  loginModal.classList.add('open');
  loginModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('#studentName').focus(), 50);
}
function closeLogin() {
  loginModal.classList.remove('open');
  loginModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
$('#loginOpen').addEventListener('click', openLogin);
$('#ctaLogin').addEventListener('click', openLogin);
$('#loginClose').addEventListener('click', closeLogin);
loginModal.addEventListener('click', (event) => { if (event.target === loginModal) closeLogin(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLogin(); });

$('#loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = $('#studentName').value.trim();
  const email = $('#studentEmail').value.trim().toLowerCase();
  const skill = $('#studentSkill').value;
  const message = $('#formMessage');
  const submitButton = event.currentTarget.querySelector('button[type="submit"]');
  if (name.length < 2) { message.textContent = 'Please enter a name with at least 2 characters.'; return; }
  if (!email) { message.textContent = 'Please enter a valid email address.'; return; }

  submitButton.disabled = true;
  submitButton.textContent = 'Saving student...';
  message.textContent = 'Connecting to the database...';
  try {
    const response = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, skill })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || `Request failed (${response.status})`);
    try { sessionStorage.setItem('skillPortalStudent', JSON.stringify({ id: result.id, name, email, skill })); } catch (_) {}
    message.textContent = '';
    $('#dashboardMessage').textContent = `Welcome, ${name}! Your student record has been saved to the database.`;
    closeLogin();
    showToast(`Student saved successfully! Record ID: ${result.id}`);
  } catch (error) {
    message.textContent = error.message.includes('Failed to fetch')
      ? 'Cannot reach the server. Start the backend and make sure MySQL is configured, then try again.'
      : error.message;
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Register and Save';
  }
});

let progress = 68;
$('#progressButton').addEventListener('click', () => {
  progress = Math.min(progress + 5, 100);
  $('#progressText').textContent = `${progress}%`;
  $('#progressFill').style.width = `${progress}%`;
  $('#dashboardMessage').textContent = progress === 100 ? 'Excellent work! You have reached your demo learning goal.' : 'Nice progress! Keep learning and move closer to your dream job.';
  if (progress === 100) $('#progressButton').hidden = true;
  showToast(`Your demo progress is now ${progress}%.`);
});
$('#menuToggle').addEventListener('click', () => {
  const nav = $('#mainNav');
  nav.classList.toggle('open');
  $('#menuToggle').setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');
});
document.querySelectorAll('#mainNav a').forEach((link) => link.addEventListener('click', () => $('#mainNav').classList.remove('open')));
try {
  const saved = JSON.parse(sessionStorage.getItem('skillPortalStudent') || 'null');
  if (saved && saved.name) $('#dashboardMessage').textContent = `Welcome back, ${saved.name}! Registered skill: ${saved.skill || 'Not specified'}.`;
} catch (_) {}
