// api key for openweathermap
// const apiKey = process.env.apiKey;

// urls for openweathermap
const geocodingUrl = "http://api.openweathermap.org/geo/1.0/direct?q=";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?";
const nearestFire = document.getElementById('nearest-fire');
const weatherDisplay = document.getElementById('aisplay');


// async function getLatLon(city) {
//   const url = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey;
//   // const url = `http://localhost:3000/api/latlon?city=${city}`;


//   const response = await fetch(url);
//   const data = await response.json(); 

//   return {
//     "lat": data[0].lat,
//     "lon": data[0].lon
//   }
// }

// NEW
async function getLatLon(city) {
  const url = `http://localhost:3000/api/latlon?city=${encodeURIComponent(city)}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data || data.length === 0) {
    throw new Error("No matching location found");
  }
  
  return {
    lat: data[0].lat,
    lon: data[0].lon
  };
}

// async function getNearestFire(lat, lon) {
//   const clientId = process.env.clientId;
//   const clientSecret = process.env.clientSecret;
//   const place = lat + "," + lon;
//   const url = "https://data.api.xweather.com/fires/closest?p=" + place + "&format=json&client_id=" + clientId + "&client_secret=" + clientSecret;

//   try {
//     const response = await fetch(url);
//     const data = await response.json();

//     if (data && data.response && data.response.length > 0) {
//       return {
//         latitude: data.response[0].loc.lat,
//         longitude: data.response[0].loc.long,
//         name: data.response[0].report.name
//       };
//     } else {
//       return { error: "No fire data found" };
//     }
//   } catch (error) {
//     console.error("Failed to fetch fire data:", error);
//     return { error: "Something went wrong."};
//   }
// }

// NEW
async function getNearestFire(lat, lon) {
  const url = `http://localhost:3000/api/fire?lat=${lat}&lon=${lon}`;
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


// async function getCellTowers(currLat, currLon) {
//   const cellKey = process.env.cellKey;
//   const cellTowerUrl = "https://us1.unwiredlabs.com/v2/reverse?token=" + cellKey + "&lat=" + currLat + "&lon=" + currLon;
  
//   try {
//     const response = await fetch(cellTowerUrl);
//     const data = await response.json();

//     if (data && data.address && data.address.display_name) {
//       return {
//         cellTowerName: data.address.display_name
//       };
//     } else {
//       return { error: "No address data found" };
//     }
//   } catch (error) {
//     console.error("Failed to fetch cell tower data:", error);
//     return { error: "Something went wrong." };
//   }
// }

//NEW
async function getCellTowers(lat, lon) {
  const url = `http://localhost:3000/api/celltower?lat=${lat}&lon=${lon}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.address && data.address.display_name) {
      return {
        cellTowerName: data.address.display_name
      };
    } else {
      return { error: "No address data found" };
    }
  } catch (error) {
    console.error("Failed to fetch cell tower data:", error);
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
      // Add subtle shake animation for empty inputs
      inputField.classList.add('shake');
      messageDisplay.innerHTML = "Please enter a city name";
      messageDisplay.classList.add('show');


      setTimeout(() => {
        inputField.classList.remove('shake');
        messageDisplay.classList.remove('show');
      }, 3000);
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
    const latUserInput = coordinateData.lat;
    const lonUserInput = coordinateData.lon;

    const fireData = await getNearestFire(latUserInput, lonUserInput);
    const cellData = await getCellTowers(fireData.latitude, fireData.longitude);

    
    // Set a timeout to ensure the transition works
    setTimeout(() => {
  

      if (!fireData.error) {
        messageDisplay.innerHTML = "🔥 Nearest fire: " + fireData.name + ' 🔥' + "<br>Lat: " + fireData.latitude + ", Lon: " + fireData.longitude + "<br>" + "<br>";
        messageDisplay.innerHTML += "Cell tower located at " + cellData.cellTowerName + ", is in danger!";

        } else {
        messageDisplay.innerHTML = "There currently no fires nearby ☺︎";
        }

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