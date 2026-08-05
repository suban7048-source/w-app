/* ==========================================================================
   Atmosphere Weather App - Open-Meteo API Client & WMO Weather Code Mapper
   ========================================================================== */

export const WMO_CODES = {
  0: { description: "Clear Sky", icon: "sun", theme: "sunny" },
  1: { description: "Mainly Clear", icon: "sun-cloud", theme: "sunny" },
  2: { description: "Partly Cloudy", icon: "cloud-sun", theme: "cloudy" },
  3: { description: "Overcast", icon: "cloud", theme: "cloudy" },
  45: { description: "Foggy", icon: "fog", theme: "cloudy" },
  48: { description: "Depositing Rime Fog", icon: "fog", theme: "cloudy" },
  51: { description: "Light Drizzle", icon: "drizzle", theme: "rainy" },
  53: { description: "Moderate Drizzle", icon: "drizzle", theme: "rainy" },
  55: { description: "Dense Drizzle", icon: "drizzle", theme: "rainy" },
  56: { description: "Freezing Drizzle", icon: "sleet", theme: "snowy" },
  57: { description: "Dense Freezing Drizzle", icon: "sleet", theme: "snowy" },
  61: { description: "Slight Rain", icon: "rain-light", theme: "rainy" },
  63: { description: "Moderate Rain", icon: "rain", theme: "rainy" },
  65: { description: "Heavy Rain", icon: "rain-heavy", theme: "rainy" },
  66: { description: "Freezing Rain", icon: "sleet", theme: "snowy" },
  67: { description: "Heavy Freezing Rain", icon: "sleet", theme: "snowy" },
  71: { description: "Slight Snow Fall", icon: "snow-light", theme: "snowy" },
  73: { description: "Moderate Snow Fall", icon: "snow", theme: "snowy" },
  75: { description: "Heavy Snow Fall", icon: "snow-heavy", theme: "snowy" },
  77: { description: "Snow Grains", icon: "snow", theme: "snowy" },
  80: { description: "Slight Rain Showers", icon: "rain-light", theme: "rainy" },
  81: { description: "Moderate Rain Showers", icon: "rain", theme: "rainy" },
  82: { description: "Violent Rain Showers", icon: "rain-heavy", theme: "rainy" },
  85: { description: "Slight Snow Showers", icon: "snow-light", theme: "snowy" },
  86: { description: "Heavy Snow Showers", icon: "snow-heavy", theme: "snowy" },
  95: { description: "Thunderstorm", icon: "thunderstorm", theme: "thunder" },
  96: { description: "Thunderstorm with Hail", icon: "thunderstorm", theme: "thunder" },
  99: { description: "Heavy Thunderstorm", icon: "thunderstorm", theme: "thunder" }
};

export function getWeatherMeta(code, isDay = 1) {
  const meta = WMO_CODES[code] || { description: "Unknown", icon: "cloud", theme: "cloudy" };
  if (!isDay && meta.theme === "sunny") {
    return { ...meta, icon: "moon", theme: "cloudy" };
  }
  return meta;
}

/**
 * Search locations using Open-Meteo Geocoding API
 */
export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch location suggestions");
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("Geocoding API Error:", err);
    return [];
  }
}

/**
 * Fetch detailed weather forecast data for coordinates
 */
export async function fetchWeatherData(lat, lon) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,weather_code,pressure_msl,cloud_cover,visibility,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,wind_speed_10m_max&timezone=auto`;

  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`;

  try {
    const [weatherRes, aqiRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(aqiUrl).catch(() => null)
    ]);

    if (!weatherRes.ok) throw new Error("Weather API request failed");
    const weatherData = await weatherRes.json();
    let aqiData = null;
    if (aqiRes && aqiRes.ok) {
      aqiData = await aqiRes.json();
    }

    return {
      weather: weatherData,
      aqi: aqiData ? aqiData.current : null
    };
  } catch (err) {
    console.error("Fetch Weather Error:", err);
    throw err;
  }
}

/**
 * Convert Celsius to Fahrenheit
 */
export function cToF(celsius) {
  return (celsius * 9) / 5 + 32;
}

/**
 * Format temperature string according to active unit
 */
export function formatTemp(celsius, unit = 'C') {
  if (celsius === null || celsius === undefined) return '--';
  const val = unit === 'F' ? cToF(celsius) : celsius;
  return `${Math.round(val)}°`;
}
