import getHours from "date-fns/getHours";
import parseISO from "date-fns/parseISO";

import clearDayIcon from "../assets/svgs/clear-sky-day-icon.svg";
import clearNightIcon from "../assets/svgs/clear-sky-night-icon.svg";

import fewCloudsDayIcon from "../assets/svgs/few-clouds-day-icon.svg";
import fewCloudsNightIcon from "../assets/svgs/few-clouds-night-icon.svg";

import scatteredCloudsIcon from "../assets/svgs/scattered-clouds-icon.svg";
import brokenCloudsIcon from "../assets/svgs/broken-clouds-icon.svg";

import showerRainDayIcon from "../assets/svgs/shower-rain-day-icon.svg";
import showerRainNightIcon from "../assets/svgs/shower-rain-night-icon.svg";

import rainIcon from "../assets/svgs/rain-icon.svg";
import snowIcon from "../assets/svgs/snow-icon.svg";

import thunderstormIcon from "../assets/svgs/thunderstorm-icon.svg";
import windCloudIcon from "../assets/svgs/wind-cloud-icon.svg";

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

export const getWeatherIconPath = (string, hours) => {
  let iconPath;

  if (/clear sky/i.test(string)) {
    iconPath = hours > 17 ? clearNightIcon : clearDayIcon;
  } else if (
    /mist/i.test(string) ||
    /fog/i.test(string) ||
    /smoke/i.test(string) ||
    /haze/i.test(string) ||
    /sand/i.test(string) ||
    /dust/i.test(string) ||
    /ash/i.test(string) ||
    /squall/i.test(string) ||
    /tornado/i.test(string)
  ) {
    iconPath = windCloudIcon;
  } else if (/few clouds/i.test(string)) {
    iconPath = hours > 17 ? fewCloudsNightIcon : fewCloudsDayIcon;
  } else if (/scattered clouds/i.test(string)) iconPath = scatteredCloudsIcon;
  else if (/broken clouds/i.test(string) || /overcast clouds/i.test(string)) {
    iconPath = brokenCloudsIcon;
  } else if (/thunderstorm/i.test(string)) iconPath = thunderstormIcon;
  else if (/snow/i.test(string) || /sleet/.test(string)) iconPath = snowIcon;
  else if (/shower rain/i.test(string) || /drizzle/.test(string)) {
    iconPath = hours > 17 ? showerRainNightIcon : showerRainDayIcon;
  } else if (/rain/i.test(string)) iconPath = rainIcon;

  return iconPath;
};

export const createForecastData = (weekDay, frcst, data) => {
  const frcstPrecipChance = Math.round(frcst.pop * 100);
  const frcstTempMax = Math.round(frcst.main.temp_max);
  const frcstTempMin = Math.round(frcst.main.temp_min);
  const frcstWeatherDesc = frcst.weather[0].description;

  const frcstHours = getHours(parseISO(data.dt_txt));
  const frcstWeatherIconPath = getWeatherIconPath(frcstWeatherDesc, frcstHours);

  const frcstData = `<div class="forecastData">
  <div class="forecastData-day">
      <span><strong>${weekDay}</strong></span>
  </div>
  <object class="forecastData-weather" aria-label="${frcstWeatherDesc}"
      data="${frcstWeatherIconPath}" type="text/svg+xml" tabindex="-1">
      Weather for ${weekDay} is ${frcstWeatherDesc}</object>
  <div class="forecastData-precipitation">
      <span>${frcstPrecipChance}%</span>
  </div>
  <div class="forecastData-maxMinTemp">
      <span>${frcstTempMax}°C / ${frcstTempMin}°C</span>
  </div>
</div>`;

  return frcstData;
};
