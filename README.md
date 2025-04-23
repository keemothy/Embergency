<h1 align='center'> Embergency </h1>
<p align='center'> A HackDavis 2025 Project for California Government Operations Agency (GovOps) track. As a team of four, we built Embergency, a web application that locates live wildfires and the nearest celluar tower that may be affected. </p>

<h1 align='center'> Description </h1>
<p align='center'> Given a user's input city, our application locates nearby fires and returns communication towers that are in danger of being compromised, allowing users to better prepare for fire response. This can be applicable for firefighters who need to quickly determine where they need to go, along with citizens who want to stay updated on their surroundings. </p>

<h1 align='center'> Demo </h1>

![embergency_demo](https://github.com/user-attachments/assets/c9effc91-4264-4844-bbb0-133bfa6a3c43)


## Technologies Used

* Languages
   - JavaScript
   - HTML
   - CSS
   - Typescript
 
* APIs
    - [xWeather API](https://www.xweather.com/docs/weather-api/endpoints/fires) - API Key generation is needed to pull wildfire data
    - [OpenCellID/Unwired Labs API](https://unwiredlabs.com/api) - API Key generation is needed to query reverse geocoding to find cellular towers
    - [OpenWeather API](https://openweathermap.org/api) - API Key generation is needed to extract longitude and latitude coordinates

## Contributors

* Kim Chu
* Christopher Hoang
* Marq Lott
* David Estrella

## Future Integrations
* Integrate a visual map with landmarks mapping to both fires and communication towers (Google Maps API)
* Consider wind directions, speed, and fire containment percentages to determine evacuation preparations
* Partner with cellphone providers to send alerts about potentially hazardous locations
* Locate nearby evacuation zones for citizens
