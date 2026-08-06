# 🌤️ Atmosphere - Modern Weather Web App

![GitHub stars](https://img.shields.io/github/stars/user/weather?style=for-the-badge&color=6366f1)
![GitHub forks](https://img.shields.io/github/forks/user/weather?style=for-the-badge&color=38bdf8)
![GitHub license](https://img.shields.io/github/license/user/weather?style=for-the-badge&color=10b981)
![GitHub Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-blue?style=for-the-badge&logo=github)

**Atmosphere** is a state-of-the-art, high-performance weather forecast web application built with **Vanilla HTML5, CSS3 (Glassmorphism), and JavaScript (ES6+)**. Powered by the free, open-access **Open-Meteo API**, Atmosphere offers real-time weather tracking, 24-hour hourly forecast sliders, 7-day outlooks, Air Quality Index (AQI) monitoring, and interactive Leaflet map views without requiring any API keys.

---

## ✨ Features

- 🌐 **Global City Search & Geocoding**: Instant search with debounced autocomplete for cities worldwide.
- 📍 **GPS Geolocation**: Detect current user position with one click.
- 🌡️ **Dual Unit Support**: Toggle seamlessly between Celsius (°C) and Fahrenheit (°F).
- 🎨 **Dynamic Weather Canvas**: Ambient particle visual effects (Rain drops, Snowflakes, Sun shine glow) automatically matching real-time weather conditions.
- 📊 **Detailed Weather Metrics Grid**:
  - **UV Index** scale (Low to Very High)
  - **Wind Speed & Direction Compass**
  - **Relative Humidity** level
  - **Air Quality Index (AQI)** US Standard
  - **Atmospheric Pressure** (hPa)
  - **Sunrise & Sunset** timings
- ⏱️ **24-Hour Forecast Slider**: Horizontal interactive hourly forecast with precipitation probability indicators.
- 📅 **7-Day Daily Forecast**: Min/max temperature bar ranges and weather condition badges.
- 🗺️ **Interactive Location Map**: Dark-themed Leaflet.js map centered on selected city coordinates.
- ⭐ **Favorites / Saved Cities**: Save favorite locations in browser `localStorage` for 1-click access.
- 📱 **Fully Responsive & Accessible**: Optimized for desktop, tablet, and mobile screens.
- 🚀 **Zero Dependencies / No Build Step Required**: Standard web technology stack ready for instant GitHub Pages deployment.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla JavaScript (ES6 Modules)
- **Styling**: Modern CSS3 (CSS Variables, Flexbox/Grid, Glassmorphism, CSS Keyframe Animations)
- **APIs**:
  - [Open-Meteo Forecast API](https://open-meteo.com/) (Weather & Hourly/Daily data)
  - [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) (City search)
  - [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api) (AQI & pollutants)
- **Mapping**: [Leaflet.js](https://leafletjs.com/) with CartoDB Dark Matter basemap tiles

---

## 🚀 Quick Start & Local Setup

Since Atmosphere is built using standard ES6 modules without heavy bundlers, you can run it locally with any local HTTP server:

```bash
# Clone the repository
git clone https://github.com/your-username/atmosphere-weather.git

# Navigate to directory
cd atmosphere-weather

# Run using Python built-in server (or VS Code Live Server / npx serve)
python -m http.server 8000
```

Open `http://localhost:8000` in your web browser.

---

## 📦 GitHub Pages Deployment

This repository includes a pre-configured **GitHub Actions Workflow** (`.github/workflows/deploy.yml`) for automated deployment.

To deploy to GitHub Pages:
1. Push this repository to GitHub.
2. Go to repository **Settings** -> **Pages**.
3. Under **Source**, select **GitHub Actions**.
4. Any push to `main` branch will automatically build and publish the live web app!

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.
