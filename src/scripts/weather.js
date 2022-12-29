import { deleteLocalKey } from "./helpers";

const Weather = (() => {
  let latPos;
  let longPos;

  const Geo = navigator.geolocation ? navigator.geolocation : false;

  const getLatAndLong = (pos) => {
    deleteLocalKey("geoLocErr");

    latPos = pos.coords.latitude;
    longPos = pos.coords.longitude;
  };

  const getPosition = (rejectCall) => {
    Geo.getCurrentPosition(getLatAndLong, rejectCall, { timeout: 10000 });
  };

  return { getPosition, Geo, latPos, longPos };
})();

export default Weather;
