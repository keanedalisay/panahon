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

import { displayErrorAlert } from "../helpers/dom-helpers";

import {
  parseDegDrctn,
  parseWeekDayName,
  deleteLocalKey,
  storeToLocal,
  getLocalKey,
  getTempSymbol,
  convSpeedSymbol,
} from "../helpers/data-helpers";

import Radar from "./weather-radar";
import getWeatherIconPath from "./weather-icon";

const ForecastDataTemp = (weekDay, frcst) => {
  const frcstPrecipChance = Math.round(frcst.pop * 100);
  const frcstTempMax = Math.round(frcst.main.temp_max);
  const frcstTempMin = Math.round(frcst.main.temp_min);
  const frcstWeatherDesc = frcst.weather[0].description;

  const frcstHours = getHours(parseISO(frcst.dt_txt));
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
  const forecastDataWrapper = document.querySelector(
    "[data-slctr=forecastDataWrapper]"
  );

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
        const forecastData = ForecastDataTemp("Today", forecast);
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
        const forecastData = ForecastDataTemp(weekDay, forecast);
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

    Radar.flyTo([latitude, longitude], 8);
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
