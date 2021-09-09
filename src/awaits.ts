export function forTimeout(timeout: number) {
  return new Promise(resolve => {
    setTimeout(() => resolve(true), timeout);
  });
}
