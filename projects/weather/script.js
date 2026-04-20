const inputBox = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');
const weatherIcon = document.querySelector('.weather-icon');
const weather = document.querySelector('.weather');
const errorMessage = document.querySelector('.error');

async function checkWeather(city) {
    if (!city.trim()) {
        console.warn('City name is empty');
        return;
    }

    try {
        const apiKey = '39e5d453e46c0ba96d06e7b4dd258f25';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();

        console.log(data);

        updateWeatherUI(data);

    } catch (fetchError) {
        console.error(fetchError.message);
        weather.style.display = 'none';
        errorMessage.style.display = 'block';
    }

}

function updateWeatherUI(data) {
    document.querySelector('.temperatura').innerHTML = `${Math.round(data.main.temp)}°C`;
    document.querySelector('.city').innerHTML = `${data.name}, ${data.sys.country}`;
    document.querySelector('.humedad').innerHTML = `${data.main.humidity}%`;
    document.querySelector('.viento').innerHTML = `${data.wind.speed}km/h`;

    const weatherIcons = {
        'Clear-d': 'images/clear-day.png',
        'Clear-n': 'images/clear-night.png',
        'Clouds-d': 'images/cloud-day.png',
        'Clouds-n': 'images/cloud-night.png',
        'Rain-d': 'images/rain.png',
        'Rain-n': 'images/rain.png',
        'Drizzle-d': 'images/rain.png',
        'Drizzle-n': 'images/rain.png',
        'Thunderstorm-d': 'images/thunderstorm.png',
        'Thunderstorm-n': 'images/thunderstorm.png',
        'Snow-d': 'images/snow.png',
        'Snow-n': 'images/snow.png',
        'Mist-d': 'images/mist.png',
        'Mist-n': 'images/mist.png',
        'Smoke-d': 'images/mist.png',
        'Smoke-n': 'images/mist.png',
        'Haze-d': 'images/mist.png',
        'Haze-n': 'images/mist.png',
        'Dust-d': 'images/mist.png',
        'Dust-n': 'images/mist.png',
        'Fog-d': 'images/mist.png',
        'Fog-n': 'images/mist.png',
        'Sand-d': 'images/mist.png',
        'Sand-n': 'images/mist.png',
        'Ash-d': 'images/mist.png',
        'Ash-n': 'images/mist.png',
        'Squall-d': 'images/thunderstorm.png',
        'Squall-n': 'images/thunderstorm.png',
        'Tornado-d': 'images/tornado.png',
        'Tornado-n': 'images/tornado.png',
    }

    const weatherCondition = data.weather[0]?.main || 'Unknown';
    const weatherIconCode = data.weather[0]?.icon || '01d';
    const conditionKey = `${weatherCondition}-${weatherIconCode.endsWith('d') ? 'd' : 'n'}`;

    const iconPath = weatherIcons[conditionKey] || 'images/unknown.png';
    weatherIcon.src = iconPath;

    if (iconPath === 'images/unknown.png') {
        console.warn(`Unknown weather condition: ${conditionKey}. Add icon: ${conditionKey}.png`);
    }

    // timezone-adjusted local time display
    const localDate = new Date((data.dt + data.timezone) * 1000);
    const localTimeText = localDate.toLocaleString();
    const localTimeElem = document.querySelector('.local-time');
    if (localTimeElem) {
        localTimeElem.textContent = `Local time: ${localTimeText}`;
    }

    weather.style.display = 'block';
    errorMessage.style.display = 'none';
}



searchBtn.addEventListener('click', () => {
    checkWeather(inputBox.value);
});
