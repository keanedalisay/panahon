import Anim from "./anim";

import commonStyle from "../styles/common.scss";
import mainStyle from "../styles/style.scss";

const App = (() => {
  const init = () => {
    Anim.init();
  };

  return { init };
})();

App.init();
