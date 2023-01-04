/* eslint-disable linebreak-style */
import Anim from "./anim";
import Weather from "./weather";

import {
  delegateEvent,
  storeToLocal,
  getLocalKey,
  getCountryName,
  toggleAlertPanel,
  alertHeading,
  alertDetail,
  displayErrorAlert,
} from "./helpers";

import commonStyle from "../styles/common.scss";
import mainStyle from "../styles/style.scss";

const App = (() => {
  const overlay = document.querySelector("[data-slctr=overlay]");
  const closeAlertBtn = document.querySelector("[data-slctr=closeAlertBtn]");

  const weatherLocInput = document.querySelector(
    "[data-slctr=weatherLocInput]"
  );
  const weatherLocAutocmplt = document.querySelector(
    "[data-slctr=weatherLocAutocmplt]"
  );

  const displayLocAutocmplt = () => {
    weatherLocAutocmplt.innerHTML = "";
    weatherLocInput.classList.add("widgetPanel-weatherLocInput-autocmpltOn");
    weatherLocAutocmplt.classList.remove("elem-hide");
  };
  const hideLocAutocmplt = () => {
    weatherLocAutocmplt.innerHTML = "";
    weatherLocInput.classList.remove("widgetPanel-weatherLocInput-autocmpltOn");
    weatherLocAutocmplt.classList.add("elem-hide");
  };

  const addLocAutocmpltVal = (name, coords) => {
    const locAutocmpltValue = `<button class="autocmplt-value" 
    data-loclat="${coords.lat}" data-loclong="${coords.lon}">
    ${name}</button>`;
    weatherLocAutocmplt.insertAdjacentHTML("beforeend", locAutocmpltValue);
  };
  const addLocNotFound = () => {
    const locNotFound = `<div class="autocmplt-alert">
    <p>Location not found.</p>
</div>`;
    weatherLocAutocmplt.insertAdjacentHTML("beforeend", locNotFound);
  };

  const searchWeatherLocation = async (e) => {
    if (!e.target.value || e.key !== "Enter") return;

    const loc = weatherLocInput.value;
    const locations = await Weather.getLocation(loc, displayErrorAlert);

    const locationErr = Object.prototype.hasOwnProperty.call(locations, "cod");
    if (locationErr) {
      toggleAlertPanel();
      alertHeading.textContent = locations.cod;
      alertDetail.textContent = locations.message;

      return;
    }

    if (locations.length === 0) {
      displayLocAutocmplt();
      addLocNotFound();
      return;
    }
    if (locations.length === 1) {
      const fstLocLat = locations[0].lat;
      const fstLocLong = locations[0].lon;

      hideLocAutocmplt();
      Weather.getWeather(fstLocLat, fstLocLong);
      return;
    }

    displayLocAutocmplt();
    locations.forEach((location) => {
      let locationName = `${location.name}, ${getCountryName(
        location.country
      )}`;

      const hasStateProp = Object.prototype.hasOwnProperty.call(
        location,
        "state"
      );
      if (hasStateProp) locationName += `, ${location.state}`;

      addLocAutocmpltVal(locationName, location);
    });
  };

  const getLocValLatAndLong = (e) => {
    const locAutocmpltVal = e.target;
    const locLat = locAutocmpltVal.dataset.loclat;
    const locLong = locAutocmpltVal.dataset.loclong;

    hideLocAutocmplt();

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
    weatherLocInput.addEventListener("input", hideLocAutocmplt);
    delegateEvent(
      weatherLocAutocmplt,
      "click",
      ".autocmplt-value",
      getLocValLatAndLong
    );
  };

  return { init, checkGeoLocAPI };
})();

Anim.init();

App.checkGeoLocAPI();
App.init();
