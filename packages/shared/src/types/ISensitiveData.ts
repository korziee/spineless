export interface ISensitiveData {
  filterSensitiveData(): this;
}

export function hasSensitiveData(x: any): x is ISensitiveData {
  return x !== null && typeof x.filterSensitiveData === "function";
}
