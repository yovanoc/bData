export const sleep = (ms: number): Promise<void> =>
  new Promise<void>(r => setTimeout(r, ms));

function calc(m: number) {
  return function (n: number): number {
    return Math.round(n * m);
  };
}

export const getRoundedDate = (date: Date, ms: number): Date => {
  return new Date(Math.round(date.getTime() / ms) * ms);
};

export const ms = {
  seconds: calc(1e3),
  minutes: calc(6e4),
  hours: calc(36e5),
  days: calc(864e5),
  weeks: calc(6048e5),
  months: calc(26298e5),
  years: calc(315576e5)
};
