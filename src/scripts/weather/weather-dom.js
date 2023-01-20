import {
  getHours,
  getDay,
  isToday,
  differenceInHours,
  secondsToMilliseconds,
  toDate,
  format,
  parseISO,
  isBefore,
} from "date-fns";

import { getTimezoneNameByOffset } from "tzname";

import getWeatherIconPath from "./weather-icon";

import {
  Unit,
  Local,
  getWeekDayName,
  getDegreeDrctn,
  objHasProp,
} from "../helpers/data-helpers";
import { formatInTimeZone } from "date-fns-tz";
import { toDateWithOptions } from "date-fns-tz/fp";

const ForecastDataTemp = (weekDay, frcst) => {
  const frcstTempMax = Math.round(frcst.main.temp_max);
  const frcstTempMin = Math.round(frcst.main.temp_min);
  const frcstPrecipChance = Math.round(frcst.pop * 100);

  const frcstWeatherDesc = frcst.weather[0].description;

  const frcstHours = getHours(frcst.dt);
  const frcstWeatherIconPath = getWeatherIconPath(frcstWeatherDesc, frcstHours);

  const tempSymbol = Unit.getTempSymbol(Local.getValue("unit"));

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

const WeatherDom = (() => {
  const setTempLabels = (frcst) => {
    const mainTempLabel = document.querySelector("[data-slctr=mainTempLabel]");
    const maxTempLabel = document.querySelector("[data-slctr=maxTempLabel]");
    const minTempLabel = document.querySelector("[data-slctr=minTempLabel]");
    const feelsTempLabel = document.querySelector(
      "[data-slctr=feelsTempLabel]"
    );

    const tempSymbol = Unit.getTempSymbol(Local.getValue("unit"));

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

  const setMainWeather = (frcst) => {
    const mainWeather = document.querySelector("[data-slctr=mainWeather]");
    const forecastHours = getHours(frcst.dt);
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

    const windSpeed = Unit.isMetric()
      ? (frcst.wind.speed * 3600) / 1000
      : frcst.wind.speed;
    const speedSymbol = Unit.getVelocitySymbol(Local.getValue("unit"));

    rainVolLabel.textContent = `${
      objHasProp(frcst, "rain") ? frcst.rain["3h"] : 0
    } mm`;
    humidityLabel.textContent = `${frcst.main.humidity}%`;
    windSpeedLabel.textContent = `${Math.round(windSpeed)} ${speedSymbol}`;
    windDirLabel.textContent = `${getDegreeDrctn(frcst.wind.deg)}`;
  };

  const setSuntime = (city) => {
    const sunriseTimeLabel = document.querySelector(
      "[data-slctr=sunriseTimeLabel]"
    );
    const sunsetTimeLabel = document.querySelector(
      "[data-slctr=sunsetTimeLabel]"
    );

    const tzMsOffset = secondsToMilliseconds(city.timezone);
    const tzName = getTimezoneNameByOffset(tzMsOffset);

    const sunriseDate = toDate(secondsToMilliseconds(city.sunrise));
    const sunsetDate = toDate(secondsToMilliseconds(city.sunset));

    const sunriseTime = `${formatInTimeZone(
      sunriseDate,
      tzName,
      "p"
    ).toLowerCase()}`;
    const sunsetTime = `${formatInTimeZone(
      sunsetDate,
      tzName,
      "p"
    ).toLowerCase()}`;

    sunriseTimeLabel.textContent = sunriseTime;
    sunsetTimeLabel.textContent = sunsetTime;
  };

  const setTodaysWeather = (frcst, city) => {
    setTempLabels(frcst);
    setMainWeather(frcst);
    setWeatherLocation(city);
    setWeatherDetails(frcst);
    setSuntime(city);
  };

  const forecastDataWrapper = document.querySelector(
    "[data-slctr=forecastDataWrapper]"
  );

  const forecastToday = (data) => {
    forecastDataWrapper.innerHTML = "";

    const tzMsOffset = secondsToMilliseconds(data.city.timezone);
    const tzName = getTimezoneNameByOffset(tzMsOffset);
    const tzMsDate = parseInt(
      formatInTimeZone(data.list[0].dt_txt, tzName, "T"),
      10
    );

    let forecastNow;
    let tzIsDone = false;
    let isDone = false;

    data.list.forEach((forecast) => {
      if (isDone) return;

      const tzHour = getHours(tzMsDate);
      const forecastDate = parseISO(forecast.dt_txt);
      const forecastHour = getHours(forecastDate);

      const hourDifference = forecastHour - tzHour;

      if (isBefore(tzMsDate, forecastDate) && !tzIsDone) {
        tzIsDone = true;
        forecastNow = forecast;
        forecastNow.dt = tzMsDate;
        const weekDay = getWeekDayName(getDay(tzMsDate));
        const forecastData = ForecastDataTemp(weekDay, forecastNow);
        forecastDataWrapper.insertAdjacentHTML("beforeend", forecastData);
      } else if (isToday(forecastDate) && hourDifference < 3) {
        isDone = true;
        forecastNow = forecast;
        const weekDay = getWeekDayName(getDay(forecastDate));
        const forecastData = ForecastDataTemp(weekDay, forecastNow);
        forecastDataWrapper.insertAdjacentHTML("beforeend", forecastData);
      }
    });
    setTodaysWeather(forecastNow, data.city);
  };

  const forecastNextFourDays = (data) => {
    let weekDay;

    data.list.forEach((forecast) => {
      const forecastDate = parseISO(forecast.dt_txt);
      const forecastHours = getHours(forecastDate);
      weekDay = getWeekDayName(getDay(forecastDate));

      if (!isToday(forecastDate) && forecastHours === 9) {
        const forecastData = ForecastDataTemp(weekDay, forecast);
        forecastDataWrapper.insertAdjacentHTML("beforeend", forecastData);
      }
    });
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
})();

export default WeatherDom;
