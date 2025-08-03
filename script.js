const apikey = 'c2c27b9fc256758d2c1ee36e10cc64df';

document.getElementById('search-btn').addEventListener('click', () => {
  const city = document.getElementById('city').value.trim();
  if (city !== '') {
    getWeatherByCity(city);
  }
});

// Detect location on page load
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        getWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      error => {
        console.warn("Location access denied or unavailable.");
      }
    );
  }
};

async function getWeatherByCity(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apikey}`;
  fetchAndRender(url, city);
}

async function getWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apikey}`;
  fetchAndRender(url);
}

async function fetchAndRender(url, cityName = '') {
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod !== "200") {
      document.getElementById('weather-data').innerHTML = `<p>Location not found or error occurred.</p>`;
      return;
    }

    const location = cityName || `${data.city.name}, ${data.city.country}`;

    const current = `
      <h2>${location}</h2>
      <p><strong>Temperature:</strong> ${data.list[0].main.temp}°C</p>
      <p><strong>Humidity:</strong> ${data.list[0].main.humidity}%</p>
      <p><strong>Weather:</strong> ${data.list[0].weather[0].description}
        <img src="https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png" alt="icon">
      </p>
      <p><strong>Wind:</strong> ${data.list[0].wind.speed} m/s</p>
    `;

    const hourly = data.list.slice(0, 4).map(item => {
      const time = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `<p><strong>${time}:</strong> ${item.main.temp}°C, ${item.weather[0].description}
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="icon">
      </p>`;
    }).join('');

    const dailyMap = {};
    const fiveDay = data.list.filter(item => {
      const date = new Date(item.dt * 1000);
      const hour = date.getHours();
      const day = date.toLocaleDateString();
      if (hour === 12 && !dailyMap[day]) {
        dailyMap[day] = true;
        return true;
      }
      return false;
    }).slice(0, 5).map(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      return `<p><strong>${date}:</strong> ${item.main.temp}°C, ${item.weather[0].description}
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="icon">
      </p>`;
    }).join('');

    document.getElementById('weather-data').innerHTML = `
      <div class="weather-row">
        <div class="weather-card">
          <h3>Current Weather</h3>
          ${current}
        </div>
        <div class="weather-card">
          <h3>Hourly Forecast (Next 12 hrs)</h3>
          ${hourly}
        </div>
        <div class="weather-card">
          <h3>5-Day Forecast</h3>
          ${fiveDay}
        </div>
      </div>`;
  } catch (err) {
    console.error(err);
    document.getElementById('weather-data').innerHTML = "<p>Error fetching weather data.</p>";
  }
}
