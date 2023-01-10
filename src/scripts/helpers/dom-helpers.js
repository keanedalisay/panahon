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
