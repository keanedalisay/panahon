import Anim from "./anim";
import Weather from "./weather";

import {
  delegateEvent,
  elemIsNotHidden,
  storeToLocal,
  getLocalKey,
  getCountryName,
} from "./helpers";

import commonStyle from "../styles/common.scss";
import mainStyle from "../styles/style.scss";

const App = (() => {
  const overlay = document.querySelector("[data-slctr=overlay]");
  const alertPanel = document.querySelector("[data-slctr=alertPanel]");

  const closeAlertBtn = alertPanel.querySelector("[data-slctr=closeAlertBtn]");
  const alertHeading = alertPanel.querySelector("[data-slctr=alertHeading]");
  const alertDetail = alertPanel.querySelector("[data-slctr=alertDetail]");

  const weatherLocInput = document.querySelector(
    "[data-slctr=weatherLocInput]"
  );
  const weatherLocAutocmplt = document.querySelector(
    "[data-slctr=weatherLocAutocmplt]"
  );

  const toggleOverlay = () => {
    overlay.classList.toggle("elem-hide", elemIsNotHidden(overlay));
  };
  const toggleAlertPanel = () => {
    toggleOverlay();
    alertPanel.classList.toggle("elem-hide", elemIsNotHidden(alertPanel));
  };

  const displayLocAutocmplt = () => {
    weatherLocInput.classList.add("widgetPanel-weatherLocInput-autocmpltOn");
    weatherLocAutocmplt.classList.remove("elem-hide");
  };
  const hideLocAutocmplt = () => {
    weatherLocInput.classList.remove("widgetPanel-weatherLocInput-autocmpltOn");
    weatherLocAutocmplt.classList.add("elem-hide");
  };

  const addLocAutocmpltVal = (name, coords) => {
    const locAutocmpltValue = `<button class="autocmplt-value" 
    data-loclat="${coords.lat}" data-loclong="${coords.lon}">
    ${name}</button>`;
    weatherLocAutocmplt.insertAdjacentHTML("beforeend", locAutocmpltValue);
  };

  const getLocValLatAndLong = (e) => {
    const locAutocmpltVal = e.target;
    const locLat = locAutocmpltVal.dataset.loclat;
    const locLong = locAutocmpltVal.dataset.loclong;

    weatherLocAutocmplt.innerHTML = "";
    hideLocAutocmplt();

    Weather.getWeather(locLat, locLong);
  };

  const searchWeatherLocation = async (e) => {
    if (e.key !== "Enter") return;

    const loc = weatherLocInput.value;
    const locations = await Weather.getLocation(loc);

    console.log(locations);
    if (locations.length === 0) return;
    if (locations.length === 1) {
      const fstLocLat = locations[0].lat;
      const fstLocLong = locations[0].lon;

      Weather.getWeather(fstLocLat, fstLocLong);
      return;
    }

    weatherLocAutocmplt.innerHTML = "";
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
    displayLocAutocmplt();
  };

  const rejectPosition = (error) => {
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

    Weather.getPosition(rejectPosition);
  };

  const init = () => {
    closeAlertBtn.addEventListener("click", () => {
      toggleAlertPanel();
    });

    overlay.addEventListener("click", () => {
      toggleAlertPanel();
    });

    weatherLocInput.addEventListener("keyup", searchWeatherLocation);
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
