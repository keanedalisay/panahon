import fullscreenIcon from "../../assets/svgs/fullscreen-icon.svg";

import { Local } from "../helpers/data-helpers";
import { Overlay } from "../helpers/dom-helpers";

const tempLayer = L.tileLayer(
  `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=`
);
const precipLayer = L.tileLayer(
  `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=`
);
const cloudsLayer = L.tileLayer(
  `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=`
);
const windLayer = L.tileLayer(
  `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=`
);

const baseLayers = {
  Temperature: tempLayer,
  Precipitation: precipLayer,
  Clouds: cloudsLayer,
  Wind: windLayer,
};

const osmLayer = L.tileLayer(`https://tile.openstreetmap.org/{z}/{x}/{y}.png`, {
  attribution: `&copy; <a class="openWeatherLink" href="https://www.openstreetmap.org/about" target="_blank">OpenStreetMap</a> | &copy; 
       <a class="openWeatherLink" href="https://openweathermap.org/" target="_blank">OpenWeather</a>`,
});

const weatherRadarElem = document.querySelector("[data-slctr=weatherRadar]");
const latitude = Local.getValue("latitude") || 0;
const longitude = Local.getValue("longitude") || 0;

const WeatherRadar = L.map(weatherRadarElem, {
  center: [parseInt(latitude, 10), parseInt(longitude, 10)],
  minZoom: 2,
  maxZoom: 10,
  zoom: 8,
  layers: [osmLayer, precipLayer],
});

setTimeout(() => {
  WeatherRadar.invalidateSize();
}, 0);

L.control
  .layers(baseLayers, null, {
    collapsed: false,
  })
  .addTo(WeatherRadar);

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
      setTimeout(() => {
        WeatherRadar.invalidateSize();
      }, 0);

      const weatherRadarPanel = document.querySelector(
        "[data-slctr=weatherRadarPanel]"
      );
      weatherRadarPanel.classList.toggle("weatherRadarPanel-fullscreen");
      Overlay.toggle();
    });

    return fullscreenBtn;
  },
});

WeatherRadar.addControl(new FullscreenControl());

export default WeatherRadar;
