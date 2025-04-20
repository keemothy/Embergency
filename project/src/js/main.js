const apiKey = process.env.apiKey;

const geocodingUrl = "http://api.openweathermap.org/geo/1.0/direct?q="; // This is beginning of the API call we use to convert city names to coordinates!
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?";
const nearestFire = document.getElementById('nearest-fire');
const weatherDisplay = document.getElementById('aisplay');

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

// Main application functionality
document.addEventListener('DOMContentLoaded', function() {
  const inputField = document.getElementById('nature-input');
  const submitButton = document.getElementById('submit-btn');
  const messageDisplay = document.getElementById('message-display');
  
  // Add typing event to change gradient
  let typingTimer;
  inputField.addEventListener('input', function() {
    clearTimeout(typingTimer);
    
    // Wait a bit after typing stops to change the gradient
    typingTimer = setTimeout(() => {
      if (window.gradientManager) {
        window.gradientManager.changeGradientBasedOnInput(inputField.value);
      }
    }, 500);
  });
  
  // Handle form submission
  submitButton.addEventListener('click', handleSubmit);
  inputField.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  });
  
  function handleSubmit() {
    const userInput = inputField.value.trim();
    
    if (userInput === '') {
      // Add subtle shake animation for empty input
      inputField.classList.add('shake');
      setTimeout(() => {
        inputField.classList.remove('shake');
      }, 500);
      return;
    }
    
    // Display the message
    displayMessage(userInput);
    
    // Clear the input field
    inputField.value = '';
    
    // Create a burst of particles around the input (if particles are available)
    createParticleBurst();
  }
  
  
  async function displayMessage(message) {
    // First hide the existing message if visible
    messageDisplay.classList.remove('show');

    const userInput = inputField.value.trim();
    const coordinateData = await getLatLon(userInput);
    
    // Now we have access to the latitude and longitude of the fire
    const latFire = coordinateData.lat;
    const lonFire = coordinateData.lon;

    const fireData = await getNearestFire(latFire, lonFire);

    
    // Add some natural-themed flair to the message
    const natureEmojis = ['🌿', '🌱', '🍃', '🌲', '🌸', '🍂', '🌺'];
    const randomEmoji = natureEmojis[Math.floor(Math.random() * natureEmojis.length)];
    
    // Set a timeout to ensure the transition works
    setTimeout(() => {

      // if (!fireData.error) {
      //   } else {
      //   nearestFire.innerHTML = "No fire data available.";
      //   }

      nearestFire.innerHTML = "🔥 Nearest fire: " + fireData.name + "<br>Lat: " + fireData.latitude + ", Lon: " + fireData.longitude;
      messageDisplay.innerHTML = "🔥 Nearest fire: " + fireData.name + "<br>Lat: " + fireData.latitude + ", Lon: " + fireData.longitude;;
      messageDisplay.classList.add('show');
    }, 300);
  }
  
  function createParticleBurst() {
    // Get input field position
    const inputRect = inputField.getBoundingClientRect();
    const centerX = inputRect.left + inputRect.width / 2;
    const centerY = inputRect.top + inputRect.height / 2;
    
    // Create particle burst effect
    const canvas = document.querySelector('#particles canvas');
    if (canvas) {
      const event = new MouseEvent('click', {
        clientX: centerX,
        clientY: centerY
      });
      canvas.dispatchEvent(event);
    }
  }
  
  // Add shake animation CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .shake {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
  `;
  document.head.appendChild(style);
});