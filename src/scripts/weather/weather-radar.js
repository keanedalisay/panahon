import fullscreenIcon from "../../assets/svgs/fullscreen-icon.svg";

import { getLocalKey } from "../helpers/data-helpers";
import { toggleOverlay } from "../helpers/dom-helpers";

const crntLat = parseInt(getLocalKey("crntLat"), 10) || 0;
const crntLong = parseInt(getLocalKey("crntLong"), 10) || 0;

const openWeatherMap = (() => {
  const temp = L.tileLayer(
    `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=99d30869fe44cfd63e80305f9176900b`
  );
  const precip = L.tileLayer(
    `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=99d30869fe44cfd63e80305f9176900b`
  );
  const clouds = L.tileLayer(
    `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=99d30869fe44cfd63e80305f9176900b`
  );
  const wind = L.tileLayer(
    `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=99d30869fe44cfd63e80305f9176900b`
  );

  return { temp, precip, clouds, wind };
})();

const openStreetMap = L.tileLayer(
  `https://tile.openstreetmap.org/{z}/{x}/{y}.png`,
  {
    attribution: `&copy; <a class="openWeatherLink" href="https://www.openstreetmap.org/about" target="_blank">OpenStreetMap</a> | &copy; 
     <a class="openWeatherLink" href="https://openweathermap.org/" target="_blank">OpenWeather</a>`,
  }
);

const weatherRadarPanel = document.querySelector(
  "[data-slctr=weatherRadarPanel]"
);
const radarElem = document.querySelector("[data-slctr=weatherRadar]");

const Radar = L.map(radarElem, {
  center: [crntLat, crntLong],
  minZoom: 2,
  maxZoom: 10,
  zoom: 8,
  layers: [openStreetMap, openWeatherMap.precip],
});

setTimeout(() => {
  Radar.invalidateSize();
}, 0);

const baseMaps = {
  Temperature: openWeatherMap.temp,
  Precipitation: openWeatherMap.precip,
  Clouds: openWeatherMap.clouds,
  Wind: openWeatherMap.wind,
};

L.control
  .layers(baseMaps, null, {
    collapsed: false,
  })
  .addTo(Radar);

const FullscreenControl = L.Control.extend({
  options: { position: "topleft" },

  onAdd() {
    const fullscreenBtn = L.DomUtil.create(
      "button",
      "leaflet-bar leaflet-control leaflet-control-fullscreen"
    );

    const object = L.DomUtil.create(
      "object",
      "leaflet-control-fullscreen-icon"
    );

    object.textContent = "Toggle fullscreen";
    object.setAttribute("tabindex", -1);
    object.setAttribute("aria-label", "Toggle fullscreen for map");
    object.setAttribute("type", "text/svg+xml");
    object.setAttribute("data", fullscreenIcon);

    fullscreenBtn.appendChild(object);

    fullscreenBtn.addEventListener("click", () => {
      weatherRadarPanel.classList.toggle("weatherRadarPanel-fullscreen");
      toggleOverlay();

      setTimeout(() => {
        Radar.invalidateSize();
      }, 0);
    });

    return fullscreenBtn;
  },
});

Radar.addControl(new FullscreenControl());

export default Radar;
