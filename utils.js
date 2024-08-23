function splitString(str, length) {
  if (length <= 0) {
    throw new Error('Length must be greater than 0');
  }

  const segments = [];
  for (let i = 0; i < str.length; i += length) {
    segments.push(str.slice(i, i + length));
  }

  return segments;
}