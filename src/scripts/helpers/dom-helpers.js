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

export const Overlay = (() => {
  const overlay = document.querySelector("[data-slctr=overlay]");

  const show = () => {
    const showElem = ShowElemTemp(overlay);
    overlay.setAttribute("aria-hidden", "false");
    showElem();
  };
  const hide = () => {
    const hideElem = HideElemTemp(overlay);
    overlay.setAttribute("aria-hidden", "true");
    hideElem();
  };

  const toggle = () => {
    overlay.classList.toggle("elem-hide");
    const ariaHidden = overlay.getAttribute("aria-hidden");
    overlay.setAttribute(
      "aria-hidden",
      ariaHidden === "true" ? "false" : "true"
    );
  };

  const hideTargetElem = () => {
    const targetElems = [
      "[data-slctr=alertPanel]",
      "[data-slctr=weatherRadarPanel]",
    ];

    targetElems.forEach((slctr) => {
      const targetElem = document.querySelector(slctr);
      if (!targetElem.classList.contains("elem-hide")) {
        targetElem.classList.add("elem-hide");
        targetElem.setAttribute("aria-hidden", "true");
      }
    });

    hide();
  };

  overlay.addEventListener("click", hideTargetElem);

  return { show, hide, toggle };
})();

export const AlertPanel = (() => {
  const alertPanel = document.querySelector("[data-slctr=alertPanel]");

  const alertHeading = document.querySelector("[data-slctr=alertHeading]");
  const alertDetail = document.querySelector("[data-slctr=alertDetail]");

  const closeAlertBtn = document.querySelector("[data-slctr=closeAlertBtn]");

  const show = ShowElemTemp(alertPanel);
  const hide = HideElemTemp(alertPanel);

  const showError = (err) => {
    alertPanel.setAttribute("aria-hidden", "false");
    alertHeading.textContent = err.name;
    alertDetail.textContent = err.stack;
    show();
    Overlay.show();
  };

  const showCustomError = (err) => {
    alertPanel.setAttribute("aria-hidden", "false");
    alertHeading.textContent = err.name;
    alertDetail.textContent = err.message;
    show();
    Overlay.show();
  };

  closeAlertBtn.addEventListener("click", () => {
    hide();
    alertPanel.setAttribute("aria-hidden", "true");
    Overlay.hide();
  });

  return { showError, showCustomError };
})();

export const LoadingPanel = (() => {
  const loadingPanel = document.querySelector("[data-slctr=loadingPanel]");

  const show = () => {
    const showElem = ShowElemTemp(loadingPanel);
    setTimeout(() => loadingPanel.classList.remove("loadingPanel-hide"), 1);
    showElem();
    loadingPanel.setAttribute("aria-hidden", "false");
  };

  const hide = () => {
    const hideElem = HideElemTemp(loadingPanel);
    setTimeout(hideElem, 276);
    loadingPanel.classList.add("loadingPanel-hide");
    loadingPanel.setAttribute("aria-hidden", "true");
  };

  return { show, hide };
})();
