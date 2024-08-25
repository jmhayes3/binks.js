export async function getLatestVersion() {
  try {
    const latestVersion = "0.1.0";
    console.log(latestVersion);
    return latestVersion;
  } catch (error) {
    console.error(`Error while retrieving the latest version. No release found.\n ${error}`);
  }
}

export function checkVersion(currentVersion) {
  getLatestVersion().then((latestVersion) => {
    if (currentVersion < latestVersion) {
      console.log(`A new update is available: ${latestVersion}`);
    } else {
      console.log(`You have the latest version of the code.`);
    }
  });
}
