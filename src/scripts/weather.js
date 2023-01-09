/* eslint-disable linebreak-style */
import {
  format,
  parseISO,
  getHours,
  getDay,
  isToday,
  toDate,
  secondsToMilliseconds,
  differenceInHours,
} from "date-fns";

import { displayErrorAlert } from "./helpers/dom-helpers";

import {
  parseDegDrctn,
  parseWeekDayName,
  deleteLocalKey,
  storeToLocal,
  getLocalKey,
  getTempSymbol,
  convSpeedSymbol,
} from "./helpers/data-helpers";

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

const ForecastDataTemp = (weekDay, frcst, data) => {
  const frcstPrecipChance = Math.round(frcst.pop * 100);
  const frcstTempMax = Math.round(frcst.main.temp_max);
  const frcstTempMin = Math.round(frcst.main.temp_min);
  const frcstWeatherDesc = frcst.weather[0].description;

  const frcstHours = getHours(parseISO(data.dt_txt));
  const frcstWeatherIconPath = getWeatherIconPath(frcstWeatherDesc, frcstHours);

  const tempSymbol = getTempSymbol(getLocalKey("crntMeasureUnit"));

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
        <span>${frcstTempMax}${tempSymbol} / ${frcstTempMin}${tempSymbol}</span>
    </div>
  </div>`;

  return frcstData;
};

const WeatherDOMTemp = () => {
  const setTempLabels = (frcst) => {
    const mainTempLabel = document.querySelector("[data-slctr=mainTempLabel]");
    const maxTempLabel = document.querySelector("[data-slctr=maxTempLabel]");
    const minTempLabel = document.querySelector("[data-slctr=minTempLabel]");
    const feelsTempLabel = document.querySelector(
      "[data-slctr=feelsTempLabel]"
    );

    const tempSymbol = getTempSymbol(getLocalKey("crntMeasureUnit"));

    mainTempLabel.textContent = `${Math.floor(frcst.main.temp)}${tempSymbol}`;

    maxTempLabel.textContent = `${Math.floor(
      frcst.main.temp_max
    )}${tempSymbol}`;

    minTempLabel.textContent = `${Math.floor(
      frcst.main.temp_min
    )}${tempSymbol}`;

    feelsTempLabel.textContent = `${Math.floor(
      frcst.main.feels_like
    )}${tempSymbol}`;
  };

  const setWeather = (frcst) => {
    const mainWeather = document.querySelector("[data-slctr=mainWeather]");
    const forecastHours = getHours(parseISO(frcst.dt_txt));
    const mainWeatherIconPath = getWeatherIconPath(
      frcst.weather[0].description,
      forecastHours
    );

    mainWeather.setAttribute("data", mainWeatherIconPath);
    mainWeather.setAttribute("aria-label", frcst.weather[0].description);
  };

  const setWeatherLocation = (city) => {
    const weatherLocLabel = document.querySelector(
      "[data-slctr=weatherLocLabel]"
    );
    weatherLocLabel.textContent = `${city.name}, ${city.country}`;
  };

  const setWeatherDetails = (frcst) => {
    const rainVolLabel = document.querySelector("[data-slctr=rainVolLabel]");
    const humidityLabel = document.querySelector("[data-slctr=humidityLabel]");
    const windSpeedLabel = document.querySelector(
      "[data-slctr=windSpeedLabel]"
    );
    const windDirLabel = document.querySelector("[data-slctr=windDirLabel]");

    const hasRainProp = Object.prototype.hasOwnProperty.call(frcst, "rain");
    const speedSymbol = convSpeedSymbol(getLocalKey("crntMeasureUnit"));

    rainVolLabel.textContent = `${hasRainProp ? frcst.rain["3h"] : 0} mm`;
    humidityLabel.textContent = `${frcst.main.humidity}%`;
    windSpeedLabel.textContent = `${frcst.wind.speed} ${speedSymbol}`;
    windDirLabel.textContent = `${parseDegDrctn(frcst.wind.deg)}`;
  };

  const setSuntime = (city) => {
    const sunriseTimeLabel = document.querySelector(
      "[data-slctr=sunriseTimeLabel]"
    );
    const sunsetTimeLabel = document.querySelector(
      "[data-slctr=sunsetTimeLabel]"
    );

    const sunriseDate = toDate(secondsToMilliseconds(city.sunrise));
    const sunsetDate = toDate(secondsToMilliseconds(city.sunset));

    const sunriseTime = `${format(sunriseDate, "p").toLowerCase()}`;
    const sunsetTime = `${format(sunsetDate, "p").toLowerCase()}`;

    sunriseTimeLabel.textContent = sunriseTime;
    sunsetTimeLabel.textContent = sunsetTime;
  };

  const setTodaysWeather = (frcst, city) => {
    setTempLabels(frcst);
    setWeather(frcst);
    setWeatherLocation(city);
    setWeatherDetails(frcst);
    setSuntime(city);
  };

  const forecastDataWrapper = document.querySelector(
    "[data-slctr=forecastDataWrapper]"
  );

  const forecastToday = (data) => {
    forecastDataWrapper.innerHTML = "";

    let frcstToday;

    for (let i = 0; i < data.list.length; i += 1) {
      const forecast = data.list[i];
      const forecastTime = parseISO(forecast.dt_txt);

      const timeNow = toDate(Date.now());
      if (
        isToday(forecastTime) &&
        differenceInHours(timeNow, forecastTime) < 3
      ) {
        frcstToday = forecast;
        const forecastData = ForecastDataTemp("Today", forecast, data);
        forecastDataWrapper.insertAdjacentHTML("beforeend", forecastData);
        break;
      }
    }

    setTodaysWeather(frcstToday, data.city);
  };

  const forecastNextFourDays = (data) => {
    let weekDay;

    for (let i = 0; i < data.list.length; i += 1) {
      const forecast = data.list[i];
      const timeNow = toDate(Date.now());
      const forecastTime = parseISO(forecast.dt_txt);

      const hourDifference = getHours(timeNow) - getHours(forecastTime);
      weekDay = parseWeekDayName(getDay(forecastTime));

      if (!isToday(forecastTime) && hourDifference <= 3 && hourDifference > 0) {
        const forecastData = ForecastDataTemp(weekDay, forecast, data);
        forecastDataWrapper.insertAdjacentHTML("beforeend", forecastData);
      }
    }
  };

  const setLastUpdate = () => {
    const lastUpdatedLabel = document.querySelector(
      "[data-slctr=lastUpdatedLabel]"
    );

    const timeNow = format(toDate(Date.now()), "p");
    lastUpdatedLabel.textContent = `Last updated ${timeNow.toLowerCase()}`;
  };

  return {
    forecastToday,
    forecastNextFourDays,
    setLastUpdate,
  };
};

const Weather = (() => {
  const DOM = WeatherDOMTemp();
  const Geo = navigator.geolocation ? navigator.geolocation : false;

  const getWeather = async (latitude, longitude, errorFunc, unit) => {
    storeToLocal("crntLat", latitude);
    storeToLocal("crntLong", longitude);
    storeToLocal("crntMeasureUnit", unit);

    let targetData;
    let data;
    try {
      targetData = await fetch(``);

      data = await targetData.json();
    } catch (err) {
      errorFunc(err);
      return;
    }

    DOM.forecastToday(data);
    DOM.forecastNextFourDays(data);
    DOM.setLastUpdate();
  };

  const getLatAndLong = async (pos) => {
    deleteLocalKey("geoLocErr");

    const latPos = pos.coords.latitude;
    const longPos = pos.coords.longitude;

    getWeather(
      latPos,
      longPos,
      displayErrorAlert,
      getLocalKey("crntMeasureUnit")
    );
  };

  const getLocation = async (input, errorFunc) => {
    let locations;
    try {
      locations = await fetch(``, { mode: "cors" });
      return locations.json();
    } catch (err) {
      errorFunc(err);
    }
  };

  const getPosition = (errorFunc) => {
    Geo.getCurrentPosition(getLatAndLong, errorFunc, { timeout: 10000 });
  };

  return {
    getPosition,
    getWeather,
    getLocation,
    Geo,
  };
})();

export default Weather;
