export function requestPointerLock() {
  const element = document.documentElement;
  if ('requestPointerLock' in element) {
    element.requestPointerLock();
  }
}
