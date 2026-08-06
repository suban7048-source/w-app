/* ==========================================================================
   Atmosphere Weather App - UI Rendering & Visual Effects Module
   ========================================================================== */

import { getWeatherMeta, formatTemp } from './api.js';

// SVG Weather Icon Generator
export function getSVGIcon(iconName) {
  const icons = {
    'sun': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`,
    'moon': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
    'cloud': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19x-9 0A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
    'cloud-sun': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2"/><circle cx="12" cy="12" r="3"/><path d="M13 20H7a5 5 0 1 1 4.9-6H13a3.5 3.5 0 1 1 0 7Z"/></svg>`,
    'sun-cloud': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="4"/><path d="M10 2v2M3 10h2M4.93 4.93l1.41 1.41"/><path d="M19 19h-6a5 5 0 1 1 4.9-6H19a3.5 3.5 0 1 1 0 7Z"/></svg>`,
    'rain-light': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.89A6 6 0 0 1 10.15 9h.56A7 7 0 0 1 21 15"/><path d="M8 19v2M12 19v2M16 19v2"/></svg>`,
    'rain': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.89A6 6 0 0 1 10.15 9h.56A7 7 0 0 1 21 15"/><path d="M8 18l-1 3M12 18l-1 3M16 18l-1 3"/></svg>`,
    'rain-heavy': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.89A6 6 0 0 1 10.15 9h.56A7 7 0 0 1 21 15"/><path d="M8 17l-2 4M12 17l-2 4M16 17l-2 4"/></svg>`,
    'drizzle': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.89A6 6 0 0 1 10.15 9h.56A7 7 0 0 1 21 15"/><path d="M8 19v1M12 19v1M16 19v1"/></svg>`,
    'thunderstorm': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 15a4.5 4.5 0 0 0-1.79-8.71A7 7 0 0 0 3.5 12A6 6 0 0 0 4 15"/><path d="M13 13l-3 5h4l-2 5"/></svg>`,
    'snow': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.89A6 6 0 0 1 10.15 9h.56A7 7 0 0 1 21 15"/><path d="M8 18h.01M12 18h.01M16 18h.01M10 21h.01M14 21h.01"/></svg>`,
    'snow-light': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#bae6fd" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.89A6 6 0 0 1 10.15 9h.56A7 7 0 0 1 21 15"/><path d="M10 19h.01M14 19h.01"/></svg>`,
    'snow-heavy': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.89A6 6 0 0 1 10.15 9h.56A7 7 0 0 1 21 15"/><path d="M8 18h.01M12 18h.01M16 18h.01M8 21h.01M12 21h.01M16 21h.01"/></svg>`,
    'sleet': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.89A6 6 0 0 1 10.15 9h.56A7 7 0 0 1 21 15"/><path d="M11 18l-1 2M15 18h.01"/></svg>`,
    'fog': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 10h14M3 14h18M5 18h14"/></svg>`
  };

  return icons[iconName] || icons['cloud'];
}

// Global state for ambient particle canvas
let canvasAnimationId = null;

export function renderWeatherCanvas(theme) {
  const canvas = document.getElementById('weather-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.removeEventListener('resize', resize);
  window.addEventListener('resize', resize);

  if (canvasAnimationId) {
    cancelAnimationFrame(canvasAnimationId);
  }

  const particles = [];
  const particleCount = theme === 'rainy' ? 120 : theme === 'snowy' ? 70 : 35;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: theme === 'snowy' ? Math.random() * 3 + 1 : Math.random() * 1.5 + 0.5,
      length: theme === 'rainy' ? Math.random() * 18 + 10 : 0,
      speedY: theme === 'rainy' ? Math.random() * 10 + 12 : theme === 'snowy' ? Math.random() * 1.5 + 0.5 : Math.random() * 0.4 + 0.1,
      speedX: theme === 'rainy' ? -1 : theme === 'snowy' ? Math.sin(i) * 0.5 : Math.random() * 0.3 - 0.15,
      opacity: Math.random() * 0.5 + 0.2
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      ctx.beginPath();
      ctx.fillStyle = theme === 'snowy' ? `rgba(255, 255, 255, ${p.opacity})` : `rgba(186, 230, 253, ${p.opacity})`;
      ctx.strokeStyle = `rgba(147, 197, 253, ${p.opacity})`;
      ctx.lineWidth = 1.5;

      if (theme === 'rainy') {
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.speedX * 2, p.y + p.length);
        ctx.stroke();
      } else {
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      p.y += p.speedY;
      p.x += p.speedX;

      if (p.y > canvas.height) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }
      if (p.x > canvas.width) p.x = 0;
      if (p.x < 0) p.x = canvas.width;
    });

    canvasAnimationId = requestAnimationFrame(animate);
  }

  animate();
}

/**
 * Update Current Weather UI Box
 */
