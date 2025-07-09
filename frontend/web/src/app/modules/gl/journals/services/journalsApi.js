const API_BASE = 'http://localhost:5000/api/journals';

export async function listJournals() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch journals');
  return res.json();
}

export async function getJournal(id) {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch journal');
  return res.json();
}

export async function createJournal(data) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create journal');
  return res.json();
}

export async function updateJournal(id, data) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update journal');
  return res.json();
}

export async function deleteJournal(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete journal');
  return res.json();
}
