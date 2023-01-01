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
  getWeatherIconPath,
  parseDegDrctn,
  parseWeekDayName,
} from "./helpers";

const Weather = (() => {
  const Geo = navigator.geolocation ? navigator.geolocation : false;

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

    const sunriseTime = `${format(sunriseDate, "p").replace("AM", "am")}`;
    const sunsetTime = `${format(sunsetDate, "p").replace("PM", "pm")}`;

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

  const retrieveData = async (latitude, longitude) => {
    const targetData = await fetch(``);
    return targetData.json();
  };

  const forecastToday = (data) => {
    const forecastDataWrpr = document.querySelector(
      "[data-slctr=forecastDataWrapper]"
    );
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

    console.log(data);
    console.log(frcstToday);

    setTodaysWeather(frcstToday, data.city);
  };

  const forecastNextFourDays = (data) => {
    const forecastDataWrpr = document.querySelector(
      "[data-slctr=forecastDataWrapper]"
    );

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

  const getLatAndLong = async (pos) => {
    deleteLocalKey("geoLocErr");

    const latPos = pos.coords.latitude;
    const longPos = pos.coords.longitude;

    const data = await retrieveData(latPos, longPos);

    forecastToday(data);
    forecastNextFourDays(data);
  };

  const getPosition = (rejectCall) => {
    Geo.getCurrentPosition(getLatAndLong, rejectCall, { timeout: 10000 });
  };

  const obj = {
    getPosition,
    retrieveData,
    Geo,
  };

  return obj;
})();

export default Weather;
