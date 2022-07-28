export function randomFromArray(propbabilityArray: number[]) {
  return propbabilityArray[Math.floor(Math.random() * propbabilityArray.length)];
}

export function randomFromMinMax(min: number, max: number): number {
  return (max !== -1) ? Math.floor(Math.random() * (max - min + 1)) + min : min;
}

export function setLocalStorage(key: string, data: object): void {
  localStorage.setItem(key, JSON.stringify(data))
}

export function getLocalStorage(key: string): any {
  const data = localStorage.getItem(key);

  if (!data) {
    return {};
  }

  return JSON.parse(data);
}