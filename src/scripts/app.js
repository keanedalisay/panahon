/* eslint-disable linebreak-style */

import Anim from "./anim";
import Weather from "./weather";

import {
  delegateEvent,
  toggleAlertPanel,
  displayErrorAlert,
  ShowElemTemp,
  HideElemTemp,
} from "./helpers/dom-helpers";

import {
  storeToLocal,
  getLocalKey,
  getCountryName,
} from "./helpers/data-helpers";

import commonStyle from "../styles/common.scss";
import mainStyle from "../styles/style.scss";

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
          data-loclat="${coords.lat}" data-loclong="${coords.lon}">
          ${name}</button>`;
    weatherLocAutocmplt.insertAdjacentHTML("beforeend", locAutocmpltValue);
  };

  const autocmpltAlert = () => {
    const locNotFound = `<div class="autocmplt-alert">
      <p>Location not found.</p>
  </div>`;
    weatherLocAutocmplt.insertAdjacentHTML("beforeend", locNotFound);
  };

  const add = { autocmpltVal, autocmpltAlert };

  return { show, hide, add };
})();

const Settings = (() => {
  const settingsBtn = document.querySelector("[data-slctr=settingsBtn]");
  const settingsDrpdwn = document.querySelector("[data-slctr=settingsDrpdwn]");
  const closeSettingsBtn = document.querySelector(
    "[data-slctr=closeSettingsDrpdwnBtn]"
  );

  const showDropdown = ShowElemTemp(settingsDrpdwn);
  const hideDropdown = HideElemTemp(settingsDrpdwn);

  const init = () => {
    settingsBtn.addEventListener("click", showDropdown);
    closeSettingsBtn.addEventListener("click", hideDropdown);
  };

  return { init, showDropdown, hideDropdown };
})();

const App = (() => {
  const overlay = document.querySelector("[data-slctr=overlay]");

  const alertHeading = document.querySelector("[data-slctr=alertHeading]");
  const alertDetail = document.querySelector("[data-slctr=alertDetail]");
  const closeAlertBtn = document.querySelector("[data-slctr=closeAlertBtn]");

  const weatherLocInput = document.querySelector(
    "[data-slctr=weatherLocInput]"
  );
  const weatherLocAutocmplt = document.querySelector(
    "[data-slctr=weatherLocAutocmplt]"
  );

  const searchWeatherLocation = async (e) => {
    if (!e.target.value || e.key !== "Enter") return;

    const locationInput = e.target.value;
    const locations = await Weather.getLocation(
      locationInput,
      displayErrorAlert
    );

    const locationErr = Object.prototype.hasOwnProperty.call(locations, "cod");
    if (locationErr) {
      toggleAlertPanel();
      alertHeading.textContent = locations.cod;
      alertDetail.textContent = locations.message;

      return;
    }

    if (locations.length === 0) {
      LocationAutocmplt.show();
      LocationAutocmplt.add.autocmpltAlert();
      return;
    }
    if (locations.length === 1) {
      const fstLocLat = locations[0].lat;
      const fstLocLong = locations[0].lon;

      LocationAutocmplt.hide();
      Weather.getWeather(fstLocLat, fstLocLong);
      return;
    }

    LocationAutocmplt.show();
    locations.forEach((location) => {
      let locationName = `${location.name}, ${getCountryName(
        location.country
      )}`;

      const hasStateProp = Object.prototype.hasOwnProperty.call(
        location,
        "state"
      );
      if (hasStateProp) locationName += `, ${location.state}`;

      LocationAutocmplt.add.autocmpltVal(locationName, location);
    });
  };

  const getLocValLatAndLong = (e) => {
    const locAutocmpltVal = e.target;
    const locLat = locAutocmpltVal.dataset.loclat;
    const locLong = locAutocmpltVal.dataset.loclong;

    LocationAutocmplt.hide();

    Weather.getWeather(locLat, locLong, displayErrorAlert);
  };

  const displayPositionError = (error) => {
    if (getLocalKey("geoLocErr")) return;

    const positionError = { code: error.code, message: error.message };
    storeToLocal("geoLocErr", JSON.stringify(positionError));

    switch (error.code) {
      case 2:
        alertHeading.textContent =
          "Geolocation API is unable to access your location...";
        break;
      case 3:
        alertHeading.textContent =
          "Geolocation API took too long to respond...";
        break;
      default:
        alertHeading.textContent =
          "Call to retrieve your location has been rejected...";
        break;
    }

    alertDetail.textContent =
      "To retrieve weather data, use the search bar instead.";
    toggleAlertPanel();
  };

  const checkGeoLocAPI = () => {
    if (!Weather.Geo) {
      alertHeading.textContent =
        "Geolocation API is not supported in your browser version...";
      alertDetail.textContent =
        "Use the search bar instead to retrieve weather data.";

      toggleAlertPanel();
      return;
    }

    Weather.getPosition(displayPositionError);
  };

  const init = () => {
    closeAlertBtn.addEventListener("click", () => {
      toggleAlertPanel();
    });

    overlay.addEventListener("click", () => {
      toggleAlertPanel();
    });

    weatherLocInput.addEventListener("keyup", searchWeatherLocation);
    weatherLocInput.addEventListener("input", LocationAutocmplt.hide);
    delegateEvent(
      weatherLocAutocmplt,
      "click",
      ".autocmplt-value",
      getLocValLatAndLong
    );

    Anim.init();
    Settings.init();
    App.checkGeoLocAPI();
  };

  return { init, checkGeoLocAPI };
})();

App.init();
