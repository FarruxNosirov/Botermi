// React Native Version Check imports
const VCModule = require('react-native-version-check');
const VersionCheck = VCModule.default ?? VCModule;

/**
 * Get current app version information
 */
export const getAppVersionInfo = () => {
  const version = VersionCheck?.getCurrentVersion?.() ?? '0.0.0';
  const buildNumber = VersionCheck?.getCurrentBuildNumber?.() ?? '1';

  return {
    version,
    buildNumber,
    formatted: `v${version} (${buildNumber})`,
  };
};

/**
 * Get latest version from store
 */
export const getLatestVersion = async (): Promise<string | null> => {
  try {
    const latest = await VersionCheck?.getLatestVersion?.();
    return latest ?? null;
  } catch (error) {
    console.error('Error fetching latest version:', error);
    return null;
  }
};

/**
 * Get store URL (App Store or Google Play)
 */
export const getStoreUrl = async (options?: { country?: string }): Promise<string | null> => {
  try {
    if (!VersionCheck?.getStoreUrl) {
      return null;
    }

    const url = await VersionCheck.getStoreUrl(options);
    return url ?? null;
  } catch (error) {
    return null;
  }
};

/**
 * Parse semantic version string into components
 */
const parseSemVer = (version: string) => {
  const parts = `${version}`
    .trim()
    .split('.')
    .map((n) => Number(n) || 0);
  const [major, minor, patch] = parts.concat([0, 0, 0]).slice(0, 3);
  return { major, minor, patch };
};

/**
 * Compare versions and return update type
 */
export const compareVersions = (
  current: string,
  latest: string,
): 'major' | 'minor' | 'patch' | 'none' => {
  const c = parseSemVer(current);
  const l = parseSemVer(latest);

  if (l.major > c.major) return 'major';
  if (l.major === c.major && l.minor > c.minor) return 'minor';
  if (l.major === c.major && l.minor === c.minor && l.patch > c.patch) return 'patch';

  return 'none';
};
