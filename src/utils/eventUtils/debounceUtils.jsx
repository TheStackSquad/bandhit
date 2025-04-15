// src/utils/eventUtils/DebounceUtils.js
export const debounce = (func, wait = 300) => {
  let timeoutId; // Renamed 'timeout' to 'timeoutId' for clarity

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeoutId);
      func(...args);
    };

    clearTimeout(timeoutId);
    timeoutId = setTimeout(later, wait);
  };
};

// For promise-based functions
export const debouncePromise = (func, wait = 300) => {
  //eslint-disable-next-line
  let timeoutId;
  let pendingPromise = null;

  return function (...args) {
    if (pendingPromise) return pendingPromise;

    const promise = new Promise((resolve, reject) => {
      timeoutId = setTimeout(() => {
        pendingPromise = null;
        func(...args).then(resolve).catch(reject);
      }, wait);
    });

    pendingPromise = promise;
    return promise;
  };
};