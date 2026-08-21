export function extractExpectedDigitCount(placeholder) {
  if (!placeholder) return null;
  const match = placeholder.match(/(\d+)\s*ციფრი/);
  return match ? parseInt(match[1], 10) : null;
}
export function validateDigitField(value, placeholder) {
  const expected = extractExpectedDigitCount(placeholder);
  if (expected === null) return null;
  if (!value) return null;
  if (!/^\d+$/.test(value)) {
    return "დასაშვებია მხოლოდ ციფრები";
  }
  if (value.length !== expected) {
    return `უნდა შედგებოდეს ${expected} ციფრისგან (ამჟამად: ${value.length})`;
  }
  return null;
}
export function validateEmail(value) {
  if (!value) return null;
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  return valid ? null : "არასწორი ელ. ფოსტის ფორმატი";
}