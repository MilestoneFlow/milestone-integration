export function matchTargetUrl(
  currentPath: string,
  targetUrl: string,
): boolean {
  if (!targetUrl?.length) {
    return false;
  }

  const decodedTargetUrl = replaceAll(targetUrl, "{{any}}", "[^/]+");
  const regex = new RegExp(`^${decodedTargetUrl}$`);

  return regex.test(currentPath);
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceAll(str: string, find: string, replace: string) {
  return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
}
