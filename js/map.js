/* ==========================================================================
   Atmosphere Weather App - Leaflet Interactive Weather Map Module
   ========================================================================== */

let mapInstance = null;
let markerInstance = null;

export function initWeatherMap(lat, lon, cityName) {
  const mapElement = document.getElementById('leaflet-map');
  if (!mapElement || typeof L === 'undefined') return;

  if (!mapInstance) {
    // Initialize map
    mapInstance = L.map('leaflet-map', {
      zoomControl: false,
      attributionControl: false
    }).setView([lat, lon], 10);

    // Dark styled ArcGIS World Dark Gray base (No API key required, no watermark)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 16,
      attribution: 'Esri, DeLorme, NAVTEQ'
    }).addTo(mapInstance);

    // Dark styled city and boundary reference labels overlay
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 16
    }).addTo(mapInstance);

    L.control.zoom({ position: 'topright' }).addTo(mapInstance);

    // Custom Icon Marker
    const customIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `<div style="
        width: 24px;
        height: 24px;
        background: #6366f1;
        border: 3px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 0 15px rgba(99, 102, 241, 0.8);
      "></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    markerInstance = L.marker([lat, lon], { icon: customIcon }).addTo(mapInstance);
    markerInstance.bindPopup(`<b>${cityName}</b>`).openPopup();
  } else {
    // Update center and marker position
    mapInstance.setView([lat, lon], 10, { animate: true });
    if (markerInstance) {
      markerInstance.setLatLng([lat, lon]);
      markerInstance.bindPopup(`<b>${cityName}</b>`).openPopup();
    }
  }
}
