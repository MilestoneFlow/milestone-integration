export function getFromLocalStorage<T>(key: string): T | null {
  const item = localStorage.getItem(key);

  if (item) {
    return JSON.parse(item);
  }
  return null;
}

export function setInLocalStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}
