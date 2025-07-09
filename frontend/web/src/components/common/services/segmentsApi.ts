export async function fetchAllSegments() {
  const res = await fetch('/api/segments/all');
  if (!res.ok) throw new Error('Failed to fetch segment masters');
  return res.json();
}
