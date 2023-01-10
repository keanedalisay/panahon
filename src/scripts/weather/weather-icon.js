import clearDayIcon from "../../assets/svgs/clear-sky-day-icon.svg";
import clearNightIcon from "../../assets/svgs/clear-sky-night-icon.svg";

import fewCloudsDayIcon from "../../assets/svgs/few-clouds-day-icon.svg";
import fewCloudsNightIcon from "../../assets/svgs/few-clouds-night-icon.svg";

import scatteredCloudsIcon from "../../assets/svgs/scattered-clouds-icon.svg";
import brokenCloudsIcon from "../../assets/svgs/broken-clouds-icon.svg";

import showerRainDayIcon from "../../assets/svgs/shower-rain-day-icon.svg";
import showerRainNightIcon from "../../assets/svgs/shower-rain-night-icon.svg";

import rainIcon from "../../assets/svgs/rain-icon.svg";
import snowIcon from "../../assets/svgs/snow-icon.svg";

import thunderstormIcon from "../../assets/svgs/thunderstorm-icon.svg";
import windCloudIcon from "../../assets/svgs/wind-cloud-icon.svg";

const getWeatherIconPath = (string, hours) => {
  let iconPath = "";

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

export default getWeatherIconPath;
