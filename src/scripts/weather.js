/* eslint-disable linebreak-style */
import {
  isToday,
  toDate,
  secondsToMilliseconds,
  getHours,
  differenceInHours,
  getDay,
  format,
  parseISO,
} from "date-fns";

import {
  createForecastData,
  deleteLocalKey,
  displayErrorAlert,
  getWeatherIconPath,
  parseDegDrctn,
  parseWeekDayName,
} from "./helpers";

const Weather = (() => {
  const forecastDataWrpr = document.querySelector(
    "[data-slctr=forecastDataWrapper]"
  );

  const Geo = navigator.geolocation ? navigator.geolocation : false;

  const setLastUpdate = () => {
    const lastUpdatedLabel = document.querySelector(
      "[data-slctr=lastUpdatedLabel]"
    );

    const timeNow = format(toDate(Date.now()), "p");
    lastUpdatedLabel.textContent = `Last updated ${timeNow.toLowerCase()}`;
  };

  const setTempLabels = (frcst) => {
    const mainTempLabel = document.querySelector("[data-slctr=mainTempLabel]");
    const maxTempLabel = document.querySelector("[data-slctr=maxTempLabel]");
    const minTempLabel = document.querySelector("[data-slctr=minTempLabel]");
    const feelsTempLabel = document.querySelector(
      "[data-slctr=feelsTempLabel]"
    );

    mainTempLabel.textContent = `${Math.floor(frcst.main.temp)}°C`;
    maxTempLabel.textContent = `${Math.floor(frcst.main.temp_max)}°C`;
    minTempLabel.textContent = `${Math.floor(frcst.main.temp_min)}°C`;
    feelsTempLabel.textContent = `${Math.floor(frcst.main.feels_like)}°C`;
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

    rainVolLabel.textContent = `${hasRainProp ? frcst.rain["3h"] : 0} mm`;
    humidityLabel.textContent = `${frcst.main.humidity}%`;
    windSpeedLabel.textContent = `${frcst.wind.speed} m/s`;
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
        const forecastData = createForecastData("Today", forecast, data);
        forecastDataWrpr.insertAdjacentHTML("beforeend", forecastData);
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
        const forecastData = createForecastData(weekDay, forecast, data);
        forecastDataWrpr.insertAdjacentHTML("beforeend", forecastData);
      }
    }
  };

  const getWeather = async (latitude, longitude, errorFunc) => {
    let targetData;
    let data;
    try {
      targetData = await fetch(``);

      data = await targetData.json();
    } catch (err) {
      errorFunc(err);
      return;
    }

    console.log(data);

    forecastDataWrpr.innerHTML = "";
    forecastToday(data);
    forecastNextFourDays(data);
    setLastUpdate();
  };

  const getLatAndLong = async (pos) => {
    deleteLocalKey("geoLocErr");

    const latPos = pos.coords.latitude;
    const longPos = pos.coords.longitude;

    getWeather(latPos, longPos, displayErrorAlert);
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

  const obj = {
    getPosition,
    getWeather,
    getLocation,
    Geo,
  };

  return obj;
})();

export default Weather;
