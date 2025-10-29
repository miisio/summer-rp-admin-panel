// Sprawdzenie zalogowanego admina
const admin = JSON.parse(localStorage.getItem('admin'));
if (!admin) {
  window.location.href = 'index.html';
}

// Obsługa zakładek
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-content').forEach(tc => tc.style.display = 'none');
    document.getElementById(btn.dataset.tab).style.display = 'block';
  });
});

// Wypełnienie listy administracji
const staffListDiv = document.getElementById('staffList');
fetch('../backend/admins.json')
  .then(res => res.json())
  .then(data => {
    let html = '';
    data.forEach(a => {
      html += `<p>${a.role} - ${a.username}</p>`;
    });
    staffListDiv.innerHTML = html;
  });

// Obsługa formularza urlopu
document.getElementById('submitLeave').addEventListener('click', () => {
  const reason = document.getElementById('leaveReason').value;
  const from = document.getElementById('leaveFrom').value;
  const to = document.getElementById('leaveTo').value;
  const msgDiv = document.getElementById('leaveMsg');

  if (!reason || !from || !to) {
    msgDiv.textContent = 'Wypełnij wszystkie pola!';
    msgDiv.style.color = 'red';
    return;
  }

  fetch('http://localhost:3000/api/leave', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: admin.username, role: admin.role, reason, from, to })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === 'ok') {
      msgDiv.textContent = 'Urlop wysłany!';
      msgDiv.style.color = 'lime';
    } else {
      msgDiv.textContent = 'Błąd wysyłki urlopu';
      msgDiv.style.color = 'red';
    }
  })
  .catch(() => {
    msgDiv.textContent = 'Błąd połączenia z backendem';
    msgDiv.style.color = 'red';
  });
});
