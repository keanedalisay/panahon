/* eslint-disable linebreak-style */

import commonStyle from "../styles/common.scss";
import mainStyle from "../styles/style.scss";

import Anim from "./anim";
import Weather from "./weather";

import {
  getCountryName,
  Local,
  objHasProp,
  Unit,
} from "./helpers/data-helpers";
import { delegateEvent, AlertPanel } from "./helpers/dom-helpers";

const Settings = (() => {
  const settingsBtn = document.querySelector("[data-slctr=settingsBtn]");
  const settingsDrpdwn = document.querySelector("[data-slctr=settingsDrpdwn]");

  const convertToCelsiusBtn = document.querySelector(
    "[data-slctr=convertToCBtn]"
  );
  const convertToFahrenheitBtn = document.querySelector(
    "[data-slctr=convertToFBtn]"
  );

  const celsiusSignal = convertToCelsiusBtn.querySelector(".signal");
  const fahrenheitSignal = convertToFahrenheitBtn.querySelector(".signal");

  const toggleDropdown = () => settingsDrpdwn.classList.toggle("elem-hide");

  const convertToCelsius = () => {
    if (Unit.isMetric()) return;

    Local.update("unit", { unit: "metric" });

    celsiusSignal.classList.add("signal-isActivated");
    fahrenheitSignal.classList.remove("signal-isActivated");

    const lattitude = Local.getValue("latitude") || 0;
    const longitude = Local.getValue("longitude") || 0;

    Weather.getWeather(lattitude, longitude);
  };

  const convertToFahrenheit = () => {
    if (!Unit.isMetric()) return;

    Local.update("unit", { unit: "imperial" });

    celsiusSignal.classList.remove("signal-isActivated");
    fahrenheitSignal.classList.add("signal-isActivated");

    const latitude = Local.getValue("latitude") || 0;
    const longitude = Local.getValue("longitude") || 0;

    Weather.getWeather(latitude, longitude);
  };

  const init = () => {
    settingsBtn.addEventListener("click", toggleDropdown);
    convertToCelsiusBtn.addEventListener("click", convertToCelsius);
    convertToFahrenheitBtn.addEventListener("click", convertToFahrenheit);

    if (!Unit.isMetric()) {
      celsiusSignal.classList.remove("signal-isActivated");
      fahrenheitSignal.classList.add("signal-isActivated");
    }
  };

  return { init };
})();

const LocationAutocmplt = (() => {
  const weatherLocInput = document.querySelector(
    "[data-slctr=weatherLocInput]"
  );
  const weatherLocAutocmplt = document.querySelector(
    "[data-slctr=weatherLocAutocmplt]"
  );

  const show = () => {
    weatherLocAutocmplt.innerHTML = "";
    weatherLocInput.classList.add("widgetPanel-weatherLocInput-autocmpltOn");
    weatherLocAutocmplt.classList.remove("elem-hide");
  };
  const hide = () => {
    weatherLocAutocmplt.innerHTML = "";
    weatherLocInput.classList.remove("widgetPanel-weatherLocInput-autocmpltOn");
    weatherLocAutocmplt.classList.add("elem-hide");
  };

  const autocmpltVal = (name, coords) => {
    const locAutocmpltValue = `<button class="autocmplt-value" 
          data-lat="${coords.lat}" data-long="${coords.lon}">
          ${name}</button>`;
    weatherLocAutocmplt.insertAdjacentHTML("beforeend", locAutocmpltValue);
  };

  const autocmpltAlert = () => {
    const locNotFound = `<div class="autocmplt-alert">
      <p>Location not found.</p>
  </div>`;
    weatherLocAutocmplt.insertAdjacentHTML("beforeend", locNotFound);
  };

  const autocmpltValWeather = (e) => {
    const targetAutocmpltVal = e.target;
    const latitude = targetAutocmpltVal.dataset.lat;
    const longitude = targetAutocmpltVal.dataset.long;

    LocationAutocmplt.hide();
    Weather.getWeather(latitude, longitude);
  };

  const weatherLocation = async (e) => {
    if (!e.target.value || e.key !== "Enter") return;

    const locationInput = e.target.value;
    const locations = await Weather.getLocation(locationInput);

    if (locations.length === 0) {
      LocationAutocmplt.show();
      LocationAutocmplt.add.autocmpltAlert();
      return;
    }
    if (locations.length === 1) {
      const firstLatitude = locations[0].lat;
      const firstLongitude = locations[0].lon;

      LocationAutocmplt.hide();
      Weather.getWeather(firstLatitude, firstLongitude);
      return;
    }

    LocationAutocmplt.show();
    locations.forEach((location) => {
      let locationName = `${location.name}, ${getCountryName(
        location.country
      )}`;
      if (objHasProp(location, "state")) locationName += `, ${location.state}`;

      LocationAutocmplt.add.autocmpltVal(locationName, location);
    });
  };

  const add = { autocmpltVal, autocmpltAlert };

  const init = () => {
    weatherLocInput.addEventListener("keyup", weatherLocation);
    weatherLocInput.addEventListener("input", hide);

    delegateEvent(
      weatherLocAutocmplt,
      "click",
      ".autocmplt-value",
      autocmpltValWeather
    );
  };

  return { show, hide, add, init };
})();

const App = (() => {
  const showPositionError = (error) => {
    if (Local.hasKey("geolocationError")) {
      Weather.getWeather(
        Local.getValue("latitude") || 0,
        Local.getValue("longitude") || 0,
        Local.getValue("unit") || "metric"
      );
      return;
    }

    const positionError = { code: error.code, message: error.message };
    Local.create("geolocationError", JSON.stringify(positionError));

    const err = {
      message: "To retrieve weather data, use the search bar instead",
    };

    switch (error.code) {
      case 2:
        err.name = "Geolocation API is unable to access your location...";
        break;
      case 3:
        err.name = "Geolocation API took too long to respond...";
        break;
      default:
        err.name = "Call to retrieve your location has been rejected...";
        break;
    }

    AlertPanel.showCustomError(err);
  };

  const checkGeolocationAPI = () => {
    if (!Weather.Geo) {
      const err = {
        name: "Geolocation API is not supported in your browser version...",
        message: "Use the search bar instead to retrieve weather data.",
      };
      AlertPanel.showCustomError(err);
      return;
    }
    Weather.getPosition(showPositionError);
  };

  const init = () => {
    LocationAutocmplt.init();
    Settings.init();
    checkGeolocationAPI();
    Anim.init();

    window.addEventListener("unhandledrejection", (e) =>
      AlertPanel.showError(e.reason)
    );
  };

  return { init };
})();

App.init();
