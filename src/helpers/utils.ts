/** Converts a Date object to string. */
function formatDateToTimeString (date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const paddedHours = String(hours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');

  return `${paddedHours}:${paddedMinutes}`;
};

export {formatDateToTimeString};