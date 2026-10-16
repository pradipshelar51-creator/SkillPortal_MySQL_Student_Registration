const API = 'http://localhost:5000/api';
const statusBox = document.getElementById('recordsStatus');
const rowsBox = document.getElementById('studentRows');
const refreshButton = document.getElementById('refreshRecords');
const menuToggle = document.getElementById('menuToggle');
if (menuToggle) menuToggle.addEventListener('click', () => document.getElementById('mainNav').classList.toggle('open'));

function setStatus(message, isError = false) {
  statusBox.textContent = message;
  statusBox.classList.toggle('error', isError);
}
function cell(text) {
  const td = document.createElement('td');
  td.textContent = text == null ? '' : String(text);
  return td;
}
async function loadStudents() {
  refreshButton.disabled = true;
  setStatus('Loading student records from MySQL...');
  rowsBox.replaceChildren();
  try {
    const response = await fetch(`${API}/students`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Could not load student records.');
    if (!Array.isArray(data) || data.length === 0) {
      setStatus('No student records found yet. Register a student from the homepage.');
      return;
    }
    data.forEach(student => {
      const row = document.createElement('tr');
      row.append(cell(student.id), cell(student.name), cell(student.email), cell(student.skill), cell(student.created_at ? new Date(student.created_at).toLocaleString() : ''));
      rowsBox.append(row);
    });
    setStatus(`Successfully loaded ${data.length} student record(s) from the database.`);
  } catch (error) {
    setStatus(error.message.includes('Failed to fetch')
      ? 'Cannot connect to the API. Start Node.js and check that MySQL is running and configured.'
      : error.message, true);
  } finally {
    refreshButton.disabled = false;
  }
}
refreshButton.addEventListener('click', loadStudents);
loadStudents();
