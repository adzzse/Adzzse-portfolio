import React, { useState, useEffect, useRef } from 'react'

function Weather() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [city, setCity] = useState('London')
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showMap, setShowMap] = useState(false)
  const [selectedCoordinates, setSelectedCoordinates] = useState(null)
  const autocompleteRef = useRef(null)

  // Mock city suggestions for autocomplete
  const citySuggestions = [
    { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
    { name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 },
    { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503 },
    { name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522 },
    { name: 'Sydney', country: 'AU', lat: -33.8688, lon: 151.2093 },
    { name: 'Berlin', country: 'DE', lat: 52.5200, lon: 13.4050 },
    { name: 'Moscow', country: 'RU', lat: 55.7558, lon: 37.6176 },
    { name: 'Cairo', country: 'EG', lat: 30.0444, lon: 31.2357 },
    { name: 'Mumbai', country: 'IN', lat: 19.0760, lon: 72.8777 },
    { name: 'São Paulo', country: 'BR', lat: -23.5505, lon: -46.6333 }
  ]

  // Mock weather data for demo purposes
  const mockWeatherData = {
    city: 'London',
    country: 'GB',
    temperature: 18,
    description: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    icon: '🌤️'
  }

  // Filter cities based on input
  const filterCities = (input) => {
    if (!input) return []
    return citySuggestions.filter(city => 
      city.name.toLowerCase().includes(input.toLowerCase()) ||
      city.country.toLowerCase().includes(input.toLowerCase())
    )
  }

  // Handle input change with autocomplete
  const handleInputChange = (e) => {
    const value = e.target.value
    setCity(value)
    
    if (value.length > 1) {
      const filtered = filterCities(value)
      setSuggestions(filtered)
      setShowAutocomplete(true)
    } else {
      setSuggestions([])
      setShowAutocomplete(false)
    }
  }

  // Handle city selection from autocomplete
  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity.name)
    setSelectedCoordinates({ lat: selectedCity.lat, lon: selectedCity.lon })
    setShowAutocomplete(false)
    setSuggestions([])
  }

  // Handle map selection
  const handleMapSelect = (lat, lon) => {
    setSelectedCoordinates({ lat, lon })
    // Find city name from coordinates (in real app, this would be reverse geocoding)
    const city = citySuggestions.find(c => 
      Math.abs(c.lat - lat) < 0.1 && Math.abs(c.lon - lon) < 0.1
    )
    if (city) {
      setCity(city.name)
    }
    setShowMap(false)
  }

  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setShowAutocomplete(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Get weather icon based on OpenWeatherMap icon code
  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    }
    return iconMap[iconCode] || '🌤️'
  }

  // OpenWeatherMap API configuration
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
  const BASE_URL = 'https://api.openweathermap.org/data/2.5'

  // Fetch weather data from API
  const fetchWeatherData = async (lat, lon, cityName) => {
    try {
      setLoading(true)
      setError(null)

      // Fetch current weather
      const weatherResponse = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      )

      if (!weatherResponse.ok) {
        throw new Error('Failed to fetch weather data')
      }

      const weatherData = await weatherResponse.json()

      // Transform API data to our format
      const transformedWeather = {
        city: cityName || weatherData.name,
        country: weatherData.sys.country,
        temperature: Math.round(weatherData.main.temp),
        description: weatherData.weather[0].description,
        humidity: weatherData.main.humidity,
        windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
        icon: getWeatherIcon(weatherData.weather[0].icon),
        feelsLike: Math.round(weatherData.main.feels_like),
        pressure: weatherData.main.pressure,
        visibility: Math.round(weatherData.visibility / 1000), // Convert m to km
        sunrise: new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        sunset: new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })
      }

      setWeather(transformedWeather)
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data')
      console.error('Weather API Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    
    if (selectedCoordinates) {
      await fetchWeatherData(selectedCoordinates.lat, selectedCoordinates.lon, city)
    } else {
      // Try to find city in suggestions
      const foundCity = citySuggestions.find(c => 
        c.name.toLowerCase() === city.toLowerCase()
      )
      
      if (foundCity) {
        setSelectedCoordinates({ lat: foundCity.lat, lon: foundCity.lon })
        await fetchWeatherData(foundCity.lat, foundCity.lon, foundCity.name)
      } else {
        setError('City not found. Please select from the suggestions or use the map picker.')
      }
    }
  }

  return (
    <div className="weather-app">
      <header className="site-header">
        <h2>Weather App</h2>
        <p className="tagline">Check the weather anywhere in the world</p>
      </header>
      
      <div className="weather-container">
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="input-container" ref={autocompleteRef}>
              <input
                type="text"
                value={city}
                onChange={handleInputChange}
                placeholder="Enter city name..."
                className="city-input"
              />
              {showAutocomplete && suggestions.length > 0 && (
                <div className="autocomplete-dropdown">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="autocomplete-item"
                      onClick={() => handleCitySelect(suggestion)}
                    >
                      <span className="city-name-suggestion">{suggestion.name}</span>
                      <span className="country-code">{suggestion.country}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button type="submit" className="search-btn primary">
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button 
              type="button" 
              className="map-btn"
              onClick={() => setShowMap(!showMap)}
            >
              🗺️ Map
            </button>
          </form>
        </div>

        {showMap && (
          <div className="map-picker">
            <h4>Click on the map to select a location</h4>
            <div className="map-container">
              <div className="map-grid">
                {Array.from({ length: 10 }, (_, row) => (
                  <div key={row} className="map-row">
                    {Array.from({ length: 20 }, (_, col) => {
                      const lat = 90 - (row * 18)
                      const lon = -180 + (col * 18)
                      const isSelected = selectedCoordinates && 
                        Math.abs(selectedCoordinates.lat - lat) < 9 && 
                        Math.abs(selectedCoordinates.lon - lon) < 9
                      
                      return (
                        <div
                          key={col}
                          className={`map-cell ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleMapSelect(lat, lon)}
                          title={`${lat.toFixed(1)}°, ${lon.toFixed(1)}°`}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
              <div className="map-legend">
                <div className="legend-item">
                  <div className="legend-color"></div>
                  <span>Click to select location</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color selected"></div>
                  <span>Selected location</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {weather && (
          <div className="weather-display">
            <div className="weather-main">
              <div className="weather-icon">{weather.icon}</div>
              <div className="weather-info">
                <h3 className="city-name">{weather.city}, {weather.country}</h3>
                <div className="temperature">{weather.temperature}°C</div>
                <div className="description">{weather.description}</div>
              </div>
            </div>
            
            <div className="weather-details">
              <div className="detail-item">
                <span className="detail-label">Feels Like</span>
                <span className="detail-value">{weather.feelsLike}°C</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{weather.humidity}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Wind Speed</span>
                <span className="detail-value">{weather.windSpeed} km/h</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Pressure</span>
                <span className="detail-value">{weather.pressure} hPa</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Visibility</span>
                <span className="detail-value">{weather.visibility} km</span>
              </div>
            </div>

            <div className="sun-info">
              <div className="sun-item">
                <span className="sun-label">🌅 Sunrise</span>
                <span className="sun-time">{weather.sunrise}</span>
              </div>
              <div className="sun-item">
                <span className="sun-label">🌇 Sunset</span>
                <span className="sun-time">{weather.sunset}</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="weather-info-box">
          <h4>About This Weather App</h4>
          <p>This weather application now uses real-time data from OpenWeatherMap API. It provides accurate current weather conditions, detailed metrics, and sunrise/sunset times.</p>
          <ul>
            <li>Real-time weather data from OpenWeatherMap API</li>
            <li>Autocomplete city search with suggestions</li>
            <li>Interactive map picker for location selection</li>
            <li>Comprehensive weather details (temperature, humidity, wind, pressure)</li>
            <li>Sunrise and sunset times</li>
            <li>Responsive design for all devices</li>
          </ul>
          <div className="api-note">
            <strong>Note:</strong> This app is now connected to the OpenWeatherMap API and will show real-time weather data for any location you search for.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Weather
