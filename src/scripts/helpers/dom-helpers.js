import { crntTempIsCelsius, getLocalKey } from "./data-helpers";

export const ShowElemTemp = (elem) => {
  const showElem = () => {
    elem.classList.remove("elem-hide");
  };
  return showElem;
};
export const HideElemTemp = (elem) => {
  const hideElem = () => {
    elem.classList.add("elem-hide");
  };
  return hideElem;
};

export const delegateEvent = (parent, event, slctr, func) => {
  parent.addEventListener(event, (e) => {
    if (e.target.matches(slctr)) func(e);
  });
};

export const getSignalElem = (elem) => {
  const signalElem = elem.querySelector(".signal");
  return signalElem;
};

export const setMeasureSignal = () => {
  const convertToCelsiusBtn = document.querySelector(
    "[data-slctr=convertToCBtn]"
  );
  const convertToFahrenheitBtn = document.querySelector(
    "[data-slctr=convertToFBtn]"
  );

  if (getLocalKey("crntMeasureUnit") === "metric") {
    getSignalElem(convertToCelsiusBtn).classList.add("signal-isActivated");
    getSignalElem(convertToFahrenheitBtn).classList.remove(
      "signal-isActivated"
    );

    convertToCelsiusBtn.dataset.isCelsius = "true";
    convertToFahrenheitBtn.dataset.isFahrenheit = "";
    return;
  }

  getSignalElem(convertToCelsiusBtn).classList.remove("signal-isActivated");
  getSignalElem(convertToFahrenheitBtn).classList.add("signal-isActivated");

  convertToCelsiusBtn.dataset.isCelsius = "";
  convertToFahrenheitBtn.dataset.isFahrenheit = "true";
};

const toggleOverlay = () => {
  const overlay = document.querySelector("[data-slctr=overlay]");
  overlay.classList.toggle("elem-hide");
};

export const toggleAlertPanel = () => {
  toggleOverlay();
  const alertPanel = document.querySelector("[data-slctr=alertPanel]");
  alertPanel.classList.toggle("elem-hide");
};

export const displayErrorAlert = (err) => {
  const alertHeading = document.querySelector("[data-slctr=alertHeading]");
  const alertDetail = document.querySelector("[data-slctr=alertDetail]");

  toggleAlertPanel();
  alertHeading.textContent = err.name;
  alertDetail.textContent = err.stack;
};
