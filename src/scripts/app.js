import Anim from "./anim";

import commonStyle from "../styles/common.scss";
import mainStyle from "../styles/style.scss";

const App = (() => {
  const overlay = document.querySelector("[data-slctr=overlay]");
  const closeAlertBtn = document.querySelector("[data-slctr=closeAlertBtn]");

  const toggleOverlay = () => {
    overlay.classList.toggle("elem-hide");
  };
  const toggleAlertPanel = () => {
    const alertPanel = document.querySelector("[data-slctr=alertPanel]");
    alertPanel.classList.toggle("elem-hide");
  };

  const init = () => {
    Anim.init();

    closeAlertBtn.addEventListener("click", () => {
      toggleOverlay();
      toggleAlertPanel();
    });

    overlay.addEventListener("click", () => {
      toggleOverlay();
      toggleAlertPanel();
    });
  };

  return { init };
})();

App.init();
