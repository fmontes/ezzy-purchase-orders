export function getToday() {
  const now = new Date();
  const day = ('0' + now.getDate()).slice(-2);
  const month = ('0' + (now.getMonth() + 1)).slice(-2);

  return `${now.getFullYear()}-${month}-${day}`;
}
