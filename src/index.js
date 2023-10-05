import "./style.css";
import { DateTime } from "../node_modules/luxon/src/luxon.js";
const getDataBtn = document.querySelector("#get-data-btn");
const loaderDiv = document.querySelector("#loader");
const toggleDarkModeBtn = document.querySelector("#dark-mode-btn");
let timeout;
const toggleLoader = () => {
  loaderDiv.classList.toggle("loader");
};
const showError = (result) => {
  clearTimeout(timeout);
  const p = document.querySelector("#error");
  p.textContent = result;
};
const toggleDarkMode = () => {
  let arr = document.querySelectorAll(".light-mode");
  if (arr.length == 0) arr = document.querySelectorAll(".dark-mode");
  arr.forEach((a) => {
    a.classList.toggle("light-mode");
    a.classList.toggle("dark-mode");
  });
};
const getInput = (input) => {
  let url =
    "https://api.weatherapi.com/v1/current.json?key=abee8c3897074fb7930153335232109&q=";
  showError("");
  const div = document.querySelector("#result");
  div.innerHTML = "";
  if (input === "") {
    showError("Please enter a landmark");
    return;
  }
  showError("");
  input.replace(" ", "%20");
  url += input;
  getData(url)
    .then(formatData)
    .catch(showError)
    .finally(() => toggleLoader());
};
const addEventListeners = () => {
  toggleDarkModeBtn.addEventListener("click", toggleDarkMode);
  document.querySelectorAll(".datamaps-subunit").forEach((c) =>
    c.addEventListener("click", (e) => {
      getInput(e.target.__data__.properties.name);
    })
  );
  getDataBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const input = document.querySelector("#search").value;
    getInput(input);
  });
};
const updateDateTime = (timeZone) => {
  const dateTimeDiv = document.querySelector("#date-time");
  dateTimeDiv.innerHTML = "";
  const dateTime = DateTime.now().setZone(timeZone);
  const date = document.createElement("p");
  date.textContent = dateTime.toLocaleString(DateTime.DATE_FULL);
  const time = document.createElement("p");
  time.textContent = dateTime.toLocaleString(DateTime.TIME_WITH_SECONDS);
  dateTimeDiv.appendChild(date);
  dateTimeDiv.appendChild(time);
};
const formatData = (data) => {
  clearInterval(timeout);
  const div = document.querySelector("#result");
  const { location, current } = data;
  const { name, region, country, tz_id, lat, lon } = location;
  const {
    temp_c,
    temp_f,
    condition,
    wind_kph,
    wind_dir,
    humidity,
    feelslike_c,
    feelslike_f,
    vis_km,
    uv,
  } = current;
  const h3 = document.createElement("h3");
  h3.textContent = `${name}, ${region}, ${country}`;
  const toggleCelsius = document.createElement("button");
  toggleCelsius.textContent = "Tempreture: " + temp_c.toFixed(1) + "°C";
  toggleCelsius.addEventListener("click", () => {
    toggleCelsius.textContent = toggleCelsius.textContent.includes("C")
      ? "Tempreture: " + temp_f.toFixed(1) + "°F"
      : "Tempreture: " + temp_c.toFixed(1) + "°C";
  });
  const img = document.createElement("img");
  img.src = condition.icon;
  img.alt = condition.text;
  const conditionDiv = document.createElement("div");
  conditionDiv.classList.add("inline");
  const p2 = document.createElement("p");
  p2.textContent = "Condition: " + condition.text;
  const p3 = document.createElement("p");
  p3.textContent = `Wind: ${wind_kph} kph ${wind_dir}`;
  const p4 = document.createElement("p");
  p4.textContent = `Humidity: ${humidity}%`;
  const toggleFeelsLike = document.createElement("button");
  toggleFeelsLike.textContent = "Feels like: " + feelslike_c + "°C";
  toggleFeelsLike.addEventListener("click", () => {
    toggleFeelsLike.textContent = toggleFeelsLike.textContent.includes("C")
      ? "Feels like: " + feelslike_f + "°F"
      : "Feels like: " + feelslike_c + "°C";
  });
  const toggleVisibility = document.createElement("p");
  toggleVisibility.textContent = "Visibility: " + vis_km + "km";
  const toggleUV = document.createElement("p");
  toggleUV.textContent = "UV: " + uv;
  const toggleLatitude = document.createElement("p");
  toggleLatitude.textContent = "Lat: " + lat;
  const toggleLongitude = document.createElement("p");
  toggleLongitude.textContent = "Lon: " + lon;
  div.appendChild(h3);
  const dateTimeDiv = document.createElement("div");
  dateTimeDiv.setAttribute("id", "date-time");
  div.appendChild(dateTimeDiv);
  updateDateTime(tz_id);
  timeout = setInterval(() => updateDateTime(tz_id), 1000);
  div.appendChild(toggleCelsius);
  conditionDiv.appendChild(p2);
  conditionDiv.appendChild(img);
  div.appendChild(conditionDiv);
  div.appendChild(p3);
  div.appendChild(p4);
  div.appendChild(toggleFeelsLike);
  div.appendChild(toggleVisibility);
  div.appendChild(toggleUV);
  const coordinatesDiv = document.createElement("div");
  coordinatesDiv.classList.add("inline");
  div.appendChild(coordinatesDiv);
  coordinatesDiv.appendChild(toggleLatitude);
  coordinatesDiv.appendChild(toggleLongitude);
};
const getData = async (url) => {
  toggleLoader();
  const response = await fetch(url, { mode: "cors" });
  console.log("response", response);
  if (response.status === 200) {
    const data = await response.json();
    console.log("data", data);
    return data;
  } else if (response.status === 403) {
    return Promise.reject("Error fetching data: " + response.status);
  } else if (response.status === 400) {
    return Promise.reject(
      document.querySelector("#search").value + " is not a valid landmark"
    );
  } else {
    return Promise.reject("Unknown error");
  }
};
addEventListeners();
