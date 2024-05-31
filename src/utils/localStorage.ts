export const getLocalStorage = (key: string) => {
  return window.localStorage.getItem(key);
};

export const setLocalStorage = (key: string, value: string) => {
  window.localStorage.setItem(key, value);
};

export const removeLocalStorage = (key: string) => {
  window.localStorage.removeItem(key);
};
