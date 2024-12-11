'use client'
import React, { useState } from "react";

const WeatherPage = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const API_KEY = "YOUR_API_KEY"; // Replace with your API key

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setWeatherData(null);
    setError(null);

    try {
      // Fetch the latitude and longitude of the city
      const geoRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
      );
      if (!geoRes.ok) throw new Error("City not found");

      const geoData = await geoRes.json();
      const { lat, lon } = geoData.coord;

      // Fetch the weather data using latitude and longitude
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
      );
      if (!res.ok) throw new Error("Weather data could not be fetched");

      const weatherData = await res.json();
      setWeatherData(weatherData);
    } catch (err) {
      setError("Could not fetch data. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Weather Forecast</h1>

        <form onSubmit={handleSubmit} className="flex mb-4">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={handleCityChange}
            className="border border-gray-300 p-2 w-full rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </form>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {weatherData && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center text-gray-800">{city}</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-600">Daytime</h3>
                <p className="text-gray-700">Temperature: {weatherData.daily[0].temp.day}°C</p>
                <p className="text-gray-700">Humidity: {weatherData.daily[0].humidity}%</p>
                <p className="text-gray-700">Conditions: {weatherData.daily[0].weather[0].description}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-600">Nighttime</h3>
                <p className="text-gray-700">Temperature: {weatherData.daily[0].temp.night}°C</p>
                <p className="text-gray-700">Humidity: {weatherData.daily[0].humidity}%</p>
                <p className="text-gray-700">Conditions: {weatherData.daily[0].weather[0].description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherPage;

