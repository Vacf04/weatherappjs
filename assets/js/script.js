const searchInput = document.querySelector('.search-city');
const searchSubmit = document.querySelector('.search-submit');
const weatherDisplay = document.querySelector('.display-weather-data'); 
const weatherIcon = document.querySelector('.weather-icon');
const apiKey = "c121be5508016a4d90ae0911ffd16b03";

searchSubmit.addEventListener('click', e => {
  e.preventDefault();
  if (searchInput.value.length === 0 || !searchInput.value.trim()) return;
  cityWeatherData();
});
searchInput.addEventListener('keyup', e => {
  if(e.code === 'Enter') {
    if (searchInput.value.length === 0 || !searchInput.value.trim()) return;
    cityWeatherData()
  };
});

async function cityWeatherData() {
  try { 
    cityDataJson = await cityData();
    const { name, lat, lon, country } = cityDataJson[0];
    const weatherDatas = await weatherData(lat, lon);
    displayWeatherData(weatherDatas[0], weatherDatas[1], name, country);
    searchInput.value = '';
  } catch(e) {
    alert('Error 404 city not found!!');
    console.log(e);
  };

};

async function cityData() {
  const cityName = searchInput.value;
  const cityData = await fetch(getUrlCity(cityName));
  const cityDataJson = await cityData.json();
  return cityDataJson;
};

async function weatherData(lat, lon) {
  const weatherData = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
  const weatherDataJson = await weatherData.json();
  const temperature = Math.round(weatherDataJson.main.temp - 273.15);
  const condition = weatherDataJson.weather[0].main;
  const weatherDatas = [temperature, condition]
  return weatherDatas;
};

function displayWeatherData(temperature, condition, cityName, country) {
  let icon;
  if(condition === 'Clear') {
    icon = "assets/img/clear.svg"
  } 
  else if(condition === 'Clouds'){
    icon = "assets/img/clouds.svg";
  }
  else if(condition === 'Rain') {
    icon = "assets/img/rain.svg";
  }
  else if(condition === 'Drizzle') {
    icon = "assets/img/drizzle.svg";
  }
  else if(condition === 'Mist') {
    icon = "assets/img/mist.svg";
  };
  weatherDisplay.innerHTML = `
  <img src="${icon}" alt="weather-icon-status" class="weather-icon">
  <h2>${temperature}°c</h2>
  <h3>${cityName}, ${country}</h3>
  `;
};

 function getUrlCity(city) {
  const urlCity = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
  return urlCity;
 };