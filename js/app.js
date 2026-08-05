/* ==========================================================================
   Atmosphere Weather App - Main Entry Point & App Controller
   ========================================================================== */

import { searchLocations, fetchWeatherData } from './api.js';
import { updateCurrentWeatherUI, renderFavoritesBar } from './ui.js';
import { initWeatherMap } from './map.js';

// Application State
const state = {
  activeUnit: localStorage.getItem('weather_unit') || 'C',
  currentLocation: {
    name: 'London',
    country: 'United Kingdom',
    lat: 51.5074,
    lon: -0.1278
  },
  weatherData: null,
  favorites: JSON.parse(localStorage.getItem('weather_favorites') || '[]')
};

// Default featured cities for fallback
const DEFAULT_CITIES = [
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.0060 },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 }
];

document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  renderFavoritesBar(state.favorites, loadLocation, removeFavorite);

  // Initial Weather Load: Try Geolocation or Default to London
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        await loadWeatherForCoords(latitude, longitude, "My Location", "");
      },
      async () => {
        await loadLocation(state.currentLocation);
      },
      { timeout: 5000 }
    );
  } else {
    loadLocation(state.currentLocation);
  }
});

function initEventListeners() {
  // Search Input & Suggestions
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const searchForm = document.getElementById('search-form');
  const locateBtn = document.getElementById('locate-btn');
  const favToggleBtn = document.getElementById('fav-toggle-btn');
  
  // Unit Switches
  const unitC = document.getElementById('unit-c');
  const unitF = document.getElementById('unit-f');

  let debounceTimer = null;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    clearTimeout(debounceTimer);

    if (query.trim().length < 2) {
      searchResults.classList.remove('active');
      searchResults.innerHTML = '';
      return;
    }

    debounceTimer = setTimeout(async () => {
      const results = await searchLocations(query);
      renderSearchResults(results);
    }, 300);
  });

  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      const results = await searchLocations(query);
      if (results.length > 0) {
        selectLocationResult(results[0]);
      }
    }
  });

  // Close search results when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      searchResults.classList.remove('active');
    }
  });

  // Geolocation Button
  locateBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
      locateBtn.classList.add('spinner');
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          locateBtn.classList.remove('spinner');
          const { latitude, longitude } = pos.coords;
          await loadWeatherForCoords(latitude, longitude, "My Location", "");
        },
        (err) => {
          locateBtn.classList.remove('spinner');
          alert("Location access denied or unavailable. Loading London instead.");
          loadLocation(state.currentLocation);
        }
      );
    }
  });

  // Unit Switch Handlers
  unitC.addEventListener('click', () => setUnit('C'));
  unitF.addEventListener('click', () => setUnit('F'));

  // Favorite Button
  favToggleBtn.addEventListener('click', () => {
    toggleCurrentFavorite();
  });
}

function renderSearchResults(results) {
  const container = document.getElementById('search-results');
  if (!results || results.length === 0) {
    container.innerHTML = `<div class="search-item"><span class="search-item-title">No cities found</span></div>`;
    container.classList.add('active');
    return;
  }

  container.innerHTML = results.map((item) => `
    <div class="search-item" data-lat="${item.latitude}" data-lon="${item.longitude}" data-name="${item.name}" data-country="${item.country || item.admin1 || ''}">
      <div class="search-item-info">
        <span class="search-item-title">${item.name}</span>
        <span class="search-item-sub">${[item.admin1, item.country].filter(Boolean).join(', ')}</span>
      </div>
    </div>
  `).join('');

  container.classList.add('active');

  container.querySelectorAll('.search-item').forEach(el => {
    el.addEventListener('click', () => {
      const item = {
        name: el.getAttribute('data-name'),
        country: el.getAttribute('data-country'),
        lat: parseFloat(el.getAttribute('data-lat')),
        lon: parseFloat(el.getAttribute('data-lon'))
      };
      selectLocationResult(item);
    });
  });
}

function selectLocationResult(item) {
  document.getElementById('search-results').classList.remove('active');
  document.getElementById('search-input').value = '';
  loadLocation(item);
}

async function loadLocation(loc) {
  state.currentLocation = loc;
  await loadWeatherForCoords(loc.lat, loc.lon, loc.name, loc.country);
}

async function loadWeatherForCoords(lat, lon, name, country) {
  const primaryCard = document.querySelector('.weather-card-primary');
  if (primaryCard) primaryCard.style.opacity = '0.7';

  try {
    const data = await fetchWeatherData(lat, lon);
    state.weatherData = data;
    state.currentLocation = { name, country, lat, lon };

    updateCurrentWeatherUI(data, name, country, state.activeUnit);
    initWeatherMap(lat, lon, name);
    updateFavButtonState();

  } catch (err) {
    alert("Could not load weather data. Please check your internet connection.");
    console.error(err);
  } finally {
    if (primaryCard) primaryCard.style.opacity = '1';
  }
}

function setUnit(unit) {
  if (state.activeUnit === unit) return;
  state.activeUnit = unit;
  localStorage.setItem('weather_unit', unit);

  document.getElementById('unit-c').classList.toggle('active', unit === 'C');
  document.getElementById('unit-f').classList.toggle('active', unit === 'F');

  if (state.weatherData && state.currentLocation) {
    updateCurrentWeatherUI(state.weatherData, state.currentLocation.name, state.currentLocation.country, state.activeUnit);
  }
}

function toggleCurrentFavorite() {
  const current = state.currentLocation;
  const existingIdx = state.favorites.findIndex(f => f.name.toLowerCase() === current.name.toLowerCase());

  if (existingIdx >= 0) {
    state.favorites.splice(existingIdx, 1);
  } else {
    state.favorites.push(current);
  }

  localStorage.setItem('weather_favorites', JSON.stringify(state.favorites));
  updateFavButtonState();
  renderFavoritesBar(state.favorites, loadLocation, removeFavorite);
}

function removeFavorite(index) {
  state.favorites.splice(index, 1);
  localStorage.setItem('weather_favorites', JSON.stringify(state.favorites));
  updateFavButtonState();
  renderFavoritesBar(state.favorites, loadLocation, removeFavorite);
}

function updateFavButtonState() {
  const favBtn = document.getElementById('fav-toggle-btn');
  if (!favBtn || !state.currentLocation) return;
  const isFav = state.favorites.some(f => f.name.toLowerCase() === state.currentLocation.name.toLowerCase());
  favBtn.classList.toggle('active', isFav);
  favBtn.innerHTML = isFav ? '★' : '☆';
}
