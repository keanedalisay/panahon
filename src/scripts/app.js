import Anim from "./anim";
import Weather from "./weather";

import { elemIsNotHidden, storeToLocal, getLocalKey } from "./helpers";

import commonStyle from "../styles/common.scss";
import mainStyle from "../styles/style.scss";

const App = (() => {
  const overlay = document.querySelector("[data-slctr=overlay]");
  const alertPanel = document.querySelector("[data-slctr=alertPanel]");

  const closeAlertBtn = alertPanel.querySelector("[data-slctr=closeAlertBtn]");
  const alertHeading = alertPanel.querySelector("[data-slctr=alertHeading]");
  const alertDetail = alertPanel.querySelector("[data-slctr=alertDetail]");

  const toggleOverlay = () => {
    overlay.classList.toggle("elem-hide", elemIsNotHidden(overlay));
  };
  const toggleAlertPanel = () => {
    toggleOverlay();
    alertPanel.classList.toggle("elem-hide", elemIsNotHidden(alertPanel));
  };

  const rejectPositionCall = (error) => {
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

    Weather.getPosition(rejectPositionCall);
  };

  const init = () => {
    closeAlertBtn.addEventListener("click", () => {
      toggleAlertPanel();
    });

    overlay.addEventListener("click", () => {
      toggleAlertPanel();
    });
  };

  return { init, checkGeoLocAPI };
})();

Anim.init();

App.checkGeoLocAPI();
App.init();
