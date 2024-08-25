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
    const latestVersion = '1.0.0';
    console.log(latestVersion);

    const response = await fetch('https://github.com/jmhayes3/binksjs/releases/latest');
    console.log(response);
    console.log(response.data.tag_name);

    return latestVersion;
  } catch (error) {
    console.error(`Error while retrieving the latest version. No release found.\n ${error}`);
  }
}

export async function checkVersion(currentVersion) {
  let reply = `You already have the latest version.`;

  const latestVersion = await getLatestVersion();
  if (currentVersion < latestVersion) {
    reply = `The latest version is ${latestVersion}. You are currently using version ${currentVersion}.`;
  }

  return reply;
}
