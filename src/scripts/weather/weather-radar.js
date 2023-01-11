import { getLocalKey } from "../helpers/data-helpers";

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

export default Radar;