export function updateCurrentWeatherUI(data, locationName, countryName, unit = 'C') {
  const current = data.weather.current;
  const meta = getWeatherMeta(current.weather_code, current.is_day);

  // Set Body Theme
  document.body.className = `theme-${meta.theme}`;
  renderWeatherCanvas(meta.theme);

  // Update Location Name
  document.getElementById('current-city').textContent = locationName;
  document.getElementById('current-country').textContent = countryName ? `${countryName}` : '';
  document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Temperature and condition
  document.getElementById('current-temp-val').textContent = Math.round(unit === 'F' ? (current.temperature_2m * 9/5 + 32) : current.temperature_2m);
  document.getElementById('current-temp-unit').textContent = `°${unit}`;
  document.getElementById('current-condition-text').textContent = meta.description;
  document.getElementById('current-feels-like').textContent = `Feels like ${formatTemp(current.apparent_temperature, unit)}`;

  // Weather Icon
  const iconContainer = document.getElementById('current-weather-icon');
  iconContainer.innerHTML = getSVGIcon(meta.icon);

  // Update Metrics Grid
  renderMetricsGrid(current, data.weather.daily, data.aqi, unit);

  // Render Hourly Slider & 7-Day Forecast
  renderHourlyForecast(data.weather.hourly, current.is_day, unit);
  renderDailyForecast(data.weather.daily, unit);
}

/**
 * Render Metrics Grid Items (UV Index, Wind, Humidity, AQI, Pressure, Visibility)
 */
function renderMetricsGrid(current, daily, aqi, unit) {
  // UV Index
  const maxUv = daily.uv_index_max ? daily.uv_index_max[0] : 0;
  document.getElementById('metric-uv-val').textContent = maxUv ? maxUv.toFixed(1) : '--';
  const uvBadge = document.getElementById('metric-uv-badge');
  if (maxUv <= 2) { uvBadge.textContent = 'Low'; uvBadge.style.background = '#10b981'; }
  else if (maxUv <= 5) { uvBadge.textContent = 'Moderate'; uvBadge.style.background = '#f59e0b'; }
  else if (maxUv <= 7) { uvBadge.textContent = 'High'; uvBadge.style.background = '#f97316'; }
  else { uvBadge.textContent = 'Very High'; uvBadge.style.background = '#ef4444'; }

  // Wind Speed & Compass Direction
  const windKm = current.wind_speed_10m;
  const windVal = unit === 'F' ? `${Math.round(windKm * 0.621371)} mph` : `${Math.round(windKm)} km/h`;
  document.getElementById('metric-wind-val').textContent = windVal;
  document.getElementById('metric-wind-dir').textContent = `${getWindDirectionText(current.wind_direction_10m)} (${current.wind_direction_10m}°)`;
  const compassArrow = document.getElementById('compass-arrow');
  if (compassArrow) {
    compassArrow.style.transform = `rotate(${current.wind_direction_10m}deg)`;
  }

  // Humidity & Dew Point
  const humidity = current.relative_humidity_2m;
  document.getElementById('metric-humidity-val').textContent = `${humidity}%`;
  
  // Calculate approximate Dew Point from temp and humidity
  const tempC = current.temperature_2m;
  const dewPointC = tempC - ((100 - humidity) / 5);
  const dewPointElem = document.getElementById('metric-dewpoint-val');
  if (dewPointElem) {
    dewPointElem.textContent = `Dew point: ${formatTemp(dewPointC, unit)}`;
  }

  // Humidity Level Badge & Arrow Indicator
  const humidityBadge = document.getElementById('metric-humidity-badge');
  const humidityArrow = document.getElementById('humidity-arrow');
  if (humidityBadge) {
    if (humidity <= 30) {
      humidityBadge.textContent = 'Dry';
      humidityBadge.style.background = '#38bdf8';
      if (humidityArrow) humidityArrow.style.transform = 'rotate(180deg)'; // Arrow down (Low)
    } else if (humidity <= 60) {
      humidityBadge.textContent = 'Optimal';
      humidityBadge.style.background = '#10b981';
      if (humidityArrow) humidityArrow.style.transform = 'rotate(90deg)'; // Arrow side (Normal)
    } else if (humidity <= 80) {
      humidityBadge.textContent = 'Humid';
      humidityBadge.style.background = '#f59e0b';
      if (humidityArrow) humidityArrow.style.transform = 'rotate(0deg)'; // Arrow up (High)
    } else {
      humidityBadge.textContent = 'Very Humid';
      humidityBadge.style.background = '#ef4444';
      if (humidityArrow) humidityArrow.style.transform = 'rotate(0deg)'; // Arrow up (Very High)
    }
  }

  // Air Quality (AQI)
  const aqiVal = aqi ? aqi.us_aqi : null;
  const aqiElem = document.getElementById('metric-aqi-val');
  const aqiBadge = document.getElementById('metric-aqi-badge');
  if (aqiVal !== null && aqiVal !== undefined) {
    aqiElem.textContent = aqiVal;
    if (aqiVal <= 50) { aqiBadge.textContent = 'Good'; aqiBadge.style.background = '#10b981'; }
    else if (aqiVal <= 100) { aqiBadge.textContent = 'Moderate'; aqiBadge.style.background = '#f59e0b'; }
    else if (aqiVal <= 150) { aqiBadge.textContent = 'Unhealthy (SG)'; aqiBadge.style.background = '#f97316'; }
    else { aqiBadge.textContent = 'Unhealthy'; aqiBadge.style.background = '#ef4444'; }
  } else {
    aqiElem.textContent = 'N/A';
    aqiBadge.textContent = 'Normal';
    aqiBadge.style.background = '#64748b';
  }

  // Pressure
  document.getElementById('metric-pressure-val').textContent = `${Math.round(current.pressure_msl)} hPa`;

  // Sunrise / Sunset
  if (daily.sunrise && daily.sunset) {
    const sunriseTime = new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunsetTime = new Date(daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('metric-sunrise-val').textContent = sunriseTime;
    document.getElementById('metric-sunset-val').textContent = sunsetTime;
  }
}

function getWindDirectionText(degree) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(degree / 45) % 8];
}

