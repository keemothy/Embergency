// CLUE #0: See more info in the homework spec.
const apiKey = process.env.apiKey;

const geocodingUrl = "http://api.openweathermap.org/geo/1.0/direct?q="; // This is beginning of the API call we use to convert city names to coordinates!
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?"; // This is beginning of the API call we use to convert coordinates to weather!

// DOM Targetting: Select the input element with the id "cityName" (CLUE #1)
const cityName = document.getElementById("cityName");
const mainWeather = document.getElementById("main-weather");
const weatherDescription = document.getElementById("weather-description");
const submitButton = document.getElementById("submit");
const nearestFire = document.getElementById("nearest-fire");

// This adds an event listener to check when the submit button is clicked,
// then if the cityName's value is not blank, we call setWeatherDescription with cityName.value as the argument.
submitButton.addEventListener("click", function () {
  if (cityName.value != "") {
    setWeatherDescription(cityName.value);
  }
});


// This function takes in a city name (that the user inputs), and gets the latitude and longitude
// of that city. This is important because our second API call, the one that actually gets the weather,
// requires a latitude and longitude coordinate pair.
async function getLatLon(city) {
  // Let's create the API url. (CLUE #2)
  const url = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey;

  // Send a GET request to the url that you wrote above! (CLUE #3)
  const response = await fetch(url);
  const data = await response.json(); //This line parses the response into JSON format so we can use it!

  // Let's return a JavaScript object here! (CLUE #4)
  return {
    "lat": data[0].lat,
    "lon": data[0].lon
  }
}

// This function makes a GET request to retrieve weather data at a specific latitude and longitude.
// (CLUE #5)
async function getWeather(lat, lon) {
  const url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
  const response = await fetch(url);
  const data = await response.json();

  // Return the main weather and weather description from the data variable! (CLUE #5.5)
  return {
    "main": data.weather[0].main,
    "description": data.weather[0].description
  }
}

async function getNearestFire(lat, lon) {
  const clientId = process.env.clientId;
  const clientSecret = process.env.clientSecret;
  const place = lat + "," + lon;
  const url = "https://data.api.xweather.com/fires/closest?p=" + place + "&format=json&client_id=" + clientId + "&client_secret=" + clientSecret;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.response && data.response.length > 0) {
      return {
        latitude: data.response[0].loc.lat,
        longitude: data.response[0].loc.long,
        name: data.response[0].report.name
      };
    } else {
      return { error: "No fire data found" };
    }
  } catch (error) {
    console.error("Failed to fetch fire data:", error);
    return { error: "Something went wrong." };
  }
}



// This function gets the weather using the functions you wrote above and displays it in the HTML.
async function setWeatherDescription(city) {
  // This line calls getLatLon on the city name provided to find the latitude and longitude of that city.
  const coordinateData = await getLatLon(city);

  // Extract the lat and lon from coordinateData. (CLUE #6)
  const lat = coordinateData.lat;
  const lon = coordinateData.lon;


  const weatherData = await getWeather(lat, lon);
  // const nearestFire = await getNearestFire(lat, lon);

  const fireData = await getNearestFire(lat, lon);
  if (!fireData.error) {
  nearestFire.innerHTML = "🔥 Nearest fire: " + fireData.name + "<br>Lat: " + fireData.latitude + ", Lon: " + fireData.longitude;
  } else {
  nearestFire.innerHTML = "No fire data available.";
  }

  // Same thing here, but we want to set mainWeather and weatherDescription's innerHTML to the relevant values in weatherData.
  // (CLUE #7)
  // OLD UNNEEDED CODE
  //nearestFire.innerHTML = "The Fire Lat: " + fireData.lat;
  //nearestFire.innerHTML = "The Fire Long: " + fireData.lon;
  //mainWeather.innerHTML = ":D " + weatherData.main + " :D";
  //weatherDescription.innerHTML = ":D " + weatherData.description + " :D";
}
