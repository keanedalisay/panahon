/* eslint-disable linebreak-style */

import { Local } from "./helpers/data-helpers";
import { AlertPanel, LoadingPanel } from "./helpers/dom-helpers";

import WeatherDom from "./weather/weather-dom";
import WeatherRadar from "./weather/weather-radar";

const Weather = (() => {
  const Geo = navigator.geolocation ? navigator.geolocation : false;

  const fetchWeatherData = (latitude, longitude, unit) => {
    LoadingPanel.show();
    return fetch(``)
      .then((data) => data.json())
      .catch((err) => {
        AlertPanel.showError(err);
      });
  };

  const fetchGeoData = (location) =>
    fetch(``, { mode: "cors" })
      .then((data) => data.json())
      .catch((err) => {
        AlertPanel.showError(err);
      });

  const getWeather = async (latitude, longitude) => {
    if (Local.hasKey("latitude") && Local.hasKey("longitude")) {
      Local.update("latitude", { latitude });
      Local.update("longitude", { longitude });
    } else {
      Local.create("latitude", latitude);
      Local.create("longitude", longitude);
      Local.create("unit", "metric");
    }

    try {
      const data = await fetchWeatherData(
        latitude,
        longitude,
        Local.getValue("unit")
      );

      WeatherRadar.flyTo([latitude, longitude], 8);
      WeatherDom.forecastToday(data);
      WeatherDom.forecastNextFourDays(data);
      WeatherDom.setLastUpdate();
      LoadingPanel.hide();
    } catch (err) {
      AlertPanel.showError(err);
      LoadingPanel.hide();
    }
  };

  const getLatAndLong = async (pos) => {
    Local.remove("geolocationError");

    const latitudePos = pos.coords.latitude;
    const longitudePos = pos.coords.longitude;

    getWeather(latitudePos, longitudePos);
  };

  const getLocation = async (location) => {
    let result;
    try {
      result = await fetchGeoData(location);
    } catch (err) {
      AlertPanel.showError(err);
      LoadingPanel.hide();
    }
    return result;
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
