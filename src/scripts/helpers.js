export const convToHex = (num) => {
  if (num < 16) return "00";

  return num.toString(16);
};

export const clampRgbVal = (val, maxVal) => {
  if (val >= maxVal) return maxVal;
  if (val <= 0) return 0;

  return val;
};

export const elemIsNotHidden = (elem) => {
  if (elem.classList.contains("elem-hide")) return false;
  return true;
};

export const storeToLocal = (key, value) => localStorage.setItem(key, value);
export const getLocalKey = (key) => localStorage.getItem(key);
export const deleteLocalKey = (key) => localStorage.removeItem(key);