/**
 * Render 24-Hour Slider
 */
function renderHourlyForecast(hourly, isDay, unit) {
  const container = document.getElementById('hourly-container');
  if (!container) return;

  const currentHourIndex = new Date().getHours();
  const next24 = [];

  for (let i = currentHourIndex; i < currentHourIndex + 24 && i < hourly.time.length; i++) {
    const timeStr = hourly.time[i];
    const date = new Date(timeStr);
    const timeLabel = i === currentHourIndex ? 'Now' : date.toLocaleTimeString([], { hour: 'numeric' });
    const code = hourly.weather_code[i];
    const temp = hourly.temperature_2m[i];
    const pop = hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0;
    const meta = getWeatherMeta(code, date.getHours() >= 6 && date.getHours() <= 19 ? 1 : 0);

    next24.push(`
      <div class="hourly-card ${i === currentHourIndex ? 'active' : ''}">
        <span class="hourly-time">${timeLabel}</span>
        <div class="hourly-icon">${getSVGIcon(meta.icon)}</div>
        <span class="hourly-temp">${formatTemp(temp, unit)}</span>
        ${pop > 10 ? `<span class="hourly-pop">💧 ${pop}%</span>` : ''}
      </div>
    `);
  }

  container.innerHTML = next24.join('');
}

/**
 * Render 7-Day Forecast List
 */
function renderDailyForecast(daily, unit) {
  const container = document.getElementById('daily-list');
  if (!container) return;

  let minGlobal = Math.min(...daily.temperature_2m_min);
  let maxGlobal = Math.max(...daily.temperature_2m_max);
  const range = maxGlobal - minGlobal || 1;

  const html = daily.time.map((timeStr, idx) => {
    const date = new Date(timeStr);
    const dayName = idx === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
    const code = daily.weather_code[idx];
    const minTemp = daily.temperature_2m_min[idx];
    const maxTemp = daily.temperature_2m_max[idx];
    const meta = getWeatherMeta(code, 1);

    const leftPercent = Math.max(0, Math.min(100, ((minTemp - minGlobal) / range) * 100));
    const widthPercent = Math.max(15, Math.min(100 - leftPercent, ((maxTemp - minTemp) / range) * 100));

    return `
      <div class="daily-row">
        <span class="daily-day">${dayName}</span>
        <div class="daily-icon">${getSVGIcon(meta.icon)}</div>
        <div class="daily-temp-bar-container">
          <div class="temp-bar-bg">
            <div class="temp-bar-fill" style="left: ${leftPercent}%; width: ${widthPercent}%;"></div>
          </div>
        </div>
        <div class="daily-temps">
          <span class="daily-max">${formatTemp(maxTemp, unit)}</span>
          <span class="daily-min">${formatTemp(minTemp, unit)}</span>
        </div>
      </div>
    `;
  });

  container.innerHTML = html.join('');
}

/**
 * Render Favorites Bar
 */
export function renderFavoritesBar(favorites, onSelect, onRemove) {
  const container = document.getElementById('favorites-bar');
  if (!container) return;

  if (!favorites || favorites.length === 0) {
    container.innerHTML = `<span style="font-size: 0.82rem; color: var(--text-muted);">No saved favorite cities. Search and click ⭐ to pin!</span>`;
    return;
  }

  container.innerHTML = favorites.map((fav, index) => `
    <div class="favorite-chip" data-index="${index}">
      <span>📍 ${fav.name}</span>
      <span class="remove-fav" data-remove="${index}">&times;</span>
    </div>
  `).join('');

  container.querySelectorAll('.favorite-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const removeIndex = e.target.getAttribute('data-remove');
      if (removeIndex !== null) {
        e.stopPropagation();
        onRemove(parseInt(removeIndex, 10));
      } else {
        const idx = parseInt(chip.getAttribute('data-index'), 10);
        onSelect(favorites[idx]);
      }
    });
  });
}
