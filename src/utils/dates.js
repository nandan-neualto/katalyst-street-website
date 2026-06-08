export function formatDate(dateString) {
  if (!dateString) return '';
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', dateOptions);
}
