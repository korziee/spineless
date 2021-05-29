// returns the UTC time in seconds
export function currentUnixTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

// used for unit tests
let frozenTime: number = null;
declare let module: any;
export function freezeTime(): void {
  frozenTime = Math.floor(Date.now() / 1000);

  // override the whole timestamp function
  module.exports.currentUnixTimestamp = () => {
    return frozenTime;
  };
}

export function tickTime(): void {
  if (frozenTime === null) {
    throw new Error(
      "Cannot tickTime() when time has not been frozen (with freezeTime())"
    );
  }
  frozenTime++;
}
