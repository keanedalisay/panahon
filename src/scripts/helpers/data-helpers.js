/* eslint-disable linebreak-style */

import countries from "i18n-iso-countries";
import enLang from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLang);

export const storeToLocal = (key, value) => localStorage.setItem(key, value);
export const getLocalKey = (key) => localStorage.getItem(key);
export const deleteLocalKey = (key) => localStorage.removeItem(key);

export const getCountryName = (cntryCode) =>
  countries.getName(cntryCode, "en", { select: "alias" });

export const parseWeekDayName = (weekDayNum) => {
  let weekDay;
  switch (weekDayNum) {
    case 0:
      weekDay = "Sunday";
      break;
    case 1:
      weekDay = "Monday";
      break;
    case 2:
      weekDay = "Tuesday";
      break;
    case 3:
      weekDay = "Wednesday";
      break;
    case 4:
      weekDay = "Thursday";
      break;
    case 5:
      weekDay = "Friday";
      break;
    case 6:
      weekDay = "Saturday";
      break;
    default:
      weekDay = "Number is not in range of 0-6 weekdays...";
  }

  return weekDay;
};

export const parseDegDrctn = (deg) => {
  if (deg > 0 && deg < 49) return "NNE";
  if (deg === 50) return "NE";
  if (deg > 50 && deg < 89) return "ENE";
  if (deg === 90) return "E";
  if (deg > 90 && deg < 129) return "ESE";
  if (deg === 130) return "SE";
  if (deg > 130 && deg < 180) return "SSE";
  if (deg === 180) return "S";
  if (deg > 180 && deg < 230) return "SSW";
  if (deg === 230) return "SW";
  if (deg > 230 && deg < 270) return "WSW";
  if (deg === 270) return "W";
  if (deg > 270 && deg < 310) return "WNW";
  if (deg === 310) return "NW";
  if (deg > 310 && deg < 360) return "NNW";

  return "N";
};

export const convToHex = (num) => {
  if (num < 16) return "00";

  return num.toString(16);
};

export const clampRgbVal = (val, maxVal) => {
  if (val >= maxVal) return maxVal;
  if (val <= 0) return 0;

  return val;
};

export const crntTempIsCelsius = () => {
  const convertToCelsiusBtn = document.querySelector(
    "[data-slctr=convertToCBtn]"
  );

  const result = Boolean(convertToCelsiusBtn.dataset.isCelsius);

  return result;
};

export const crntTempIsFahrenheit = () => {
  const convertToFahrenheitBtn = document.querySelector(
    "[data-slctr=convertToFBtn]"
  );

  const result = Boolean(convertToFahrenheitBtn.dataset.isFahrenheit);

  return result;
};

export const getTempSymbol = (tempUnit) => {
  if (tempUnit === "metric") return "°C";
  return "°F";
};

export const convSpeedSymbol = (speedUnit) => {
  if (speedUnit === "metric") return "m/s";
  return "mph";
};
