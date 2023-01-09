import { convToHex, clampRgbVal } from "./helpers/data-helpers";

const FadeElemBkgrdTemp = (elem) => {
  const targetElem = elem;
  let lastScrollPos = window.scrollY;
  let rgbOpacity = 0;

  const init = () => {
    const curntScrollPos = window.scrollY;

    if (curntScrollPos === 0 && rgbOpacity !== 0) {
      targetElem.style.background = "#21212100";
      return;
    }

    if (lastScrollPos < curntScrollPos) {
      rgbOpacity = clampRgbVal(rgbOpacity, 34) + 1;
      targetElem.style.background = `#212121${convToHex(rgbOpacity)}`;
    } else if (lastScrollPos > curntScrollPos && curntScrollPos < 200) {
      rgbOpacity = clampRgbVal(rgbOpacity, 34) - 1;
      targetElem.style.background = `#212121${convToHex(rgbOpacity)}`;
    }

    lastScrollPos = curntScrollPos;
  };

  return { init };
};

const Anim = (() => {
  const forecastPanel = document.querySelector("[data-slctr=forecastPanel]");
  const extraWeatherPanel = document.querySelector(
    "[data-slctr=extraWeatherPanel]"
  );
  const suntimePanel = document.querySelector("[data-slctr=suntimePanel]");
  const weatherRadarPanel = document.querySelector(
    "[data-slctr=weatherRadarPanel]"
  );

  const fadeForecastBkgrd = FadeElemBkgrdTemp(forecastPanel);
  const fadeExtraWeatherBkgrd = FadeElemBkgrdTemp(extraWeatherPanel);
  const fadeSuntimeBkgrd = FadeElemBkgrdTemp(suntimePanel);
  const fadeWeatherRadarBkgrd = FadeElemBkgrdTemp(weatherRadarPanel);

  const init = () => {
    window.addEventListener("scroll", () => {
      requestAnimationFrame(fadeForecastBkgrd.init);
      requestAnimationFrame(fadeExtraWeatherBkgrd.init);
      requestAnimationFrame(fadeSuntimeBkgrd.init);
      requestAnimationFrame(fadeWeatherRadarBkgrd.init);
    });
  };

  return { init };
})();

export default Anim;
