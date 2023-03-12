export function getBuildVersion(): string {
  return process.env.BUILD_VERSION ?? 'UNKNOWN'
}
