
const apikey = 'c2c27b9fc256758d2c1ee36e10cc64df';//api in anusankarhazra24@gmail.com fromm weather site
const apiLink = 'https://api.openweathermap.org/data/2.5/weather';

document.getElementById('search-btn').addEventListener('click', getWeather);

function getWeather() {
  const city = document.getElementById('city').value.trim();
  const url = `${apiLink}?q=${city}&appid=${apikey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const weatherData = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Weather: ${data.weather[0].description}</p>
             
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p>Rain Probability: ${data.clouds.all}%</p>

      `;
      document.getElementById('weather-data').innerHTML = weatherData;
    })
    .catch(error => console.error('Error:', error));
}

