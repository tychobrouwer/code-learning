export function randomFromArray(propbabilityArray: number[]) {
  return propbabilityArray[Math.floor(Math.random() * propbabilityArray.length)];
}

export function randomFromMinMax(min: number, max: number): number {
  return (max !== -1) ? Math.floor(Math.random() * (max - min + 1)) + min : min;
}