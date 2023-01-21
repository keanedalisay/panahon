# Panahon

A [weather](http://panahon.surge.sh/)-based web application.

I used [Surge](https://surge.sh/) to deploy this project as one of the APIs I used is an **http** request, not _https_.

Grateful for the people who built these tools which made this project possible:

<a href="https://www.openstreetmap.org/about"><img src="src/assets/imgs/open-street-map.png" alt="OpenStreetMap" width="50"></a>
<a href="https://leafletjs.com/"><img src="src/assets/imgs/leaflet.png" alt="Leaflet" width="100"></a>
<a href="https://openweathermap.org/"><img src="src/assets/imgs/open-weather.png" alt="OpenWeather" width="100"></a>

---

## Features

- [Weather retrieval with or without geolocation](#geolocation)

- [Search almost any location to retrieve weather](#search-location-for-weather)

- [Autocomplete and unit conversion](#autocomplete-and-unit-conversion)

- [Functioning weather radar](#weather-radar)

---

## Geolocation

![Accepting geolocation results in weather retrieval based on users current location](src/assets/gifs/accept-geolocation.gif)

It is handy to give control to the user whether they want to give their coordinates in exchange for acquiring weather data automatically (thanks Geolocation).

If not, Panahon would not crash but rather display an **alert** telling the user that he/she has declined the Geolocation request.

![Rejecting geolocation would display an alert panel, telling you to use the search bar instead](src/assets/gifs/reject-geolocation.gif)

## Search Location for Weather

![The search bar is great for you to look at the weather of different locations around the world](src/assets/gifs/search-location-for-weather.gif)

Whether you declined Geolocation or not, you can still request weather data through the search bar by typing in the **city/town** (country is optional) you want to look.

Not all locations (probably) are covered so be mindful with what you type. Search bar **accepts some languages** as input (i.e. Japanese, Chinese, German).

## Autocomplete and Unit Conversion

![Autocomplete is available for the search bar and you can switch between metric and imperial system of units](src/assets/gifs/autocomplete-and-unit-conversion.gif)

Some cities/towns around the world have the same name so autocomplete can come in useful for you to choose the right location to search for.

You can also switch between the metric and imperial system of units respectively. **Your preferences are saved through LocalStorage**.

## Weather Radar

![Functioning weather radar to check weather patterns around the world](src/assets/gifs/weather-radar.gif)

While you cannot move forward in time to see patterns of movement, it is still cool to see it fully function.

You can switch between different layers of weather aspects (i.e. temperature).

**Fullscreen mode** is accomodated for all devices, small or large. (Though the bigger the device, the less resolution the map will have when fullscreened).

## License

© Copyright 2023. Keane Dalisay.

The content of this repository is licensed under [MIT](LICENSE).
