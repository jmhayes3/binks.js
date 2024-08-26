import 'dotenv/config';

export function splitString(str, length) {
  if (length <= 0) {
    throw new Error('Length must be greater than 0');
  }
  const segments = [];
  for (let i = 0; i < str.length; i += length) {
    segments.push(str.slice(i, i + length));
  }
  return segments;
}

export const sleep = (ms) => {
  console.log('Sleeping ' + ms + 'ms');
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getLatestVersion() {
  try {
    const response = await fetch('https://github.com/jmhayes3/binks.js/releases/latest');
    console.log(response);

    const url = response.url;
    console.log(url);

    const tag = response.url.split('/').at(-1);
    console.log(tag);

    const cleaned = tag.split('v').at(-1);
    console.log(cleaned);

    return cleaned;
  } catch (error) {
    console.error(`Error while retrieving the latest version. No release found.\n ${error}`);
  }
}
