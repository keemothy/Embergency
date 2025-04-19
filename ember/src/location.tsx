import React, { useState } from "react";
import axios from "axios";


// Mock fire data
const fireIncidents = [
  { name: "Fire A", lat: 37.3, lng: -122.0 },
  { name: "Fire B", lat: 38.1, lng: -122.5 },
  { name: "Fire C", lat: 36.8, lng: -121.9 },
];

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (val) => (val * Math.PI) / 180;
  const R = 6371; // Earth's radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const NearestFireFinder = () => {
  const [locationInput, setLocationInput] = useState("");
  const [nearestFire, setNearestFire] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setLocationInput(e.target.value);
  };

  const fetchNearestFire = async () => {
     process.env.anotherapiKey; // Replace this with your actual API key
    const geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      locationInput
    )}&key=${apiKey}`;

    try {
      const response = await axios.get(geocodeURL);
      const data = response.data;

      if (data.status === "OK") {
        const { lat, lng } = data.results[0].geometry.location;

        let closest = null;
        let minDistance = Infinity;

        fireIncidents.forEach((fire) => {
          const dist = haversineDistance(lat, lng, fire.lat, fire.lng);
          if (dist < minDistance) {
            minDistance = dist;
            closest = fire;
          }
        });

        setNearestFire({
          ...closest,
          distance: minDistance.toFixed(2),
        });
        setError(null);
      } else {
        setError("Could not find location. Try a different input.");
        setNearestFire(null);
      }
    } catch (err) {
      setError("Something went wrong while fetching the data.");
      setNearestFire(null);
    }
  };

  return (
    <div>
      <h1>Find the Nearest Fire</h1>
      <input
        type="text"
        placeholder="Enter a location (e.g., San Francisco)"
        value={locationInput}
        onChange={handleInputChange}
      />
      <button onClick={fetchNearestFire}>Find Nearest Fire</button>

      {nearestFire && (
        <div>
          <h2>Nearest Fire: {nearestFire.name}</h2>
          <p>Latitude: {nearestFire.lat}</p>
          <p>Longitude: {nearestFire.lng}</p>
          <p>Distance: {nearestFire.distance} km</p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default NearestFireFinder;

