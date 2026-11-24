/**
 * VayuSaathi - Master Frontend Application
 * Minimalist, human-designed UI with high-precision geolocation,
 * spatial monitoring network, multi-layer Leaflet map, and live CPCB NAQI analysis.
 */

const api = window.api || (typeof self !== 'undefined' ? self.api : null);

// Vector Icon System (Lucide / Feather-inspired SVG strokes)
const icons = {
  overview: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>`,
  map: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
  chat: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  shield: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  calendar: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  clock: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  home: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  leaf: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
  users: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  chart: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>`,
  bell: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  settings: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  play: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  crosshair: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>`,
  sun: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  moon: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  check: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
  alert: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  send: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  plus: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  thumbsUp: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>`,
  info: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  x: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  refresh: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
  wind: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>`,
  sparkles: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
  search: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  layers: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  navigation: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`,
  key: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="m21 2-2 2m-1.5 1.5L14 9l-2-2-4 4 1.5 1.5L9 14l-2 2H3v4h4l2-2 1.5 1.5L12 18l4-4 3.5-3.5M20 7l-2-2"/><circle cx="7.5" cy="16.5" r=".5" fill="currentColor"/></svg>`,
  maximize: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
  minimize: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="10" y1="14" x2="3" y2="21"/></svg>`,
  download: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  trash: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  sliders: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`
};

// Comprehensive Regional Environmental Monitoring Stations Network (CPCB & Urban Corridors)
const ALL_STATIONS = [
  // Delhi NCR Hotspots
  { id: "anand_vihar", name: "Anand Vihar, Delhi", city: "Delhi", lat: 28.6502, lon: 77.3150, aqi: 442, cat: "Severe", pm25: 288, pm10: 460, dominant: "PM2.5", reason: "Interstate bus terminal emissions, boundary dust, dense vehicular idling hotspot." },
  { id: "punjabi_bagh", name: "Punjabi Bagh, Delhi", city: "Delhi", lat: 28.6740, lon: 77.1310, aqi: 388, cat: "Very Poor", pm25: 225, pm10: 365, dominant: "PM2.5", reason: "Heavy commercial ring-road traffic, diesel freight passage." },
  { id: "ito_junction", name: "ITO Junction, Delhi", city: "Delhi", lat: 28.6300, lon: 77.2400, aqi: 375, cat: "Very Poor", pm25: 210, pm10: 345, dominant: "PM2.5", reason: "Dense administrative vehicular bottleneck, thermal trapping." },
  { id: "rk_puram", name: "RK Puram, Delhi", city: "Delhi", lat: 28.5630, lon: 77.1860, aqi: 362, cat: "Very Poor", pm25: 195, pm10: 330, dominant: "PM2.5", reason: "Urban canopy boundary layer stagnation." },
  { id: "lodhi_road", name: "Lodhi Road, Delhi", city: "Delhi", lat: 28.5918, lon: 77.2273, aqi: 310, cat: "Very Poor", pm25: 160, pm10: 280, dominant: "PM2.5", reason: "Central institutional green zone buffer with background urban haze." },
  { id: "dwarka_sec8", name: "Dwarka Sector 8, Delhi", city: "Delhi", lat: 28.5710, lon: 77.0715, aqi: 345, cat: "Very Poor", pm25: 182, pm10: 310, dominant: "PM2.5", reason: "Airport corridor emissions, open sub-city wind drift." },
  { id: "rohini_sec16", name: "Rohini Sector 16, Delhi", city: "Delhi", lat: 28.7325, lon: 77.1199, aqi: 395, cat: "Very Poor", pm25: 235, pm10: 380, dominant: "PM2.5", reason: "Northwest regional biomass drift, high residential density." },
  { id: "okhla_phase2", name: "Okhla Phase 2, Delhi", city: "Delhi", lat: 28.5308, lon: 77.2713, aqi: 412, cat: "Severe", pm25: 260, pm10: 420, dominant: "PM2.5", reason: "Industrial manufacturing corridor and freight vehicle congestion." },
  { id: "jahangirpuri", name: "Jahangirpuri, Delhi", city: "Delhi", lat: 28.7328, lon: 77.1706, aqi: 438, cat: "Severe", pm25: 280, pm10: 450, dominant: "PM2.5", reason: "Landfill perimeter, heavy commercial transport corridor." },
  { id: "mandir_marg", name: "Mandir Marg, Delhi", city: "Delhi", lat: 28.6360, lon: 77.2010, aqi: 325, cat: "Very Poor", pm25: 170, pm10: 295, dominant: "PM2.5", reason: "Central ridge proximity with elevated vehicular rush." },
  // Noida & Greater Noida
  { id: "noida_sec62", name: "Noida Sector 62", city: "Noida", lat: 28.6270, lon: 77.3650, aqi: 348, cat: "Very Poor", pm25: 185, pm10: 322, dominant: "PM2.5", reason: "Expressway construction dust and cross-boundary haze." },
  { id: "noida_sec125", name: "Noida Sector 125", city: "Noida", lat: 28.5447, lon: 77.3331, aqi: 330, cat: "Very Poor", pm25: 172, pm10: 300, dominant: "PM2.5", reason: "Yamuna floodplains thermal inversion trap." },
  { id: "gnoida_kp3", name: "Knowledge Park III, Greater Noida", city: "Greater Noida", lat: 28.4727, lon: 77.4891, aqi: 315, cat: "Very Poor", pm25: 162, pm10: 285, dominant: "PM2.5", reason: "Open development corridors and regional particulate drift." },
  // Gurugram & Faridabad
  { id: "gurugram_cyber", name: "Gurugram Cyber Hub", city: "Gurugram", lat: 28.4900, lon: 77.0900, aqi: 320, cat: "Very Poor", pm25: 165, pm10: 298, dominant: "PM2.5", reason: "Diesel generator backups, highway commute surges." },
  { id: "gurugram_sec51", name: "Gurugram Sector 51", city: "Gurugram", lat: 28.4290, lon: 77.0712, aqi: 305, cat: "Very Poor", pm25: 155, pm10: 275, dominant: "PM2.5", reason: "Residential expansion and transit corridors." },
  { id: "faridabad_sec16", name: "Faridabad Sector 16A", city: "Faridabad", lat: 28.4089, lon: 77.3178, aqi: 360, cat: "Very Poor", pm25: 192, pm10: 330, dominant: "PM2.5", reason: "Industrial fringe emissions and highway freight transit." },
  // Ghaziabad
  { id: "ghaziabad_vasu", name: "Ghaziabad Vasundhara", city: "Ghaziabad", lat: 28.6600, lon: 77.3800, aqi: 435, cat: "Severe", pm25: 275, pm10: 440, dominant: "PM2.5", reason: "Industrial fringe emissions and biomass open burning." },
  { id: "ghaziabad_sanjay", name: "Ghaziabad Sanjay Nagar", city: "Ghaziabad", lat: 28.6853, lon: 77.4538, aqi: 418, cat: "Severe", pm25: 265, pm10: 425, dominant: "PM2.5", reason: "Dense urban stagnation, local factory drift." },
  // Mumbai
  { id: "mumbai_bkc", name: "Mumbai Bandra Kurla Complex", city: "Mumbai", lat: 19.0657, lon: 72.8680, aqi: 162, cat: "Moderate", pm25: 78, pm10: 145, dominant: "PM10", reason: "Commercial hub traffic; coastal breeze mitigates inversion peaks." },
  { id: "mumbai_colaba", name: "Mumbai Colaba", city: "Mumbai", lat: 18.9067, lon: 72.8147, aqi: 110, cat: "Moderate", pm25: 45, pm10: 98, dominant: "PM10", reason: "Coastal peninsula ventilation clears particulate buildup." },
  { id: "mumbai_borivali", name: "Mumbai Borivali East", city: "Mumbai", lat: 19.2288, lon: 72.8541, aqi: 145, cat: "Moderate", pm25: 62, pm10: 125, dominant: "PM10", reason: "National park boundary with highway traffic drift." },
  // Bengaluru
  { id: "blr_whitefield", name: "Bengaluru Whitefield", city: "Bengaluru", lat: 12.9698, lon: 77.7500, aqi: 88, cat: "Satisfactory", pm25: 38, pm10: 75, dominant: "PM2.5", reason: "Plateau breeze clearing; localized tech-park traffic." },
  { id: "blr_btm", name: "Bengaluru BTM Layout", city: "Bengaluru", lat: 12.9166, lon: 77.6101, aqi: 95, cat: "Satisfactory", pm25: 42, pm10: 82, dominant: "PM2.5", reason: "Outer Ring Road junction vehicular emissions." },
  { id: "blr_peenya", name: "Bengaluru Peenya", city: "Bengaluru", lat: 13.0285, lon: 77.5197, aqi: 135, cat: "Moderate", pm25: 58, pm10: 120, dominant: "PM10", reason: "Major industrial manufacturing estate." },
  // Kolkata
  { id: "kol_victoria", name: "Kolkata Victoria Memorial", city: "Kolkata", lat: 22.5448, lon: 88.3426, aqi: 245, cat: "Poor", pm25: 110, pm10: 210, dominant: "PM2.5", reason: "Central urban park boundary with arterial traffic drift." },
  { id: "kol_rbu", name: "Kolkata Rabindra Bharati", city: "Kolkata", lat: 22.6279, lon: 88.3784, aqi: 285, cat: "Poor", pm25: 135, pm10: 255, dominant: "PM2.5", reason: "North Kolkata vehicular congestion and winter thermal stagnation." },
  // Hyderabad
  { id: "hyd_sanath", name: "Hyderabad Sanathnagar", city: "Hyderabad", lat: 17.4565, lon: 78.4439, aqi: 125, cat: "Moderate", pm25: 52, pm10: 115, dominant: "PM2.5", reason: "Industrial manufacturing and commercial transit corridor." },
  // Chennai
  { id: "chn_alandur", name: "Chennai Alandur", city: "Chennai", lat: 12.9975, lon: 80.2005, aqi: 92, cat: "Satisfactory", pm25: 39, pm10: 78, dominant: "PM2.5", reason: "Coastal ventilation with airport road traffic flow." },
  // Lucknow
  { id: "lko_talkatora", name: "Lucknow Talkatora", city: "Lucknow", lat: 26.8323, lon: 80.8998, aqi: 340, cat: "Very Poor", pm25: 180, pm10: 310, dominant: "PM2.5", reason: "Industrial area and winter river basin inversion trapping." },
  // Patna
  { id: "pat_samanpura", name: "Patna Samanpura", city: "Patna", lat: 25.6127, lon: 85.0833, aqi: 375, cat: "Very Poor", pm25: 205, pm10: 340, dominant: "PM2.5", reason: "Riverine basin calm stagnation, unpaved road dust." }
];

// Spatial Math & Haversine Distance
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function findNearestStation(lat, lon) {
  let minKm = 999999;
  let nearest = ALL_STATIONS[0];
  for (const st of ALL_STATIONS) {
    const d = getDistanceKm(lat, lon, st.lat, st.lon);
    if (d < minKm) {
      minKm = d;
      nearest = st;
    }
  }
  return { station: nearest, distanceKm: minKm };
}

// Client-side Reverse Geocoding with Graceful Fallback
async function reverseGeocode(lat, lon) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
      { signal: controller.signal, headers: { 'Accept': 'application/json' } }
    );
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const neighborhood = addr.suburb || addr.neighbourhood || addr.residential || addr.city_district || addr.quarter || addr.town || addr.city;
      const city = addr.city || addr.state_district || addr.state;
      if (neighborhood && city && neighborhood !== city) {
        return `${neighborhood}, ${city}`;
      } else if (neighborhood) {
        return neighborhood;
      } else if (city) {
        return city;
      }
    }
  } catch (e) {
    // Offline or network timeout
  }
  return null;
}

// Application State
const state = {
  currentView: 'dashboard',
  theme: localStorage.getItem('vayusaathi_theme') || localStorage.getItem('hawawise_theme') || 'dark',
  tempUnit: localStorage.getItem('vayusaathi_temp_unit') || localStorage.getItem('hawawise_temp_unit') || 'C',
  currentCity: 'Delhi NCR',
  userCoords: null, // { lat, lon, accuracy, locality, timestamp }
  gpsInsight: '',
  gpsInsightProvider: '',
  gpsInsightLoading: false,
  gpsInsightRequestId: 0,
  lastGpsAqiAt: 0,
  lastGpsAqiCoords: null,
  isLocating: false,
  isTracking: false,
  watchId: null,
  nearestStation: null,
  mapLayer: localStorage.getItem('vayusaathi_map_layer') || 'google_streets', // 'google_streets' | 'google_satellite' | 'google_hybrid' | 'google_terrain' | 'google_traffic' | 'dark' | 'osm'
  googleMapsKey: localStorage.getItem('vayusaathi_google_maps_key') || '',
  autoLocate: localStorage.getItem('vayusaathi_auto_locate') !== 'false',
  mapZoomLevel: parseInt(localStorage.getItem('vayusaathi_map_zoom') || '11'),
  highContrast: localStorage.getItem('vayusaathi_high_contrast') === 'true',
  refreshInterval: parseInt(localStorage.getItem('vayusaathi_refresh_interval') || '5'),
  aiPersona: localStorage.getItem('vayusaathi_ai_persona') || 'scientist',
  isMapFullscreen: false,
  mapFilter: 'all', // 'all' | 'severe' | 'very_poor' | 'poor_mod' | 'good'
  mapSearchQuery: '',
  mapSort: 'proximity',
  inspectedPoint: null,
  cities: [],
  airQuality: null,
  profile: null,
  chatMessages: [],
  alerts: [],
  impactStats: null,
  iaqData: null,
  currentRoutine: null,
  savedRoutines: [],
  communityHub: null,
  tripDistanceKm: 15.0,
  isGeneratingAI: false,
  demoModeActive: false,
  charts: {}
};

// Application Initialization
document.addEventListener('DOMContentLoaded', async () => {
  applyTheme(state.theme);
  setupNavigation();
  setupGlobalModals();
  await loadInitialData();
  checkAutoLocation();
  renderCurrentView();
});

// Theme Management
function applyTheme(theme) {
  state.theme = theme;
  localStorage.setItem('vayusaathi_theme', theme);
  localStorage.setItem('hawawise_theme', theme);
  const sunIcons = document.querySelectorAll('.theme-sun-icon');
  const moonIcons = document.querySelectorAll('.theme-moon-icon');

  if (theme === 'light') {
    document.documentElement.classList.add('light-theme');
    sunIcons.forEach(i => i.classList.add('hidden'));
    moonIcons.forEach(i => i.classList.remove('hidden'));
  } else {
    document.documentElement.classList.remove('light-theme');
    sunIcons.forEach(i => i.classList.remove('hidden'));
    moonIcons.forEach(i => i.classList.add('hidden'));
  }
}

// Temperature Formatter
function formatTemp(celsius) {
  if (celsius === undefined || celsius === null) return '--';
  if (state.tempUnit === 'F') {
    return `${Math.round((celsius * 9 / 5) + 32)}°F`;
  }
  return `${celsius}°C`;
}

// Navigation & Router
function setupNavigation() {
  const navLinks = document.querySelectorAll('[data-view]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const view = link.getAttribute('data-view');
      navigateTo(view);
    });
  });

  const themeToggle = document.getElementById('theme-toggle-btn');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      applyTheme(state.theme === 'dark' ? 'light' : 'dark');
    });
  }

  const mobileThemeToggle = document.getElementById('mobile-theme-toggle-btn');
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', () => {
      applyTheme(state.theme === 'dark' ? 'light' : 'dark');
    });
  }

  const headerGps = document.getElementById('header-gps-btn');
  if (headerGps) {
    headerGps.addEventListener('click', () => {
      detectUserLocation(false);
    });
  }

  const mobileToggle = document.getElementById('mobile-menu-btn');
  const mobileClose = document.getElementById('mobile-sidebar-close');
  const sidebar = document.getElementById('sidebar');
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('hidden');
    });
  }
  if (mobileClose && sidebar) {
    mobileClose.addEventListener('click', () => {
      sidebar.classList.add('hidden');
    });
  }
}

function navigateTo(viewName) {
  state.currentView = viewName;
  document.querySelectorAll('[data-view]').forEach(l => {
    if (l.getAttribute('data-view') === viewName) {
      l.classList.add('nav-tab-active');
    } else {
      l.classList.remove('nav-tab-active');
    }
  });
  renderCurrentView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initial Data Fetch
async function loadInitialData() {
  try {
    const [cityData, aqData, profileData, alertData, impactData] = await Promise.all([
      api ? api.getCities() : null,
      api ? api.getAirQuality(state.currentCity) : null,
      api ? api.getProfile() : null,
      api ? api.getAlerts() : null,
      api ? api.getImpactStats() : null
    ]);

    state.cities = cityData?.cities || [];
    state.airQuality = aqData;
    state.profile = profileData || {};
    state.alerts = alertData?.alerts || [];
    state.impactStats = impactData || {};
  } catch (err) {
    console.error("Failed to load initial data:", err);
  }

  // Resilient defaults so the UI is immediately functional in any environment
  if (!state.cities || state.cities.length === 0) {
    state.cities = [
      { key: "Delhi NCR", name: "Delhi NCR, India", baseline_aqi: 388 },
      { key: "Mumbai", name: "Mumbai, Maharashtra", baseline_aqi: 142 },
      { key: "Bengaluru", name: "Bengaluru, Karnataka", baseline_aqi: 88 },
      { key: "Kolkata", name: "Kolkata, West Bengal", baseline_aqi: 265 },
      { key: "Hyderabad", name: "Hyderabad, Telangana", baseline_aqi: 132 },
      { key: "Chennai", name: "Chennai, Tamil Nadu", baseline_aqi: 95 },
      { key: "Lucknow", name: "Lucknow, Uttar Pradesh", baseline_aqi: 340 },
      { key: "Patna", name: "Patna, Bihar", baseline_aqi: 375 }
    ];
  }

  if (!state.airQuality && api?.getAirQuality) {
    try {
      state.airQuality = await api.getAirQuality(state.currentCity);
    } catch (e) {
      // Handled in renderDashboard
    }
  }

  updateTopHeaderMetrics();
}

// Check Geolocation Permission
async function checkAutoLocation() {
  if (!state.autoLocate) return;
  if (navigator.permissions && navigator.permissions.query) {
    try {
      const status = await navigator.permissions.query({ name: 'geolocation' });
      if (status.state === 'granted') {
        detectUserLocation(true);
      }
    } catch (e) {
      // Permission API not supported in some browsers
    }
  }
}

// High-Precision Geolocation Strategy with Smart Fallback
async function detectUserLocation(silent = false, centerMap = false) {
  if (state.isLocating) return;
  if (!navigator.geolocation) {
    if (!silent) alert("Geolocation is not supported by your browser. Please select a station manually.");
    return;
  }

  state.isLocating = true;
  updateLocationButtonsState(true);

  try {
    const pos = await getHighAccuracyPosition();
    const { latitude, longitude, accuracy, altitude, speed } = pos.coords;

    let localityName = null;
    try {
      localityName = await reverseGeocode(latitude, longitude);
    } catch (e) {
      // ignore
    }

    const nearest = findNearestStation(latitude, longitude);
    state.nearestStation = nearest;

    state.userCoords = {
      lat: latitude,
      lon: longitude,
      accuracy: Math.round(accuracy),
      altitude: altitude ? Math.round(altitude) : null,
      speed: speed ? Math.round(speed * 3.6) : null,
      locality: localityName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    // Query backend for air quality at these exact coordinates
    const aq = await api.getAirQuality("My GPS Location", latitude, longitude);
    if (localityName) {
      aq.city = localityName;
      aq.region = `GPS Accuracy: ±${Math.round(accuracy)}m • Nearest: ${nearest.station.name} (${nearest.distanceKm} km)`;
    }
    state.airQuality = aq;
    state.currentCity = aq.city;
    state.gpsInsight = '';
    state.gpsInsightProvider = '';
    state.gpsInsightLoading = true;
    state.lastGpsAqiAt = Date.now();
    state.lastGpsAqiCoords = { lat: latitude, lon: longitude };

    updateTopHeaderMetrics();

    // If map view is active, fly to user smoothly
    if (state.currentView === 'map' && window.leafletMapInstance) {
      updateMapUserPosition(latitude, longitude, accuracy, localityName, nearest);
    } else {
      renderCurrentView();
    }
    requestGpsAiBriefing(aq, state.userCoords);
  } catch (err) {
    if (!silent) {
      let msg = "Could not acquire location. Please check browser permissions or select a station manually.";
      if (err.code === 1) msg = "Location permission denied. Please allow location access in your browser address bar.";
      else if (err.code === 2) msg = "Location unavailable. Please select a station from the map or list.";
      else if (err.code === 3) msg = "Location request timed out. Retrying or select manually.";
      else if (err.code === 'LOW_ACCURACY') {
        msg = err.hasPosition
          ? `The device only reported location within ±${Math.round(err.accuracy / 1000)} km, which is too imprecise for local AQI. Enable device location services and try again outdoors.`
          : "A sufficiently accurate GPS fix was not available. Enable device location services, allow browser location access, and try again outdoors.";
      }
      alert(msg);
    }
  } finally {
    state.isLocating = false;
    updateLocationButtonsState(false);
  }
}

function getHighAccuracyPosition() {
  const targetAccuracyMeters = 150;
  const maximumAcceptableAccuracyMeters = 10000;
  const timeoutMs = 20000;

  return new Promise((resolve, reject) => {
    let bestPosition = null;
    let watchId = null;
    let timeoutId = null;
    const finish = (error, position) => {
      clearTimeout(timeoutId);
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (error) reject(error);
      else resolve(position);
    };

    timeoutId = setTimeout(() => {
      if (bestPosition && bestPosition.coords.accuracy <= maximumAcceptableAccuracyMeters) {
        finish(null, bestPosition);
        return;
      }
      const error = makeLowAccuracyError(bestPosition);
      finish(error);
    }, timeoutMs);

    const handlePositionError = (error) => {
      if (bestPosition && bestPosition.coords.accuracy <= maximumAcceptableAccuracyMeters) {
        finish(null, bestPosition);
        return;
      }
      finish(error);
    };

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const accuracy = position.coords.accuracy;
        if (!Number.isFinite(accuracy)) return;
        if (!bestPosition || accuracy < bestPosition.coords.accuracy) {
          bestPosition = position;
        }
        if (accuracy <= targetAccuracyMeters) finish(null, position);
      },
      handlePositionError,
      { enableHighAccuracy: true, timeout: timeoutMs + 1000, maximumAge: 0 }
    );

    function makeLowAccuracyError(position) {
      const error = new Error('Unable to get a sufficiently accurate location.');
      error.code = 'LOW_ACCURACY';
      error.hasPosition = Boolean(position);
      error.accuracy = position ? position.coords.accuracy : null;
      return error;
    }
  });
}

// Continuous Live Location Tracking (watchPosition)
function toggleLiveTracking() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  if (state.isTracking && state.watchId !== null) {
    navigator.geolocation.clearWatch(state.watchId);
    state.watchId = null;
    state.isTracking = false;
    renderCurrentView();
    return;
  }

  state.isTracking = true;
  state.watchId = navigator.geolocation.watchPosition(
    async (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      if (!Number.isFinite(accuracy) || accuracy > 10000) return;
      const nearest = findNearestStation(latitude, longitude);
      state.nearestStation = nearest;

      state.userCoords = {
        lat: latitude,
        lon: longitude,
        accuracy: Math.round(accuracy),
        locality: state.userCoords?.locality || null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };

      const previousCoords = state.lastGpsAqiCoords;
      const movedKm = previousCoords
        ? getDistanceKm(previousCoords.lat, previousCoords.lon, latitude, longitude)
        : Infinity;
      if (previousCoords && movedKm < 0.5 && Date.now() - state.lastGpsAqiAt < 120000) {
        if (state.currentView === 'dashboard') renderCurrentView();
        return;
      }

      const aq = await api.getAirQuality("My GPS Location", latitude, longitude);
      try {
        if (accuracy <= 10000) {
          state.userCoords.locality = await reverseGeocode(latitude, longitude);
        }
      } catch (error) {
        state.userCoords.locality = null;
      }
      state.airQuality = aq;
      state.currentCity = state.userCoords.locality || aq.city;
      state.lastGpsAqiAt = Date.now();
      state.lastGpsAqiCoords = { lat: latitude, lon: longitude };
      state.gpsInsight = '';
      state.gpsInsightProvider = '';
      state.gpsInsightLoading = true;
      updateTopHeaderMetrics();
      requestGpsAiBriefing(aq, state.userCoords);

      if (state.currentView === 'map' && window.leafletMapInstance) {
        updateMapUserPosition(latitude, longitude, accuracy, state.userCoords.locality, nearest);
      } else {
        renderCurrentView();
      }
    },
    (err) => {
      console.warn("Watch position error:", err);
      state.isTracking = false;
      if (state.watchId) navigator.geolocation.clearWatch(state.watchId);
      state.watchId = null;
    },
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
  );

  renderCurrentView();
}

function updateMapUserPosition(lat, lon, accuracy, localityName, nearest) {
  const map = window.leafletMapInstance;
  if (!map) return;

  // Remove existing user layer if present
  if (window.userMarkerGroup) {
    map.removeLayer(window.userMarkerGroup);
  }
  window.userMarkerGroup = L.layerGroup().addTo(map);

  // Precision circle buffer
  const circle = L.circle([lat, lon], {
    radius: Math.max(accuracy, 20),
    color: '#0284c7',
    fillColor: '#0284c7',
    fillOpacity: 0.12,
    weight: 1.5,
    dashArray: '4, 4'
  }).addTo(window.userMarkerGroup);

  // Inner dot
  const marker = L.circleMarker([lat, lon], {
    radius: 7,
    fillColor: '#0284c7',
    color: '#ffffff',
    weight: 2,
    opacity: 1,
    fillOpacity: 1
  }).addTo(window.userMarkerGroup);

  const locTitle = localityName || 'Your Location';
  marker.bindPopup(`
    <div class="p-1">
      <div class="font-semibold text-xs text-slate-100 flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
        <span>${locTitle}</span>
      </div>
      <div class="text-[11px] text-slate-400 mt-1">${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E</div>
      <div class="text-[11px] text-slate-300 mt-0.5">Accuracy: <strong>±${Math.round(accuracy)}m</strong></div>
      ${nearest ? `
        <div class="text-[11px] text-emerald-400 mt-1 pt-1 border-t border-slate-800">
          Nearest: <strong>${nearest.station.name}</strong> (${nearest.distanceKm} km)
        </div>
      ` : ''}
    </div>
  `).openPopup();

  map.flyTo([lat, lon], 14, { duration: 1.2 });
}

function updateLocationButtonsState(loading) {
  const gpsBtns = document.querySelectorAll('.btn-gps-trigger');
  gpsBtns.forEach(btn => {
    if (loading) {
      btn.innerHTML = `<span class="inline-block animate-spin mr-1.5">${icons.refresh}</span> Locating...`;
      btn.classList.add('opacity-70');
    } else {
      btn.innerHTML = `${icons.crosshair} <span>Location</span>`;
      btn.classList.remove('opacity-70');
    }
  });
}

async function requestGpsAiBriefing(aq, coords) {
  const requestId = ++state.gpsInsightRequestId;
  const pm25 = aq.pollutants?.pm2_5?.value;
  const pm10 = aq.pollutants?.pm10?.value;
  const weather = aq.weather || {};
  const locationName = coords.locality || aq.city || 'Your GPS location';
  const readingSource = aq.data_source_label || aq.data_source_type || 'Air-quality service';
  const locationAccuracy = Number.isFinite(coords.accuracy) ? `±${coords.accuracy} m` : 'not reported';
  const prompt = [
    `Create a concise, easy-to-understand live air-quality briefing for ${locationName}, identified using the user's current GPS location.`,
    `Current CPCB-style AQI: ${aq.aqi} (${aq.category}).`,
    `Measured/modelled pollutant readings: PM2.5 ${pm25 ?? 'unavailable'} ${aq.pollutants?.pm2_5?.unit || 'µg/m³'}, PM10 ${pm10 ?? 'unavailable'} ${aq.pollutants?.pm10?.unit || 'µg/m³'}, NO2 ${aq.pollutants?.no2?.value ?? 'unavailable'} ${aq.pollutants?.no2?.unit || 'µg/m³'}, SO2 ${aq.pollutants?.so2?.value ?? 'unavailable'} ${aq.pollutants?.so2?.unit || 'µg/m³'}, CO ${aq.pollutants?.co?.value ?? 'unavailable'} ${aq.pollutants?.co?.unit || 'mg/m³'}, O3 ${aq.pollutants?.o3?.value ?? 'unavailable'} ${aq.pollutants?.o3?.unit || 'µg/m³'}.`,
    `Weather: ${weather.temperature ?? 'unavailable'}°C, humidity ${weather.humidity ?? 'unavailable'}%, wind ${weather.wind_speed ?? 'unavailable'} km/h; inversion ${weather.temperature_inversion_detected ? 'detected' : 'not detected'}.`,
    `Data source: ${readingSource}. GPS accuracy: ${locationAccuracy}.`,
    'Explain the AQI category, the main pollutant, practical precautions for today, and data limitations. Do not claim that readings are measured at a government station unless the source says so. Keep it brief and avoid medical diagnosis.'
  ].join(' ');

  state.gpsInsightLoading = true;
  if (state.currentView === 'dashboard') renderCurrentView();

  try {
    const response = await api.sendMessage(
      [{ role: 'user', content: prompt }],
      {
        city: locationName,
        aqi: aq.aqi,
        category: aq.category,
        pm2_5: pm25,
        temperature_inversion: weather.temperature_inversion_detected,
        location_briefing: {
          location: locationName,
          coordinates: `${coords.lat.toFixed(5)}, ${coords.lon.toFixed(5)}`,
          aqi: aq.aqi,
          category: aq.category,
          dominant_pollutant: aq.dominant_pollutant,
          pollutants: aq.pollutants,
          weather,
          data_source: readingSource,
          accuracy: locationAccuracy,
          updated_at: aq.last_updated || aq.timestamp || new Date().toISOString()
        }
      }
    );
    if (requestId !== state.gpsInsightRequestId) return;
    state.gpsInsight = response.reply || 'The assistant did not return an air-quality briefing.';
    state.gpsInsightProvider = response.ai_provider || response.model_name || 'Environmental intelligence';
  } catch (error) {
    if (requestId !== state.gpsInsightRequestId) return;
    state.gpsInsight = 'The air-quality reading is available, but the AI briefing could not be generated. Please try again.';
    state.gpsInsightProvider = '';
  } finally {
    if (requestId === state.gpsInsightRequestId) {
      state.gpsInsightLoading = false;
      if (state.currentView === 'dashboard') renderCurrentView();
    }
  }
}

function updateTopHeaderMetrics() {
  const aq = state.airQuality;
  if (!aq) return;

  const aqiBadge = document.getElementById('header-aqi-pill');
  if (aqiBadge) {
    const locName = state.userCoords?.locality || aq.city.split(',')[0];
    aqiBadge.innerHTML = `
      <span class="inline-block w-2 h-2 rounded-full mr-2" style="background-color: ${aq.color}"></span>
      <span class="font-medium text-slate-200">${locName}:</span>
      <span class="ml-1 text-slate-300">AQI ${aq.aqi}</span>
      <span class="ml-1.5 text-[11px] text-slate-400">(${aq.category})</span>
    `;
  }

  const alertCount = document.getElementById('header-alert-count');
  if (alertCount) {
    const unread = state.alerts.filter(a => !a.is_read).length;
    alertCount.textContent = unread;
    alertCount.style.display = unread > 0 ? 'inline-flex' : 'none';
  }

  const sourceBadge = document.getElementById('header-source-badge');
  if (sourceBadge) {
    if (aq.is_live) {
      sourceBadge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span> Open-Meteo Live`;
    } else {
      sourceBadge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span> CPCB Standard`;
    }
  }
}

// Master View Switcher
function renderCurrentView() {
  const content = document.getElementById('main-content');
  if (!content) return;

  switch (state.currentView) {
    case 'dashboard':
      renderDashboard(content);
      break;
    case 'map':
      renderAirQualityMap(content);
      break;
    case 'assistant':
      renderAiAssistant(content);
      break;
    case 'family':
      renderFamilyProtection(content);
      break;
    case 'routine':
      renderDailyRoutine(content);
      break;
    case 'iaq':
      renderIndoorAirQuality(content);
      break;
    case 'alternatives':
      renderAlternatives(content);
      break;
    case 'community':
      renderCommunityHub(content);
      break;
    case 'impact':
      renderImpactTracker(content);
      break;
    case 'alerts':
      renderAlertsCenter(content);
      break;
    case 'settings':
      renderSettings(content);
      break;
    case 'demo_mode':
      renderJudgesDemo(content);
      break;
    default:
      renderDashboard(content);
  }
}

/* =========================================================================
   1. DASHBOARD VIEW (Overview)
   ========================================================================= */
function renderDashboard(container) {
  let aq = state.airQuality;
  if (!aq) {
    aq = {
      city: state.currentCity || "Delhi NCR, India",
      aqi: 388,
      category: "Very Poor",
      color: "#ef4444",
      dominant_pollutant: "PM2.5",
      is_live: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      coordinates: { lat: 28.6139, lon: 77.2090 },
      pollutants: {
        pm2_5: { value: 225.0, unit: "µg/m³", cpcb_limit: 60, status: "Severe" },
        pm10: { value: 368.0, unit: "µg/m³", cpcb_limit: 100, status: "Very Poor" },
        no2: { value: 78.4, unit: "µg/m³", cpcb_limit: 80, status: "Moderate" },
        so2: { value: 18.2, unit: "µg/m³", cpcb_limit: 80, status: "Good" },
        co: { value: 2.4, unit: "mg/m³", cpcb_limit: 2.0, status: "Moderate" },
        o3: { value: 36.0, unit: "µg/m³", cpcb_limit: 100, status: "Good" }
      },
      weather: {
        temperature_c: 16.4,
        humidity_percent: 78,
        wind_speed_kmh: 4.8,
        wind_direction_deg: 290,
        wind_direction_cardinal: "WNW",
        boundary_layer_height_m: 340,
        temperature_inversion_detected: true,
        stagnation_risk: "High"
      },
      health_advisory: {
        general_population: "Avoid prolonged outdoor cardio or heavy exertion. Morning thermal inversion traps combustion particulates near ground level.",
        sensitive_groups: "Children, seniors, and asthma patients should remain indoors with HEPA air purifiers active.",
        mask_recommendation: "Certified N95 or FFP2 respirator required for necessary outdoor movement."
      },
      hourly_forecast: Array.from({ length: 24 }, (_, i) => ({
        time: `${String(i).padStart(2, '0')}:00`,
        aqi: Math.round(330 + Math.sin(i / 3) * 55 + (i < 9 || i > 19 ? 45 : -35)),
        pm2_5: Math.round(190 + Math.sin(i / 3) * 35 + (i < 9 || i > 19 ? 30 : -25)),
        pm10: Math.round(310 + Math.sin(i / 3) * 50 + (i < 9 || i > 19 ? 45 : -40)),
        temp_c: Math.round((16 + Math.sin((i - 6) / 4) * 6) * 10) / 10
      })),
      seven_day_forecast: [
        { day: "Today", aqi: 388, cat: "Very Poor", color: "#ef4444" },
        { day: "Tomorrow", aqi: 372, cat: "Very Poor", color: "#ef4444" },
        { day: "Day 3", aqi: 350, cat: "Very Poor", color: "#ef4444" },
        { day: "Day 4", aqi: 330, cat: "Very Poor", color: "#ef4444" },
        { day: "Day 5", aqi: 295, cat: "Poor", color: "#f97316" },
        { day: "Day 6", aqi: 280, cat: "Poor", color: "#f97316" },
        { day: "Day 7", aqi: 245, cat: "Poor", color: "#f97316" }
      ]
    };
    state.airQuality = aq;
    updateTopHeaderMetrics();
  }

  const cityOptions = state.cities.map(c => `
    <option value="${c.key}" ${c.key === state.currentCity ? 'selected' : ''}>${c.name} (AQI ~${c.baseline_aqi})</option>
  `).join('');

  const weather = aq.weather || {};
  const pollutants = aq.pollutants || {};

  container.innerHTML = `
    <!-- Page Header & Action Controls -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-xl md:text-2xl font-semibold tracking-tight text-white">
          Overview
        </h1>
        <p class="text-xs text-slate-400 mt-0.5">
          Live air quality index, local meteorological conditions, and health advisories.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2 text-xs">
        <!-- City Select Dropdown -->
        <div class="relative">
          <select id="city-selector" class="bg-slate-900 border border-slate-700/80 text-slate-200 text-xs rounded-lg px-3 py-2 pr-7 focus:outline-none focus:border-slate-500 cursor-pointer">
            <option value="" disabled ${state.userCoords ? 'selected' : ''}>Select City</option>
            ${cityOptions}
          </select>
        </div>

        <!-- Location Button -->
        <button id="btn-gps-loc" class="btn-gps-trigger bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium px-3 py-2 rounded-lg flex items-center gap-1.5 transition">
          ${icons.crosshair}
          <span>Location</span>
        </button>

        <!-- Temperature Unit Toggle -->
        <button id="btn-temp-unit" class="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium px-2.5 py-2 rounded-lg transition" title="Toggle unit">
          ${state.tempUnit === 'C' ? '°C' : '°F'}
        </button>

        <!-- Scenarios Link -->
        <button onclick="window.hawawiseNavigate('demo_mode')" class="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium px-3 py-2 rounded-lg flex items-center gap-1.5 transition">
          ${icons.play}
          <span>Scenarios</span>
        </button>
      </div>
    </div>

    <!-- Consolidated Status Bar -->
    <div class="mb-5 p-3 rounded-lg border border-slate-800/80 bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="w-1.5 h-1.5 rounded-full ${state.userCoords ? 'bg-cyan-400' : 'bg-emerald-500'}"></span>
        <span class="text-slate-200 font-medium">${state.userCoords?.locality || aq.city}</span>
        <span class="text-slate-500">·</span>
        <span class="text-slate-400">${(aq.coordinates?.lat ?? 28.614).toFixed(3)}°N, ${(aq.coordinates?.lon ?? 77.209).toFixed(3)}°E</span>
        ${state.userCoords ? `
          <span class="text-cyan-400 text-[11px] font-medium">(±${state.userCoords.accuracy}m accuracy)</span>
          <button id="btn-clear-gps" class="text-slate-400 hover:text-slate-200 underline text-[11px] ml-1">Reset</button>
        ` : ''}
        ${state.nearestStation ? `
          <span class="text-slate-500">·</span>
          <span class="text-slate-400">Nearest: <strong class="text-slate-300">${state.nearestStation.station.name}</strong> (${state.nearestStation.distanceKm} km)</span>
        ` : ''}
      </div>

      <div class="flex items-center gap-2 text-[11px] text-slate-500">
        <button onclick="window.hawawiseNavigate('map')" class="text-slate-300 hover:text-white underline font-medium flex items-center gap-1">
          <span>View on Station Map</span> →
        </button>
      </div>
    </div>

    <!-- GPS AI briefing -->
    ${state.userCoords ? `
      <section class="glass-panel p-4 mb-5 border border-cyan-500/20" aria-live="polite">
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div class="min-w-0">
            <h2 class="text-xs font-semibold uppercase tracking-wider text-cyan-300">AI briefing for your GPS location</h2>
            <p class="text-[11px] ${state.userCoords.accuracy <= 150 ? 'text-emerald-300' : 'text-amber-300'} mt-1">${state.userCoords.accuracy <= 150 ? 'High-accuracy GPS fix' : 'Approximate location fix'} (±${state.userCoords.accuracy} m) · Coordinate-based air-quality estimate, not a sensor at your exact position · Updated ${aq.last_updated || aq.timestamp || 'recently'}</p>
            ${!aq.is_live ? '<p class="text-[11px] text-amber-300 mt-1">Live air-quality service is unavailable; showing baseline data instead.</p>' : ''}
            <p id="gps-ai-briefing-text" class="text-xs text-slate-300 leading-relaxed mt-3 whitespace-pre-line"></p>
            ${state.gpsInsightProvider ? `<p class="text-[10px] text-slate-500 mt-2">Assistant: ${state.gpsInsightProvider}</p>` : ''}
          </div>
          <button id="btn-gps-ai-refresh" class="shrink-0 text-xs font-medium px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 transition disabled:opacity-50" ${state.gpsInsightLoading ? 'disabled' : ''}>
            ${state.gpsInsightLoading ? 'Analyzing…' : 'Refresh AI briefing'}
          </button>
        </div>
      </section>
    ` : ''}

    <!-- Temperature Inversion Callout -->
    ${weather.temperature_inversion_detected ? `
      <div class="mb-5 p-3.5 rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-300 flex items-start gap-3">
        <div class="text-rose-400 mt-0.5 shrink-0">${icons.alert}</div>
        <div class="text-xs">
          <div class="font-semibold text-rose-300">Boundary Layer Temperature Inversion Active</div>
          <div class="text-slate-400 mt-0.5 leading-relaxed">
            Cold surface air is trapped beneath a warmer overhead layer with calm wind (${weather.wind_speed} km/h).
            Particulates cannot disperse vertically, causing acute ground-level concentration. Avoid morning outdoor jogging.
          </div>
        </div>
      </div>
    ` : ''}

    <!-- Key Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      
      <!-- Primary AQI Card -->
      <div class="glass-panel p-5 flex flex-col justify-between">
        <div>
          <div class="flex items-start justify-between">
            <div>
              <span class="text-[11px] uppercase tracking-wider text-slate-400 font-medium">National AQI (CPCB)</span>
              <div class="flex items-baseline gap-3 mt-1.5">
                <span class="text-4xl font-bold tracking-tight" style="color: ${aq.color}">${aq.aqi}</span>
                <span class="text-xs font-semibold px-2 py-0.5 rounded-md border" style="border-color: ${aq.color}40; background-color: ${aq.color}15; color: ${aq.color}">
                  ${aq.category}
                </span>
              </div>
            </div>
            <div class="text-right">
              <span class="text-[11px] text-slate-500">Dominant</span>
              <div class="text-xs font-semibold text-slate-300 mt-0.5">${aq.dominant_pollutant}</div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-800">
            <p class="text-xs text-slate-300 leading-relaxed">
              "${typeof aq.health_advisory === 'string' ? aq.health_advisory : (aq.health_advisory?.general_population || 'Respiratory discomfort risk on prolonged exposure. Avoid strenuous outdoor activities.')}"
            </p>
          </div>
        </div>

        <div class="mt-3 text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 flex items-center gap-1.5">
          <span class="text-amber-400 shrink-0 font-medium">Note:</span>
          <span class="text-slate-400">${typeof aq.sensitive_advisory === 'string' ? aq.sensitive_advisory : (aq.health_advisory?.sensitive_groups || 'Children, seniors and people with respiratory illness should remain indoors with HEPA filtration.')}</span>
        </div>
      </div>

      <!-- Local Meteorological Data -->
      <div class="glass-panel p-5 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-[11px] uppercase tracking-wider text-slate-400 font-medium">
            <span>Atmospheric Conditions</span>
            <span class="text-slate-300 font-normal capitalize">${weather.condition || 'Mist / Shallow Fog'}</span>
          </div>

          <div class="my-3">
            <div class="text-3xl font-bold tracking-tight text-white">${formatTemp(weather.temperature !== undefined ? weather.temperature : weather.temperature_c)}</div>
            <div class="text-xs text-slate-400 mt-0.5">Feels like <strong class="text-slate-300 font-medium">${formatTemp(weather.apparent_temperature !== undefined ? weather.apparent_temperature : (weather.temperature || 16) - 1.5)}</strong></div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs border-t border-slate-800 pt-3 text-slate-400">
          <div>Humidity: <strong class="text-slate-200 font-medium">${weather.humidity !== undefined ? weather.humidity : (weather.humidity_percent || 78)}%</strong></div>
          <div>Wind: <strong class="text-slate-200 font-medium">${weather.wind_speed !== undefined ? weather.wind_speed : (weather.wind_speed_kmh || 4.8)} km/h ${weather.wind_direction_cardinal || ''}</strong></div>
          <div>Pressure: <strong class="text-slate-200 font-medium">${weather.pressure_hpa || 1016} hPa</strong></div>
          <div>Visibility: <strong class="text-slate-200 font-medium">${weather.visibility_km || 2.5} km</strong></div>
          <div>UV Index: <strong class="text-slate-200 font-medium">${weather.uv_index || 3.0}</strong></div>
          <div>Inversion: <strong class="${weather.temperature_inversion_detected ? 'text-rose-400' : 'text-emerald-400'} font-medium">${weather.temperature_inversion_detected ? 'Active' : 'Normal'}</strong></div>
        </div>
      </div>

      <!-- Protection Protocol Card -->
      <div class="glass-panel p-5 flex flex-col justify-between">
        <div>
          <div class="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Exposure Protocol</div>
          
          <div class="my-3">
            <div class="text-sm font-semibold ${(aq.mask_recommended ?? (aq.aqi > 200)) ? 'text-rose-400' : 'text-emerald-400'} flex items-center gap-1.5">
              <span>${(aq.mask_recommended ?? (aq.aqi > 200)) ? 'Certified N95 Recommended' : 'Outdoor Mask Optional'}</span>
            </div>
            <p class="text-xs text-slate-400 mt-1.5 leading-relaxed">
              ${(aq.mask_recommended ?? (aq.aqi > 200)) ? 'Fine sub-micron PM2.5 penetrates standard cloth masks. An airtight N95/FFP2 respirator reduces toxic particulate intake.' : 'Ambient particulate levels are within moderate thresholds for normal activities.'}
            </p>
          </div>
        </div>

        <div class="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
          <span class="text-slate-400">Optimal airing window:</span>
          <strong class="text-slate-200 font-semibold">${weather.optimal_ventilation_window || '1:00 PM – 2:30 PM (Midday Solar Mixing)'}</strong>
        </div>
      </div>

    </div>

    <!-- Measured Pollutant Sub-Indices -->
    <div class="glass-panel p-5 mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
        <div>
          <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Monitored Pollutants & 24-Hour Benchmark
          </h2>
          <p class="text-[11px] text-slate-500 mt-0.5">
            Calculated against Central Pollution Control Board (CPCB) standard breakpoints.
          </p>
        </div>
        <span class="text-[11px] text-slate-500 font-mono">CPCB NAQI Reference</span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        ${renderPollutantCard('PM2.5', pollutants.pm2_5, '#f43f5e', 'Fine respirable (<2.5 µm)')}
        ${renderPollutantCard('PM10', pollutants.pm10, '#f97316', 'Inhalable coarse (<10 µm)')}
        ${renderPollutantCard('NO2', pollutants.no2, '#38bdf8', 'Combustion exhaust')}
        ${renderPollutantCard('SO2', pollutants.so2, '#a855f7', 'Industrial emissions')}
        ${renderPollutantCard('CO', pollutants.co, '#fbbf24', 'Incomplete burning')}
        ${renderPollutantCard('O3', pollutants.o3, '#10b981', 'Ground ozone')}
        ${renderPollutantCard('NH3', pollutants.nh3, '#ec4899', 'Ammonia emissions')}
      </div>
    </div>

    <!-- 24-Hour Diurnal Smog & AQI Trend Chart -->
    <div class="glass-panel p-5 mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300">
            24-Hour Diurnal Curve
          </h2>
          <p class="text-[11px] text-slate-500 mt-0.5">
            Diurnal curve showing nocturnal thermal trapping (06:00–09:00 & 20:00–23:00) vs afternoon dilution.
          </p>
        </div>
        <div class="flex items-center gap-4 text-xs text-slate-400">
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-0.5 bg-rose-500 inline-block"></span> PM2.5 (µg/m³)</span>
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-0.5 bg-cyan-400 inline-block"></span> CPCB AQI</span>
        </div>
      </div>

      <div class="relative h-60 w-full">
        <canvas id="trendChart"></canvas>
      </div>
    </div>

    <!-- Quick Navigation Shortcuts -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="glass-panel glass-panel-hover p-4 cursor-pointer" onclick="window.hawawiseNavigate('assistant')">
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-300 flex items-center justify-center shrink-0">
            ${icons.chat}
          </div>
          <div>
            <h3 class="text-xs font-semibold text-slate-200">Consult Assistant</h3>
            <p class="text-xs text-slate-400 mt-0.5">Get personalized guidance for daily routines and household shielding.</p>
          </div>
        </div>
      </div>

      <div class="glass-panel glass-panel-hover p-4 cursor-pointer" onclick="window.hawawiseNavigate('family')">
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-300 flex items-center justify-center shrink-0">
            ${icons.shield}
          </div>
          <div>
            <h3 class="text-xs font-semibold text-slate-200">Household Protection</h3>
            <p class="text-xs text-slate-400 mt-0.5">Action protocols calibrated for children, seniors, and asthmatic members.</p>
          </div>
        </div>
      </div>

      <div class="glass-panel glass-panel-hover p-4 cursor-pointer" onclick="window.hawawiseNavigate('routine')">
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-300 flex items-center justify-center shrink-0">
            ${icons.calendar}
          </div>
          <div>
            <h3 class="text-xs font-semibold text-slate-200">Daily Schedule</h3>
            <p class="text-xs text-slate-400 mt-0.5">Timeline designed around morning and evening winter smog peaks.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  const gpsBriefingText = document.getElementById('gps-ai-briefing-text');
  if (gpsBriefingText) {
    gpsBriefingText.textContent = state.gpsInsightLoading
      ? 'Analyzing the latest air-quality reading for this location…'
      : (state.gpsInsight || 'No AI briefing is available yet. Use Refresh AI briefing to try again.')
        .replace(/^#{1,6}\s*/gm, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/^\s*-\s/gm, '• ');
  }

  // Event Listeners
  const selector = document.getElementById('city-selector');
  if (selector) {
    selector.addEventListener('change', async (e) => {
      state.userCoords = null;
      state.gpsInsight = '';
      state.gpsInsightProvider = '';
      state.gpsInsightRequestId += 1;
      state.currentCity = e.target.value;
      state.airQuality = await api.getAirQuality(state.currentCity);
      updateTopHeaderMetrics();
      renderDashboard(container);
    });
  }

  const gpsBtn = document.getElementById('btn-gps-loc');
  if (gpsBtn) {
    gpsBtn.addEventListener('click', () => {
      detectUserLocation(false);
    });
  }

  const tempBtn = document.getElementById('btn-temp-unit');
  if (tempBtn) {
    tempBtn.addEventListener('click', () => {
      state.tempUnit = state.tempUnit === 'C' ? 'F' : 'C';
      localStorage.setItem('vayusaathi_temp_unit', state.tempUnit);
      localStorage.setItem('hawawise_temp_unit', state.tempUnit);
      renderDashboard(container);
    });
  }

  const clearGps = document.getElementById('btn-clear-gps');
  if (clearGps) {
    clearGps.addEventListener('click', async () => {
      state.userCoords = null;
      state.gpsInsight = '';
      state.gpsInsightProvider = '';
      state.gpsInsightLoading = false;
      state.gpsInsightRequestId += 1;
      state.currentCity = 'Delhi NCR';
      state.airQuality = await api.getAirQuality('Delhi NCR');
      updateTopHeaderMetrics();
      renderDashboard(container);
    });
  }

  const gpsAiRefresh = document.getElementById('btn-gps-ai-refresh');
  if (gpsAiRefresh) {
    gpsAiRefresh.addEventListener('click', () => {
      if (state.airQuality && state.userCoords) {
        requestGpsAiBriefing(state.airQuality, state.userCoords);
      }
    });
  }

  // Initialize Trend Line Chart
  const trendData = aq.trend_24h || aq.hourly_forecast || [];
  if (trendData.length > 0) {
    initTrendChart(trendData);
  }
}

function renderPollutantCard(name, data, color, desc) {
  if (!data) return '';
  const limit = data.safe_limit || data.cpcb_limit || 60.0;
  const val = data.value !== undefined ? data.value : 0;
  const ratio = Math.round((val / limit) * 100);
  const isHigh = ratio > 100;

  return `
    <div class="bg-slate-900/50 border border-slate-800 rounded-lg p-3 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between text-xs">
          <span class="font-semibold text-slate-200">${name}</span>
          <span class="text-[10px] text-slate-500">${data.unit || 'µg/m³'}</span>
        </div>
        <div class="text-lg font-bold tracking-tight mt-1" style="color: ${isHigh ? color : '#10b981'}">
          ${val}
        </div>
        <div class="text-[10px] text-slate-500 truncate" title="${desc}">${desc}</div>
      </div>

      <div class="mt-3 pt-2 border-t border-slate-800/80">
        <div class="flex justify-between text-[10px] text-slate-500 mb-1">
          <span>Limit ${limit}</span>
          <span class="${isHigh ? 'text-rose-400 font-medium' : 'text-slate-400'}">${ratio}%</span>
        </div>
        <div class="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
          <div class="h-1 rounded-full" style="width: ${Math.min(ratio, 100)}%; background-color: ${isHigh ? color : '#10b981'}"></div>
        </div>
      </div>
    </div>
  `;
}

function initTrendChart(trendData) {
  const canvas = document.getElementById('trendChart');
  if (!canvas || !window.Chart) return;

  if (state.charts.trend) {
    state.charts.trend.destroy();
  }

  const labels = trendData.map(d => d.time || d.hour || '');
  const aqiValues = trendData.map(d => d.aqi || 0);
  const pm25Values = trendData.map(d => d.pm2_5 !== undefined ? d.pm2_5 : (d.pm25 !== undefined ? d.pm25 : 0));

  state.charts.trend = new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'CPCB AQI',
          data: aqiValues,
          borderColor: '#38bdf8',
          backgroundColor: 'transparent',
          borderWidth: 1.75,
          tension: 0.3,
          yAxisID: 'y'
        },
        {
          label: 'PM2.5 (µg/m³)',
          data: pm25Values,
          borderColor: '#f43f5e',
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderDash: [3, 3],
          tension: 0.3,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#11141a',
          titleColor: '#f3f4f6',
          bodyColor: '#9ca3af',
          borderColor: '#283040',
          borderWidth: 1,
          padding: 8,
          titleFont: { size: 11, weight: '600' },
          bodyFont: { size: 11 }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: { color: '#64748b', font: { size: 10 } }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: { color: '#38bdf8', font: { size: 10 } }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: { drawOnChartArea: false },
          ticks: { color: '#f43f5e', font: { size: 10 } }
        }
      }
    }
  });
}

/* =========================================================================
   2. AIR QUALITY MAP VIEW (Fully Functional Spatial Network & Geolocation)
   ========================================================================= */
function renderAirQualityMap(container) {
  // Compute distance for all stations relative to user if available
  const userLat = state.userCoords?.lat;
  const userLon = state.userCoords?.lon;

  const processedStations = ALL_STATIONS.map(st => {
    const dist = (userLat && userLon) ? getDistanceKm(userLat, userLon, st.lat, st.lon) : null;
    return { ...st, distanceKm: dist };
  });

  // Apply Search Filter
  let filtered = processedStations;
  if (state.mapSearchQuery.trim()) {
    const q = state.mapSearchQuery.toLowerCase().trim();
    filtered = filtered.filter(st => 
      st.name.toLowerCase().includes(q) || 
      st.city.toLowerCase().includes(q) || 
      st.reason.toLowerCase().includes(q)
    );
  }

  // Apply AQI Level Filter
  if (state.mapFilter === 'severe') {
    filtered = filtered.filter(st => st.aqi >= 401);
  } else if (state.mapFilter === 'very_poor') {
    filtered = filtered.filter(st => st.aqi >= 301 && st.aqi <= 400);
  } else if (state.mapFilter === 'poor_mod') {
    filtered = filtered.filter(st => st.aqi >= 101 && st.aqi <= 300);
  } else if (state.mapFilter === 'good') {
    filtered = filtered.filter(st => st.aqi <= 100);
  }

  // Sort
  if (state.mapSort === 'proximity' && userLat && userLon) {
    filtered.sort((a, b) => (a.distanceKm || 9999) - (b.distanceKm || 9999));
  } else if (state.mapSort === 'aqi_desc') {
    filtered.sort((a, b) => b.aqi - a.aqi);
  } else if (state.mapSort === 'aqi_asc') {
    filtered.sort((a, b) => a.aqi - b.aqi);
  } else if (state.mapSort === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  const nearest = (userLat && userLon) ? findNearestStation(userLat, userLon) : null;

  container.innerHTML = `
    <!-- Map View Header -->
    <div class="mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl md:text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
          <span>Station Network & Google Map</span>
          <span class="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1.5 font-normal">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Google Maps Engine
          </span>
        </h1>
        <p class="text-xs text-slate-400 mt-0.5">
          High-accuracy Google Maps spatial environmental monitoring, satellite positioning & CPCB national station network.
        </p>
      </div>

      <!-- Quick Action Controls -->
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <!-- High-Precision Locate Me -->
        <button id="btn-map-locate" class="btn-gps-trigger bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5">
          ${icons.crosshair}
          <span>Locate Me</span>
        </button>

        <!-- Continuous Live Tracking Toggle -->
        <button id="btn-map-track" class="px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 border ${state.isTracking ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/40' : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-700'}">
          <span class="w-2 h-2 rounded-full ${state.isTracking ? 'bg-cyan-400 animate-ping' : 'bg-slate-500'}"></span>
          <span>${state.isTracking ? 'Live Tracking On' : 'Live Tracking'}</span>
        </button>

        <!-- Nearest Station Finder -->
        <button id="btn-map-nearest" class="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5" title="Find and focus on the closest CPCB monitoring station">
          ${icons.navigation}
          <span>Nearest Station</span>
        </button>

        <!-- Google Map Style Selector -->
        <div class="relative flex items-center">
          <select id="map-layer-selector" class="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 pr-6 focus:outline-none cursor-pointer">
            <option value="google_streets" ${state.mapLayer === 'google_streets' ? 'selected' : ''}>Google Roadmap</option>
            <option value="google_satellite" ${state.mapLayer === 'google_satellite' ? 'selected' : ''}>Google Satellite</option>
            <option value="google_hybrid" ${state.mapLayer === 'google_hybrid' ? 'selected' : ''}>Google Hybrid</option>
            <option value="google_terrain" ${state.mapLayer === 'google_terrain' ? 'selected' : ''}>Google Terrain</option>
            <option value="google_traffic" ${state.mapLayer === 'google_traffic' ? 'selected' : ''}>Google Live Traffic</option>
            <option value="dark" ${state.mapLayer === 'dark' ? 'selected' : ''}>Dark Canvas</option>
            <option value="osm" ${state.mapLayer === 'osm' ? 'selected' : ''}>Street Map</option>
          </select>
        </div>

        <!-- Fullscreen Button -->
        <button id="btn-map-fullscreen" class="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 p-1.5 rounded-lg transition" title="Toggle Fullscreen Map">
          ${icons.maximize}
        </button>

        <!-- Map Settings Shortcut -->
        <button onclick="window.vayusaathiNavigate ? window.vayusaathiNavigate('settings') : window.hawawiseNavigate('settings')" class="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 p-1.5 rounded-lg transition" title="Open Map & API Settings">
          ${icons.settings}
        </button>
      </div>
    </div>

    <!-- Active Location & Satellite Accuracy Status Bar -->
    <div class="mb-4 p-3 rounded-lg border border-slate-800 bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-slate-400">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="w-2 h-2 rounded-full ${state.userCoords ? 'bg-cyan-400' : 'bg-slate-600'}"></span>
        <span>Position:</span>
        <strong class="text-slate-200">
          ${state.userCoords ? (state.userCoords.locality || `${state.userCoords.lat.toFixed(4)}°N, ${state.userCoords.lon.toFixed(4)}°E`) : 'Not acquired (click Locate Me or click anywhere on the map)'}
        </strong>
        ${state.userCoords ? `
          <span class="text-cyan-400 text-[11px]">(Accuracy: ±${state.userCoords.accuracy}m)</span>
        ` : ''}
        ${nearest ? `
          <span class="text-slate-500">·</span>
          <span>Closest Station: <strong class="text-slate-300">${nearest.station.name}</strong> (${nearest.distanceKm} km)</span>
        ` : ''}
      </div>

      <div class="flex items-center gap-2 text-[11px]">
        <span class="text-slate-500">Click anywhere on the map to inspect coordinates & elevation</span>
      </div>
    </div>

    <!-- Map Canvas Container with Floating Overlays -->
    <div id="map-wrapper" class="glass-panel p-1.5 mb-5 overflow-hidden rounded-xl relative map-container-wrapper" style="height: 520px;">
      <div id="mapContainer" class="w-full h-full rounded-lg z-0"></div>

      <!-- Floating Bottom-Left Engine Badge -->
      <div class="map-floating-overlay bottom-4 left-3 pointer-events-auto">
        <div class="map-floating-pill px-3 py-1.5 text-[11px] text-slate-300 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></span>
          <span class="font-medium text-white">Google Maps</span>
          <span class="text-slate-500">·</span>
          <span class="text-slate-400">Zero-Key Active</span>
          <a href="#" onclick="window.vayusaathiNavigate ? window.vayusaathiNavigate('settings') : window.hawawiseNavigate('settings'); return false;" class="ml-1 text-cyan-400 hover:underline">Settings →</a>
        </div>
      </div>

      <!-- Floating Bottom-Right AQI Legend -->
      <div class="map-floating-overlay bottom-4 right-3 pointer-events-auto hidden md:block">
        <div class="map-floating-pill p-2 text-[10px] flex items-center gap-1.5">
          <span class="font-semibold text-slate-400 pr-1.5 border-r border-slate-700/80">AQI:</span>
          <span class="px-1.5 py-0.5 rounded font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">0–50 Good</span>
          <span class="px-1.5 py-0.5 rounded font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">51–100 Mod</span>
          <span class="px-1.5 py-0.5 rounded font-medium bg-orange-500/20 text-orange-300 border border-orange-500/30">101–200 Poor</span>
          <span class="px-1.5 py-0.5 rounded font-medium bg-rose-500/20 text-rose-300 border border-rose-500/30">201–300 V.Poor</span>
          <span class="px-1.5 py-0.5 rounded font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">301+ Severe</span>
        </div>
      </div>
    </div>

    <!-- Station Filtering, Search & Sorting Bar -->
    <div class="glass-panel p-3.5 mb-5 space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <!-- Search Input -->
        <div class="relative flex-1 max-w-sm">
          <span class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
            ${icons.search}
          </span>
          <input 
            type="text" 
            id="station-search" 
            value="${state.mapSearchQuery}" 
            placeholder="Search station by name, corridor, or city..." 
            class="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-slate-500"
          />
        </div>

        <!-- Sort Dropdown -->
        <div class="flex items-center gap-2 text-xs">
          <label class="text-slate-400">Sort by:</label>
          <select id="station-sort" class="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer">
            ${userLat ? '<option value="proximity" ' + (state.mapSort === 'proximity' ? 'selected' : '') + '>Proximity (Nearest First)</option>' : ''}
            <option value="aqi_desc" ${state.mapSort === 'aqi_desc' ? 'selected' : ''}>Highest AQI (Most Severe)</option>
            <option value="aqi_asc" ${state.mapSort === 'aqi_asc' ? 'selected' : ''}>Lowest AQI (Cleanest)</option>
            <option value="name" ${state.mapSort === 'name' ? 'selected' : ''}>Station Name (A–Z)</option>
          </select>
        </div>
      </div>

      <!-- AQI Filter Pills -->
      <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
        <div class="flex flex-wrap items-center gap-1.5 text-xs">
          <button data-map-filter="all" onclick="window.setMapFilter('all')" class="px-2.5 py-1 rounded-md text-[11px] font-medium border transition ${state.mapFilter === 'all' ? 'bg-slate-800 text-white border-slate-600' : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'}">
            All (${ALL_STATIONS.length})
          </button>
          <button data-map-filter="severe" onclick="window.setMapFilter('severe')" class="px-2.5 py-1 rounded-md text-[11px] font-medium border transition ${state.mapFilter === 'severe' ? 'bg-slate-800 text-white border-slate-600' : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'}">
            Severe (401+)
          </button>
          <button data-map-filter="very_poor" onclick="window.setMapFilter('very_poor')" class="px-2.5 py-1 rounded-md text-[11px] font-medium border transition ${state.mapFilter === 'very_poor' ? 'bg-slate-800 text-white border-slate-600' : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'}">
            Very Poor (301–400)
          </button>
          <button data-map-filter="poor_mod" onclick="window.setMapFilter('poor_mod')" class="px-2.5 py-1 rounded-md text-[11px] font-medium border transition ${state.mapFilter === 'poor_mod' ? 'bg-slate-800 text-white border-slate-600' : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'}">
            Moderate / Poor (101–300)
          </button>
          <button data-map-filter="good" onclick="window.setMapFilter('good')" class="px-2.5 py-1 rounded-md text-[11px] font-medium border transition ${state.mapFilter === 'good' ? 'bg-slate-800 text-white border-slate-600' : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'}">
            Good (0–100)
          </button>
        </div>

        <span class="text-[11px] text-slate-500">
          Showing ${filtered.length} of ${ALL_STATIONS.length} stations
        </span>
      </div>
    </div>

    <!-- Station Highlights Grid -->
    <div id="station-cards-grid" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      ${filtered.length === 0 ? `
        <div class="col-span-3 p-8 text-center text-slate-500 text-xs">No monitoring stations match your search or filter.</div>
      ` : filtered.map(s => {
        let catColor = '#10b981';
        if (s.aqi > 400) catColor = '#f43f5e';
        else if (s.aqi > 300) catColor = '#ef4444';
        else if (s.aqi > 200) catColor = '#f97316';
        else if (s.aqi > 100) catColor = '#f59e0b';

        return `
          <div class="glass-panel p-4 flex flex-col justify-between hover:border-slate-700 transition">
            <div>
              <div class="flex items-start justify-between gap-2">
                <div>
                  <h3 class="text-xs font-semibold text-white">${s.name}</h3>
                  <div class="text-[10px] text-slate-500 mt-0.5">${s.city}</div>
                </div>
                <span class="text-[11px] font-semibold px-2 py-0.5 rounded border shrink-0" style="color: ${catColor}; border-color: ${catColor}40; background-color: ${catColor}15;">
                  AQI ${s.aqi}
                </span>
              </div>

              <div class="flex items-center gap-3 text-xs text-slate-400 mt-2.5">
                <div>PM2.5: <strong class="text-slate-200">${s.pm25} µg/m³</strong></div>
                <div>PM10: <strong class="text-slate-200">${s.pm10} µg/m³</strong></div>
              </div>

              ${s.distanceKm !== null ? `
                <div class="mt-1.5 text-[11px] text-cyan-400 font-medium">
                  ${s.distanceKm} km from your position
                </div>
              ` : ''}

              <p class="text-xs text-slate-400 mt-2 leading-relaxed">${s.reason}</p>
            </div>

            <div class="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <button class="text-slate-300 hover:text-white font-medium" onclick="window.selectCityFromMap('${s.name}')">
                Set Active →
              </button>
              <button class="text-slate-400 hover:text-slate-200 text-[11px]" onclick="window.focusStationOnMap('${s.id}')">
                Focus on Map
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Efficient Station Grid & Map Filter Updater (preserves Leaflet instance and input focus)
  window.updateStationCardsAndMarkers = function () {
    const userLat = state.userCoords?.lat;
    const userLon = state.userCoords?.lon;

    let stations = ALL_STATIONS.map(st => ({
      ...st,
      distanceKm: (userLat && userLon) ? getDistanceKm(userLat, userLon, st.lat, st.lon) : null
    }));

    if (state.mapSearchQuery.trim()) {
      const q = state.mapSearchQuery.toLowerCase().trim();
      stations = stations.filter(st =>
        st.name.toLowerCase().includes(q) ||
        st.city.toLowerCase().includes(q) ||
        st.reason.toLowerCase().includes(q)
      );
    }

    if (state.mapFilter === 'severe') stations = stations.filter(st => st.aqi >= 401);
    else if (state.mapFilter === 'very_poor') stations = stations.filter(st => st.aqi >= 301 && st.aqi <= 400);
    else if (state.mapFilter === 'poor_mod') stations = stations.filter(st => st.aqi >= 101 && st.aqi <= 300);
    else if (state.mapFilter === 'good') stations = stations.filter(st => st.aqi <= 100);

    if (state.mapSort === 'proximity' && userLat && userLon) {
      stations.sort((a, b) => (a.distanceKm || 9999) - (b.distanceKm || 9999));
    } else if (state.mapSort === 'aqi_desc') {
      stations.sort((a, b) => b.aqi - a.aqi);
    } else if (state.mapSort === 'aqi_asc') {
      stations.sort((a, b) => a.aqi - b.aqi);
    } else if (state.mapSort === 'name') {
      stations.sort((a, b) => a.name.localeCompare(b.name));
    }

    const gridEl = document.getElementById('station-cards-grid');
    if (gridEl) {
      if (stations.length === 0) {
        gridEl.innerHTML = `<div class="col-span-full py-8 text-center text-xs text-slate-500">No monitoring stations match your search query or active filter.</div>`;
      } else {
        gridEl.innerHTML = stations.map(s => {
          let catColor = '#10b981';
          if (s.aqi > 400) catColor = '#f43f5e';
          else if (s.aqi > 300) catColor = '#ef4444';
          else if (s.aqi > 200) catColor = '#f97316';
          else if (s.aqi > 100) catColor = '#f59e0b';

          return `
            <div class="glass-panel p-4 flex flex-col justify-between hover:border-slate-700 transition">
              <div>
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <h3 class="text-xs font-semibold text-white">${s.name}</h3>
                    <div class="text-[10px] text-slate-500 mt-0.5">${s.city}</div>
                  </div>
                  <span class="text-[11px] font-semibold px-2 py-0.5 rounded border shrink-0" style="color: ${catColor}; border-color: ${catColor}40; background-color: ${catColor}15;">
                    AQI ${s.aqi}
                  </span>
                </div>

                <div class="flex items-center gap-3 text-xs text-slate-400 mt-2.5">
                  <div>PM2.5: <strong class="text-slate-200">${s.pm25} µg/m³</strong></div>
                  <div>PM10: <strong class="text-slate-200">${s.pm10} µg/m³</strong></div>
                </div>

                ${s.distanceKm !== null ? `
                  <div class="mt-1.5 text-[11px] text-cyan-400 font-medium">
                    ${s.distanceKm} km from your position
                  </div>
                ` : ''}

                <p class="text-xs text-slate-400 mt-2 leading-relaxed">${s.reason}</p>
              </div>

              <div class="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <button class="text-slate-300 hover:text-white font-medium" onclick="window.selectCityFromMap('${s.name}')">
                  Set Active →
                </button>
                <button class="text-slate-400 hover:text-slate-200 text-[11px]" onclick="window.focusStationOnMap('${s.id}')">
                  Focus on Map
                </button>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    if (window.stationMarkersMap) {
      const activeIds = new Set(stations.map(s => s.id));
      Object.keys(window.stationMarkersMap).forEach(id => {
        const marker = window.stationMarkersMap[id];
        if (activeIds.has(id)) {
          marker.setStyle({ opacity: 0.9, fillOpacity: 0.8 });
        } else {
          marker.setStyle({ opacity: 0.15, fillOpacity: 0.1 });
        }
      });
    }
  };

  // Attach Listeners
  const locateBtn = document.getElementById('btn-map-locate');
  if (locateBtn) {
    locateBtn.addEventListener('click', () => {
      detectUserLocation(false, true);
    });
  }

  const trackBtn = document.getElementById('btn-map-track');
  if (trackBtn) {
    trackBtn.addEventListener('click', () => {
      toggleLiveTracking();
    });
  }

  const nearestBtn = document.getElementById('btn-map-nearest');
  if (nearestBtn) {
    nearestBtn.addEventListener('click', () => {
      if (!state.userCoords) {
        detectUserLocation(false, true);
      } else {
        const nr = findNearestStation(state.userCoords.lat, state.userCoords.lon);
        window.focusStationOnMap(nr.station.id);
      }
    });
  }

  const layerSelector = document.getElementById('map-layer-selector');
  if (layerSelector) {
    layerSelector.addEventListener('change', (e) => {
      state.mapLayer = e.target.value;
      localStorage.setItem('vayusaathi_map_layer', state.mapLayer);
      localStorage.setItem('hawawise_map_layer', state.mapLayer);
      if (window.leafletMapInstance && window.tileLayerInstance) {
        updateMapTileLayer(window.leafletMapInstance, state.mapLayer);
      }
    });
  }

  const fsBtn = document.getElementById('btn-map-fullscreen');
  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      window.toggleMapFullscreen();
    });
  }

  const searchInput = document.getElementById('station-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.mapSearchQuery = e.target.value;
      window.updateStationCardsAndMarkers();
    });
  }

  const sortSelector = document.getElementById('station-sort');
  if (sortSelector) {
    sortSelector.addEventListener('change', (e) => {
      state.mapSort = e.target.value;
      window.updateStationCardsAndMarkers();
    });
  }

  // Initialize Map
  setTimeout(() => {
    initLeafletMap(filtered);
  }, 50);
}

function updateMapTileLayer(map, layerKey) {
  if (window.tileLayerInstance) {
    try {
      map.removeLayer(window.tileLayerInstance);
    } catch (e) {}
  }

  const gmapsKey = state.googleMapsKey || localStorage.getItem('vayusaathi_google_maps_key') || '';
  const keyParam = gmapsKey ? `&key=${encodeURIComponent(gmapsKey)}` : '';

  let tileUrl = 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}' + keyParam;
  let attrib = '&copy; <a href="https://maps.google.com" target="_blank" rel="noopener" class="underline text-slate-400">Google Maps</a>';
  let subdomains = ['0', '1', '2', '3'];
  let maxZoom = 20;

  switch (layerKey) {
    case 'google_satellite':
      tileUrl = 'https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}' + keyParam;
      attrib = '&copy; Google Satellite Imagery';
      break;
    case 'google_hybrid':
      tileUrl = 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}' + keyParam;
      attrib = '&copy; Google Maps Hybrid (Satellite & Streets)';
      break;
    case 'google_terrain':
      tileUrl = 'https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}' + keyParam;
      attrib = '&copy; Google Maps Topographic Terrain';
      break;
    case 'google_traffic':
      tileUrl = 'https://mt{s}.google.com/vt/lyrs=m,traffic&x={x}&y={y}&z={z}' + keyParam;
      attrib = '&copy; Google Maps Real-time Traffic';
      break;
    case 'dark':
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      attrib = '&copy; OpenStreetMap &copy; CARTO';
      subdomains = ['a', 'b', 'c', 'd'];
      maxZoom = 19;
      break;
    case 'osm':
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attrib = '&copy; OpenStreetMap contributors';
      subdomains = ['a', 'b', 'c'];
      maxZoom = 19;
      break;
    case 'google_streets':
    default:
      tileUrl = 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}' + keyParam;
      attrib = '&copy; <a href="https://maps.google.com" target="_blank" rel="noopener" class="underline text-slate-400">Google Maps</a>';
      break;
  }

  window.tileLayerInstance = L.tileLayer(tileUrl, {
    attribution: attrib,
    subdomains: subdomains,
    maxZoom: maxZoom
  }).addTo(map);
}

function initLeafletMap(stations) {
  if (!window.L) return;
  const mapEl = document.getElementById('mapContainer');
  if (!mapEl) return;

  // Safe removal of old instance to prevent "Map container is already initialized"
  if (window.leafletMapInstance) {
    try {
      window.leafletMapInstance.remove();
    } catch (e) {
      // ignore
    }
    window.leafletMapInstance = null;
  }

  const initialLat = state.userCoords ? state.userCoords.lat : 28.6139;
  const initialLon = state.userCoords ? state.userCoords.lon : 77.2090;
  const initialZoom = state.userCoords ? 12 : 11;

  const map = L.map('mapContainer', {
    zoomControl: true,
    attributionControl: true
  }).setView([initialLat, initialLon], initialZoom);

  window.leafletMapInstance = map;
  window.stationMarkersMap = {};

  // Attach Tile Layer
  updateMapTileLayer(map, state.mapLayer);

  // Add Scale Control
  L.control.scale({ imperial: false, metric: true, position: 'bottomleft' }).addTo(map);

  // User Marker & Accuracy Circle if position exists
  if (state.userCoords) {
    updateMapUserPosition(
      state.userCoords.lat, 
      state.userCoords.lon, 
      state.userCoords.accuracy, 
      state.userCoords.locality,
      state.nearestStation
    );
  }

  // Add Stations
  stations.forEach(st => {
    let color = '#10B981';
    if (st.aqi > 400) color = '#f43f5e';
    else if (st.aqi > 300) color = '#ef4444';
    else if (st.aqi > 200) color = '#f97316';
    else if (st.aqi > 100) color = '#f59e0b';

    const circle = L.circleMarker([st.lat, st.lon], {
      radius: st.aqi > 400 ? 10 : 8,
      fillColor: color,
      color: '#ffffff',
      weight: 1.5,
      opacity: 0.9,
      fillOpacity: 0.8
    }).addTo(map);

    window.stationMarkersMap[st.id] = circle;

    circle.bindPopup(`
      <div class="p-1 min-w-[200px]">
        <h4 class="font-semibold text-xs text-slate-100">${st.name}</h4>
        <div class="text-[11px] mt-1">
          AQI: <strong style="color: ${color}">${st.aqi}</strong> 
          <span class="text-slate-400">(${st.cat})</span>
        </div>
        <div class="text-[11px] text-slate-400 mt-0.5">PM2.5: <strong class="text-slate-200">${st.pm25} µg/m³</strong> • PM10: ${st.pm10} µg/m³</div>
        ${st.distanceKm !== null && st.distanceKm !== undefined ? `
          <div class="text-[11px] text-cyan-400 mt-1 font-medium">Distance: ${st.distanceKm} km from you</div>
        ` : ''}
        <p class="text-[11px] text-slate-400 mt-1.5 leading-relaxed">${st.reason}</p>
        <div class="mt-2.5 pt-2 border-t border-slate-800">
          <button onclick="window.selectCityFromMap('${st.name}')" class="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium py-1 px-2 rounded transition">
            Set as Active Location
          </button>
        </div>
      </div>
    `);
  });

  // Map Click Listener - Inspect Any Point
  map.on('click', async (e) => {
    const { lat, lng } = e.latlng;
    inspectCoordinateOnMap(map, lat, lng);
  });

  // Smooth resize invalidation
  setTimeout(() => {
    if (map) map.invalidateSize();
  }, 150);
}

function inspectCoordinateOnMap(map, lat, lng) {
  if (window.inspectedMarker) {
    map.removeLayer(window.inspectedMarker);
  }

  const nearest = findNearestStation(lat, lng);

  window.inspectedMarker = L.circleMarker([lat, lng], {
    radius: 8,
    fillColor: '#38bdf8',
    color: '#ffffff',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.9
  }).addTo(map);

  window.inspectedMarker.bindPopup(`
    <div class="p-1 min-w-[190px]">
      <div class="font-semibold text-xs text-slate-100">Inspected Coordinates</div>
      <div class="text-[11px] text-slate-400 mt-0.5">${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E</div>
      <div class="text-[11px] text-slate-300 mt-1">
        Nearest: <strong>${nearest.station.name}</strong> (${nearest.distanceKm} km)
      </div>
      <div class="mt-2.5 pt-2 border-t border-slate-800">
        <button onclick="window.setActiveFromCoordinates(${lat}, ${lng})" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium py-1 px-2 rounded transition">
          Set as Active Location
        </button>
      </div>
    </div>
  `).openPopup();
}

window.setActiveFromCoordinates = async function (lat, lon) {
  state.userCoords = {
    lat: lat,
    lon: lon,
    accuracy: 25,
    locality: `Custom Location (${lat.toFixed(3)}°, ${lon.toFixed(3)}°)`,
    timestamp: new Date().toLocaleTimeString()
  };
  state.nearestStation = findNearestStation(lat, lon);
  state.airQuality = await api.getAirQuality("Custom Location", lat, lon);
  state.currentCity = state.userCoords.locality;
  updateTopHeaderMetrics();
  alert(`Active location updated to coordinates ${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E.`);
  navigateTo('dashboard');
};

window.focusStationOnMap = function (stationId) {
  const st = ALL_STATIONS.find(s => s.id === stationId);
  const map = window.leafletMapInstance;
  if (!st || !map) return;

  map.flyTo([st.lat, st.lon], 14, { duration: 1.0 });

  const marker = window.stationMarkersMap ? window.stationMarkersMap[stationId] : null;
  if (marker) {
    marker.openPopup();
  }
};

window.setMapFilter = function (filterKey) {
  state.mapFilter = filterKey;
  if (typeof window.updateStationCardsAndMarkers === 'function') {
    window.updateStationCardsAndMarkers();
    // Update active visual button styling
    document.querySelectorAll('[data-map-filter]').forEach(btn => {
      const k = btn.getAttribute('data-map-filter');
      if (k === filterKey) {
        btn.classList.add('bg-slate-800', 'text-white', 'border-slate-600');
        btn.classList.remove('bg-slate-900/60', 'text-slate-400', 'border-slate-800');
      } else {
        btn.classList.remove('bg-slate-800', 'text-white', 'border-slate-600');
        btn.classList.add('bg-slate-900/60', 'text-slate-400', 'border-slate-800');
      }
    });
  } else {
    const content = document.getElementById('main-content');
    if (content && state.currentView === 'map') {
      renderAirQualityMap(content);
    }
  }
};

window.selectCityFromMap = async function (cityName) {
  const matchedStation = ALL_STATIONS.find(s => s.name === cityName || s.name.startsWith(cityName));
  if (matchedStation) {
    state.userCoords = {
      lat: matchedStation.lat,
      lon: matchedStation.lon,
      accuracy: 50,
      locality: matchedStation.name,
      timestamp: new Date().toLocaleTimeString()
    };
    state.nearestStation = { station: matchedStation, distanceKm: 0 };
    state.currentCity = matchedStation.name;
    state.airQuality = await api.getAirQuality(matchedStation.city, matchedStation.lat, matchedStation.lon);
  } else {
    state.userCoords = null;
    state.currentCity = cityName;
    state.airQuality = await api.getAirQuality(cityName);
  }
  updateTopHeaderMetrics();
  navigateTo('dashboard');
};

/* =========================================================================
   3. ASSISTANT VIEW (Refined Conversational Interface)
   ========================================================================= */
function renderAiAssistant(container) {
  const aq = state.airQuality || { aqi: 350, category: 'Very Poor', city: 'Delhi NCR' };

  container.innerHTML = `
    <div class="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-xl md:text-2xl font-semibold tracking-tight text-white">
          Assistant
        </h1>
        <p class="text-xs text-slate-400 mt-0.5">
          Ask questions about local pollution levels, daily schedules, or household precautions.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button id="btn-clear-chat" class="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition">
          Clear History
        </button>
      </div>
    </div>

    <!-- Active Context Status -->
    <div class="glass-panel px-4 py-2.5 mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
      <div class="flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span>Context: <strong class="text-slate-200">${aq.city}</strong></span>
        <span>·</span>
        <span>AQI <strong style="color: ${aq.color}">${aq.aqi}</strong> (${aq.category})</span>
      </div>
      <div class="text-[11px] text-slate-500">
        Household: ${state.profile ? `${state.profile.household_size} members (${state.profile.children_count} kids, ${state.profile.seniors_count} seniors)` : '4 members'}
      </div>
    </div>

    <!-- Chat Container -->
    <div class="glass-panel p-4 flex flex-col justify-between" style="min-height: 520px;">
      
      <div id="chat-messages" class="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 max-h-[460px]">
        <!-- Welcome Message -->
        <div class="flex items-start gap-3">
          <div class="w-7 h-7 rounded-md bg-slate-900 border border-slate-700/80 text-emerald-500 flex items-center justify-center font-bold text-xs shrink-0">
            H
          </div>
          <div class="chat-bubble-assistant p-4 text-xs md:text-sm text-slate-200 max-w-2xl leading-relaxed">
            <p><strong>Hello.</strong> I can help you interpret ambient smog indicators, organize low-exposure daily routines, and establish household air filtration practices.</p>
            <p class="mt-2 text-slate-400">How can I assist you today?</p>
          </div>
        </div>

        <!-- Render Stored Messages -->
        ${state.chatMessages.map(m => `
          <div class="flex items-start gap-3 ${m.role === 'user' ? 'justify-end' : ''}">
            ${m.role !== 'user' ? `
              <div class="w-7 h-7 rounded-md bg-slate-900 border border-slate-700/80 text-emerald-500 flex items-center justify-center font-bold text-xs shrink-0">
                H
              </div>
            ` : ''}
            <div class="${m.role === 'user' ? 'chat-bubble-user p-3 max-w-lg text-xs md:text-sm' : 'chat-bubble-assistant p-4 max-w-2xl text-xs md:text-sm text-slate-200 prose-chat leading-relaxed'}">
              ${formatChatMarkdown(m.content)}
              ${m.role !== 'user' && m.ai_provider ? `
                <div class="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>${m.ai_provider === 'google_gemini_api' ? 'Model: Gemini 2.5 Flash' : 'Environmental Knowledge Engine'}</span>
                  <span>CPCB / WHO Standards</span>
                </div>
              ` : ''}
            </div>
            ${m.role === 'user' ? `
              <div class="w-7 h-7 rounded-md bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center text-xs shrink-0">
                You
              </div>
            ` : ''}
          </div>
        `).join('')}

        <!-- Typing Indicator -->
        <div id="typing-indicator" class="hidden items-center gap-2 text-xs text-slate-400 pl-10">
          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
          <span>Analyzing environmental factors...</span>
        </div>
      </div>

      <!-- Suggested Prompt Chips -->
      <div class="mb-3 flex flex-wrap gap-2">
        <button class="bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-md border border-slate-800 transition" onclick="window.sendPrompt('What precautions should I take during thermal inversion smog?')">
          Precautions during severe smog
        </button>
        <button class="bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-md border border-slate-800 transition" onclick="window.sendPrompt('Is morning outdoor jogging or cycling advisable today?')">
          Morning outdoor exercise advice
        </button>
        <button class="bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-md border border-slate-800 transition" onclick="window.sendPrompt('How can I protect children and elderly family members indoors?')">
          Protecting vulnerable household members
        </button>
        <button class="bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-md border border-slate-800 transition" onclick="window.sendPrompt('Suggest a low-emission commuting alternative for my route.')">
          Low-emission commute alternatives
        </button>
      </div>

      <!-- Input Bar -->
      <form id="chat-form" class="flex items-center gap-2">
        <input 
          type="text" 
          id="chat-input"
          class="flex-1 bg-slate-900 border border-slate-700/80 text-slate-200 text-xs md:text-sm rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-slate-500"
          placeholder="Ask a question about air quality, ventilation, or routines..."
          autocomplete="off"
        />
        <button 
          type="submit" 
          id="btn-send-chat"
          class="bg-slate-800 hover:bg-slate-700 text-white font-medium px-4 py-2.5 rounded-lg text-xs md:text-sm transition flex items-center gap-1.5"
        >
          <span>Send</span>
          ${icons.send}
        </button>
      </form>

    </div>
  `;

  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const clearBtn = document.getElementById('btn-clear-chat');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text || state.isGeneratingAI) return;
      input.value = '';
      await handleUserChatMessage(text);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', async () => {
      await api.clearChatHistory();
      state.chatMessages = [];
      renderAiAssistant(container);
    });
  }

  scrollChatToBottom();
}

window.sendPrompt = async function (promptText) {
  await handleUserChatMessage(promptText);
};

async function handleUserChatMessage(text) {
  state.chatMessages.push({ role: 'user', content: text });
  renderCurrentView();

  const typing = document.getElementById('typing-indicator');
  if (typing) typing.classList.remove('hidden');
  state.isGeneratingAI = true;

  try {
    const aq = state.airQuality || { aqi: 350, category: 'Very Poor', city: 'Delhi NCR' };
    const resp = await api.sendMessage(state.chatMessages, {
      city: aq.city,
      aqi: aq.aqi,
      category: aq.category,
      pm2_5: aq.pollutants?.pm2_5?.value || 180.0,
      temperature_inversion: aq.weather?.temperature_inversion_detected ?? true
    });

    state.chatMessages.push({
      role: 'assistant',
      content: resp.reply,
      ai_provider: resp.ai_provider
    });
  } catch (err) {
    state.chatMessages.push({
      role: 'assistant',
      content: "Temporary connection error. Please verify network or API settings.",
      ai_provider: "offline_structured_expert_engine"
    });
  } finally {
    state.isGeneratingAI = false;
    renderCurrentView();
  }
}

function scrollChatToBottom() {
  const box = document.getElementById('chat-messages');
  if (box) box.scrollTop = box.scrollHeight;
}

function formatChatMarkdown(txt) {
  if (!txt) return '';
  return txt
    .replace(/^### (.*$)/gim, '<h3 class="text-slate-200 font-semibold text-xs mt-3 mb-1">$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
    .replace(/\n\n/gim, '<br><br>');
}

/* =========================================================================
   4. FAMILY PROTECTION VIEW
   ========================================================================= */
function renderFamilyProtection(container) {
  const p = state.profile || {
    household_size: 4, children_count: 1, seniors_count: 1,
    has_asthma_respiratory: 1, commute_mode: 'two_wheeler', daily_commute_km: 18.0,
    home_ventilation: 'split_ac_windows', has_air_purifier: 0
  };

  container.innerHTML = `
    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl md:text-2xl font-semibold tracking-tight text-white">
          Household Protection
        </h1>
        <p class="text-xs text-slate-400 mt-0.5">
          Exposure mitigation protocols for sensitive age groups and respiratory health.
        </p>
      </div>

      <button id="btn-gen-family-plan" class="bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs px-4 py-2 rounded-lg transition flex items-center gap-1.5">
        ${icons.sparkles}
        <span>Generate Protection Plan</span>
      </button>
    </div>

    <!-- Informational Note -->
    <div class="mb-6 p-3.5 rounded-lg border border-slate-800 bg-slate-900/40 text-xs text-slate-400 flex items-start gap-3">
      <div class="text-slate-500 mt-0.5 shrink-0">${icons.info}</div>
      <p class="leading-relaxed">
        <strong>Advisory:</strong> Household sizing is used solely to calibrate behavioral air filtration recommendations. VayuSaathi provides environmental science guidance and non-medical precautions. Consult qualified healthcare professionals for medical conditions.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      
      <!-- Household Profile Form -->
      <div class="glass-panel p-5 col-span-1">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">
          Household Profile
        </h2>

        <form id="profile-form" class="space-y-4 text-xs">
          <div>
            <label class="block text-slate-400 mb-1">Household Members</label>
            <input type="number" id="p-size" class="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-slate-200" value="${p.household_size}" min="1" max="15"/>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-slate-400 mb-1">Children (&lt;12)</label>
              <input type="number" id="p-kids" class="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-slate-200" value="${p.children_count}" min="0"/>
            </div>
            <div>
              <label class="block text-slate-400 mb-1">Seniors (&gt;60)</label>
              <input type="number" id="p-seniors" class="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-slate-200" value="${p.seniors_count}" min="0"/>
            </div>
          </div>

          <div>
            <label class="block text-slate-400 mb-1">Respiratory Sensitivity</label>
            <select id="p-asthma" class="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-slate-200">
              <option value="1" ${p.has_asthma_respiratory ? 'selected' : ''}>Yes, member has asthma or bronchitis</option>
              <option value="0" ${!p.has_asthma_respiratory ? 'selected' : ''}>No diagnosed sensitivity</option>
            </select>
          </div>

          <div>
            <label class="block text-slate-400 mb-1">Primary Commute Mode</label>
            <select id="p-commute" class="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-slate-200">
              <option value="two_wheeler" ${p.commute_mode === 'two_wheeler' ? 'selected' : ''}>Two-Wheeler</option>
              <option value="petrol_car_solo" ${p.commute_mode === 'petrol_car_solo' ? 'selected' : ''}>Car (Solo)</option>
              <option value="electric_metro" ${p.commute_mode === 'electric_metro' ? 'selected' : ''}>Metro Rail</option>
              <option value="cng_city_bus" ${p.commute_mode === 'cng_city_bus' ? 'selected' : ''}>Public Bus</option>
              <option value="carpool_3person" ${p.commute_mode === 'carpool_3person' ? 'selected' : ''}>Carpool</option>
            </select>
          </div>

          <div>
            <label class="block text-slate-400 mb-1">Round Trip Distance (km)</label>
            <input type="number" id="p-dist" class="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-slate-200" value="${p.daily_commute_km}" min="1" max="150"/>
          </div>

          <div>
            <label class="block text-slate-400 mb-1">Air Purifier Available</label>
            <select id="p-purifier" class="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-slate-200">
              <option value="1" ${p.has_air_purifier ? 'selected' : ''}>Yes, True HEPA Purifier available</option>
              <option value="0" ${!p.has_air_purifier ? 'selected' : ''}>No HEPA Purifier in home</option>
            </select>
          </div>

          <button type="submit" class="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-lg transition text-xs mt-2">
            Save Profile
          </button>
        </form>
      </div>

      <!-- Action Plan Display Area -->
      <div id="family-plan-display" class="col-span-1 lg:col-span-2 glass-panel p-5">
        <div class="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Protection Protocols
          </h2>
          <span class="text-[11px] px-2 py-0.5 rounded border border-slate-700 text-slate-400">
            ${state.airQuality?.category || 'Very Poor'} Conditions
          </span>
        </div>

        <div class="space-y-3.5">
          <div class="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
            <h3 class="font-semibold text-slate-200 text-xs">
              Child Respiratory Defense (&lt;12 Years)
            </h3>
            <p class="text-xs text-slate-400 mt-1 leading-relaxed">
              Children inhale approximately 50% more air per kilogram of body weight than adults. During elevated pollution episodes, prioritize indoor activity for school recess and provide certified pediatric N95 respirators.
            </p>
          </div>

          <div class="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
            <h3 class="font-semibold text-slate-200 text-xs">
              Cardiovascular & Senior Protocol (&gt;60 Years)
            </h3>
            <p class="text-xs text-slate-400 mt-1 leading-relaxed">
              Fine PM2.5 crosses into circulation, contributing to vascular inflammation. Seniors should avoid morning walks prior to 10:00 AM when thermal inversion is most pronounced, and maintain regular hydration.
            </p>
          </div>

          <div class="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
            <h3 class="font-semibold text-slate-200 text-xs">
              Living Area Safe-Haven
            </h3>
            <p class="text-xs text-slate-400 mt-1 leading-relaxed">
              Designate a primary bedroom as the sealed filtration zone. Operate HEPA air purifiers continuously, minimize door gaps, and eliminate indoor incense or mosquito coil burning.
            </p>
          </div>
        </div>

        <!-- Daily Family Checklist -->
        <div class="mt-6 pt-4 border-t border-slate-800">
          <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Daily Checklist</h3>
          <div class="space-y-2 text-xs">
            <label class="flex items-center gap-2.5 cursor-pointer text-slate-400 hover:text-slate-200">
              <input type="checkbox" class="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-0" checked />
              <span>Verified morning AQI and inversion status before school commute</span>
            </label>
            <label class="flex items-center gap-2.5 cursor-pointer text-slate-400 hover:text-slate-200">
              <input type="checkbox" class="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-0" checked />
              <span>Prepared certified N95 respirators for outdoor travel</span>
            </label>
            <label class="flex items-center gap-2.5 cursor-pointer text-slate-400 hover:text-slate-200">
              <input type="checkbox" class="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-0" />
              <span>Kept windows sealed during peak morning stagnation hours</span>
            </label>
            <label class="flex items-center gap-2.5 cursor-pointer text-slate-400 hover:text-slate-200">
              <input type="checkbox" class="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-0" />
              <span>Inspected purifier pre-filter for particulate buildup</span>
            </label>
          </div>
        </div>

      </div>

    </div>
  `;

  const form = document.getElementById('profile-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const updated = {
        household_size: parseInt(document.getElementById('p-size').value),
        children_count: parseInt(document.getElementById('p-kids').value),
        seniors_count: parseInt(document.getElementById('p-seniors').value),
        has_asthma_respiratory: parseInt(document.getElementById('p-asthma').value),
        commute_mode: document.getElementById('p-commute').value,
        daily_commute_km: parseFloat(document.getElementById('p-dist').value),
        has_air_purifier: parseInt(document.getElementById('p-purifier').value)
      };
      await api.saveProfile(updated);
      state.profile = updated;
      alert("Household profile updated.");
    });
  }

  const genBtn = document.getElementById('btn-gen-family-plan');
  if (genBtn) {
    genBtn.addEventListener('click', async () => {
      genBtn.innerHTML = `<span>Updating...</span>`;
      await api.generateFamilyPlan(state.currentCity);
      genBtn.innerHTML = `${icons.sparkles} <span>Generate Protection Plan</span>`;
      alert("Personalized protection plan generated.");
    });
  }
}

/* =========================================================================
   5. DAILY ROUTINE VIEW
   ========================================================================= */
function renderDailyRoutine(container) {
  const aq = state.airQuality || { aqi: 350, category: 'Very Poor', city: 'Delhi NCR' };
  const r = state.currentRoutine || {
    title: `Clean-Air Daily Schedule (${aq.category})`,
    aqi_context: `AQI ${aq.aqi} (${aq.category})`,
    morning: [
      { time: "06:30 AM", action: "Indoor Exercise in Purified Space", why: "Avoid outdoor running during severe morning thermal inversion peak.", env_benefit: "Zero cold start vehicle emissions", personal_benefit: "Eliminates ~180 µg of toxic particulate inhalation" },
      { time: "07:30 AM", action: "Induction Cooking with Range Hood", why: "Unvented shallow frying generates indoor PM2.5 exceeding 350 µg/m³.", env_benefit: "Reduces combustion soot", personal_benefit: "Keeps living area particulate levels safe" },
      { time: "08:15 AM", action: "Commute via Electric Metro", why: "Road corridors produce acute toxic NO2 and black carbon.", env_benefit: "Avoids ~1.8 kg CO2 and 0.52g PM2.5 per trip", personal_benefit: "Filtered metro train cuts particulate exposure by 50%" }
    ],
    afternoon: [
      { time: "01:15 PM", action: "15-Minute Leeward Cross-Ventilation", why: "Midday solar insolation creates thermal updrafts that disperse surface smog.", env_benefit: "Lowers indoor CO2 naturally", personal_benefit: "Reduces afternoon fatigue" },
      { time: "02:30 PM", action: "Consolidate Errands & Virtual Meetings", why: "Eliminates short non-essential trips that have higher cold-start emissions.", env_benefit: "Avoids 0.8 kg CO2", personal_benefit: "Minimizes road travel during smog hours" }
    ],
    evening: [
      { time: "06:30 PM", action: "Reseal Windows & Damp Microfiber Mopping", why: "Evening inversion re-accumulates smog; dry brooms resuspend PM10 dust.", env_benefit: "Eliminates aerosol spray need", personal_benefit: "Prevents nighttime respiratory irritation" },
      { time: "09:00 PM", action: "HEPA Purifier Bedroom Activation", why: "Eight hours of continuous clean air allows alveolar recovery.", env_benefit: "Efficient BLDC motor draws under 20W", personal_benefit: "Restorative sleep quality" }
    ],
    total_co2_avoided_kg: 2.6,
    total_pm_avoided_g: 0.94
  };

  container.innerHTML = `
    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl md:text-2xl font-semibold tracking-tight text-white">
          Daily Schedule
        </h1>
        <p class="text-xs text-slate-400 mt-0.5">
          Smog-optimized schedule designed to minimize exposure during diurnal peaks.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button id="btn-save-routine" class="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 font-medium text-xs px-3 py-2 rounded-lg transition">
          Save Schedule
        </button>
        <button id="btn-regen-routine" class="bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs px-3.5 py-2 rounded-lg transition flex items-center gap-1.5">
          ${icons.refresh}
          <span>Regenerate</span>
        </button>
      </div>
    </div>

    <!-- Impact Milestone Banner -->
    <div class="glass-panel p-4 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-900/40">
      <div>
        <div class="font-medium text-slate-200">Estimated Footprint Avoided Today</div>
        <div class="text-slate-400 mt-0.5">Calculated by adopting low-exposure timeline alternatives:</div>
      </div>
      <div class="flex items-center gap-4">
        <div>
          <span class="text-slate-400">CO2 Avoided:</span>
          <strong class="text-emerald-400 font-semibold text-sm ml-1">${r.total_co2_avoided_kg} kg</strong>
        </div>
        <div>
          <span class="text-slate-400">PM2.5 Averted:</span>
          <strong class="text-cyan-400 font-semibold text-sm ml-1">${r.total_pm_avoided_g} g</strong>
        </div>
      </div>
    </div>

    <!-- Routine Columns -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="glass-panel p-5">
        <div class="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Morning (06:00 – 11:00)
          </h2>
          <span class="text-[10px] px-2 py-0.5 rounded border border-rose-500/30 text-rose-400">Peak Inversion</span>
        </div>
        <div class="space-y-3">
          ${r.morning.map((m, idx) => renderRoutineCard(m, idx, 'm')).join('')}
        </div>
      </div>

      <div class="glass-panel p-5">
        <div class="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Midday (11:00 – 16:00)
          </h2>
          <span class="text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-400">Dilution Window</span>
        </div>
        <div class="space-y-3">
          ${r.afternoon.map((m, idx) => renderRoutineCard(m, idx, 'a')).join('')}
        </div>
      </div>

      <div class="glass-panel p-5">
        <div class="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Evening (16:00 – 22:30)
          </h2>
          <span class="text-[10px] px-2 py-0.5 rounded border border-amber-500/30 text-amber-400">Re-accumulation</span>
        </div>
        <div class="space-y-3">
          ${r.evening.map((m, idx) => renderRoutineCard(m, idx, 'e')).join('')}
        </div>
      </div>
    </div>
  `;

  const regenBtn = document.getElementById('btn-regen-routine');
  if (regenBtn) {
    regenBtn.addEventListener('click', async () => {
      regenBtn.innerHTML = `<span>Updating...</span>`;
      const newRoutine = await api.generateRoutine(state.currentCity, aq.aqi, aq.category);
      state.currentRoutine = newRoutine;
      renderDailyRoutine(container);
    });
  }

  const saveBtn = document.getElementById('btn-save-routine');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      await api.saveRoutine(r);
      alert("Routine saved to profile.");
    });
  }
}

function renderRoutineCard(item, idx, prefix) {
  return `
    <div class="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-300">${item.time}</span>
          <input type="checkbox" id="${prefix}-${idx}" class="w-3.5 h-3.5 rounded bg-slate-800 border-slate-700 text-emerald-600 focus:ring-0" onchange="window.logRoutineCheck('${item.action}')" />
        </div>
        <h3 class="text-xs font-semibold text-slate-200 mt-1">${item.action}</h3>
        <p class="text-xs text-slate-400 mt-1 leading-relaxed">${item.why}</p>
      </div>
      <div class="mt-3 pt-2 border-t border-slate-800/60 text-[11px] space-y-0.5 text-slate-400">
        <div>Env: <span class="text-slate-300">${item.env_benefit}</span></div>
        <div>Health: <span class="text-slate-300">${item.personal_benefit}</span></div>
      </div>
    </div>
  `;
}

window.logRoutineCheck = async function (actionTitle) {
  await api.logImpactAction({
    action_type: 'routine_habit',
    category: 'household',
    title: actionTitle,
    co2_saved_kg: 0.35,
    pm_saved_g: 0.12,
    points: 15
  });
};

/* =========================================================================
   6. INDOOR AIR QUALITY (IAQ) VIEW
   ========================================================================= */
async function renderIndoorAirQuality(container) {
  if (!state.iaqData) {
    state.iaqData = await api.getIaqIntelligence();
  }
  const data = state.iaqData;

  container.innerHTML = `
    <div class="mb-6">
      <h1 class="text-xl md:text-2xl font-semibold tracking-tight text-white">
        Indoor Air Quality
      </h1>
      <p class="text-xs text-slate-400 mt-0.5">
        Diurnal ventilation windows, indoor emission sources, and room filtration sizing.
      </p>
    </div>

    <!-- Ventilation Timing Windows -->
    <div class="glass-panel p-5 mb-6">
      <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">
        Ventilation Windows
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${data.ventilation_windows.map(w => `
          <div class="p-4 rounded-lg border border-slate-800 bg-slate-900/50 flex flex-col justify-between">
            <div>
              <div class="text-xs font-semibold text-slate-300">${w.time_slot}</div>
              <div class="text-xs font-semibold text-white mt-1">${w.status}</div>
              <p class="text-xs text-slate-400 mt-2 leading-relaxed">${w.reason}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Myth Busters & Combustion Check -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div class="glass-panel p-5">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">
          Common Misconceptions
        </h2>
        <div class="space-y-3">
          ${data.myth_busters.map(m => `
            <div class="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800">
              <div class="text-xs font-medium text-slate-300">
                <span class="text-slate-500">Claim:</span> ${m.myth}
              </div>
              <div class="mt-1.5 text-xs text-slate-400 leading-relaxed">
                <span class="text-slate-500">Finding:</span> ${m.fact}
              </div>
              <div class="mt-2 text-[11px] text-slate-300 bg-slate-900 p-2 rounded border border-slate-800/80">
                Action: ${m.guidance}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="glass-panel p-5">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">
          Indoor Combustion Sources
        </h2>
        <div class="space-y-3">
          ${data.combustion_sources.map(c => `
            <div class="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-slate-200">${c.source}</span>
                <span class="text-[10px] px-2 py-0.5 rounded border border-rose-500/20 text-rose-400">${c.pm25_impact}</span>
              </div>
              <p class="text-xs text-slate-400 mt-1">${c.action}</p>
              <div class="mt-1.5 text-[11px] text-slate-300">
                Alternative: ${c.substitute}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- CADR Room Sizing Calculator -->
    <div class="glass-panel p-5">
      <div class="mb-4">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Air Purifier Room Sizing (CADR)
        </h2>
        <p class="text-xs text-slate-400 mt-0.5">
          Calculate the required Clean Air Delivery Rate (CADR) to achieve 5 Air Changes per Hour (ACH).
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-slate-400 mb-1">Room Area (sq ft)</label>
            <input type="number" id="cadr-area" class="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-slate-200" value="220" min="50" max="1500" />
          </div>
          <div>
            <label class="block text-slate-400 mb-1">Ceiling Height (ft)</label>
            <input type="number" id="cadr-height" class="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-slate-200" value="9" min="7" max="20" />
          </div>
          <button id="btn-calc-cadr" class="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-lg text-xs transition">
            Calculate CADR
          </button>
        </div>

        <div id="cadr-result" class="col-span-2 p-5 rounded-lg bg-slate-900/50 border border-slate-800 flex flex-col justify-center">
          <div class="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Recommended Clean Air Delivery Rate</div>
          <div class="text-2xl font-bold text-white mt-1">280 m³/hr <span class="text-xs font-normal text-slate-400">(~165 CFM)</span></div>
          <p class="text-xs text-slate-400 mt-2 leading-relaxed">
            For a <strong>220 sq ft</strong> room with 9 ft ceiling (volume: ~56 m³), this provides <strong>5.0 Air Changes per Hour (ACH)</strong>, clearing penetrated particulates efficiently during high-pollution events.
          </p>
        </div>
      </div>
    </div>
  `;

  const calcBtn = document.getElementById('btn-calc-cadr');
  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      const area = parseFloat(document.getElementById('cadr-area').value) || 200;
      const height = parseFloat(document.getElementById('cadr-height').value) || 9;
      const volumeM3 = (area * height) * 0.0283168;
      const requiredCADR = Math.round(volumeM3 * 5);
      const cfm = Math.round(requiredCADR / 1.7);

      const resBox = document.getElementById('cadr-result');
      if (resBox) {
        resBox.innerHTML = `
          <div class="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Recommended Clean Air Delivery Rate</div>
          <div class="text-2xl font-bold text-white mt-1">${requiredCADR} m³/hr <span class="text-xs font-normal text-slate-400">(~${cfm} CFM)</span></div>
          <p class="text-xs text-slate-400 mt-2 leading-relaxed">
            For a <strong>${area} sq ft</strong> room with ${height} ft ceiling (volume: ~${volumeM3.toFixed(1)} m³), this ensures <strong>5.0 Air Changes per Hour (ACH)</strong> for particle filtration.
          </p>
        `;
      }
    });
  }
}

/* =========================================================================
   7. SUSTAINABLE ALTERNATIVES VIEW
   ========================================================================= */
async function renderAlternatives(container) {
  const comp = await api.compareAlternatives(state.tripDistanceKm);

  container.innerHTML = `
    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl md:text-2xl font-semibold tracking-tight text-white">
          Clean Transit & Habits
        </h1>
        <p class="text-xs text-slate-400 mt-0.5">
          Quantified emissions comparison across urban commute modes and household choices.
        </p>
      </div>

      <div class="flex items-center gap-3 glass-panel px-3.5 py-1.5 text-xs">
        <label class="text-slate-400">Distance:</label>
        <input 
          type="range" 
          id="trip-slider" 
          min="5" 
          max="50" 
          step="5" 
          value="${state.tripDistanceKm}"
          class="w-24 sm:w-32 accent-slate-400"
        />
        <span id="trip-val" class="font-semibold text-slate-200 min-w-[45px]">${state.tripDistanceKm} km</span>
      </div>
    </div>

    <!-- Baseline Notice -->
    <div class="mb-6 p-3.5 rounded-lg border border-slate-800 bg-slate-900/40 text-xs text-slate-400 flex items-start gap-3">
      <div class="text-slate-500 mt-0.5 shrink-0">${icons.info}</div>
      <div>
        <div class="font-medium text-slate-300">Baseline Reference: Single-Occupancy Petrol Vehicle (1.2L BS-VI)</div>
        <p class="text-slate-400 mt-0.5">
          A ${state.tripDistanceKm} km round trip emits <strong>${comp.baseline.co2_emitted_kg} kg CO2</strong> and <strong>${comp.baseline.pm25_emitted_g} g PM2.5</strong> into the urban canopy.
        </p>
      </div>
    </div>

    <!-- Comparative Table -->
    <div class="glass-panel p-5 mb-6 overflow-x-auto">
      <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">
        Transport Modes (${state.tripDistanceKm} km Commute)
      </h2>
      <table class="w-full text-left text-xs text-slate-300 min-w-[560px]">
        <thead>
          <tr class="border-b border-slate-800 text-slate-500 uppercase text-[10px]">
            <th class="pb-2.5 font-medium">Mode</th>
            <th class="pb-2.5 font-medium">CO2 Emitted</th>
            <th class="pb-2.5 font-medium">PM2.5 Emitted</th>
            <th class="pb-2.5 font-medium">CO2 Avoided</th>
            <th class="pb-2.5 font-medium">PM2.5 Avoided</th>
            <th class="pb-2.5 font-medium">Reduction</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/80">
          ${comp.comparisons.map(c => `
            <tr class="hover:bg-slate-900/40 transition">
              <td class="py-2.5 font-medium text-slate-200">${c.name}</td>
              <td class="py-2.5 text-slate-400">${c.co2_emitted_kg} kg</td>
              <td class="py-2.5 text-slate-400">${c.pm25_emitted_g} g</td>
              <td class="py-2.5 text-emerald-400 font-medium">${c.co2_saved_kg > 0 ? `+${c.co2_saved_kg} kg` : '0 kg'}</td>
              <td class="py-2.5 text-cyan-400 font-medium">${c.pm25_saved_g > 0 ? `+${c.pm25_saved_g} g` : '0 g'}</td>
              <td class="py-2.5">
                <span class="px-2 py-0.5 rounded text-[10px] font-medium ${c.reduction_percentage > 70 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'}">
                  ${c.reduction_percentage}%
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="mt-3 text-[11px] text-slate-500">
        ${comp.methodology}
      </div>
    </div>

    <!-- Clean Practices Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="glass-panel p-5">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
          Clean Household Practices
        </h2>
        <div class="space-y-3 text-xs">
          <div class="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800">
            <div class="font-medium text-slate-200">Induction Cooking vs LPG</div>
            <div class="text-slate-400 mt-0.5">Saves ~0.35 kg CO2 and eliminates indoor nitrogen dioxide accumulation.</div>
          </div>
          <div class="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800">
            <div class="font-medium text-slate-200">Waste Segregation vs Burning</div>
            <div class="text-slate-400 mt-0.5">Preventing 1 kg of open waste burning avoids 8.5g of direct toxic PM2.5.</div>
          </div>
          <div class="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800">
            <div class="font-medium text-slate-200">5-Star Inverter Appliances</div>
            <div class="text-slate-400 mt-0.5">Reduces coal-grid load by 0.82 kg CO2 per kWh conserved.</div>
          </div>
        </div>
      </div>

      <div class="glass-panel p-5">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
          Community Interventions
        </h2>
        <div class="space-y-3 text-xs">
          <div class="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800">
            <div class="font-medium text-slate-200">School Gate Anti-Idling</div>
            <div class="text-slate-400 mt-0.5">Eliminates localized exhaust plumes at children's breathing height.</div>
          </div>
          <div class="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800">
            <div class="font-medium text-slate-200">Leaf Composting Pits</div>
            <div class="text-slate-400 mt-0.5">Converts garden biomass into soil conditioner rather than winter smoke.</div>
          </div>
          <div class="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800">
            <div class="font-medium text-slate-200">Shared Friday Commute</div>
            <div class="text-slate-400 mt-0.5">Reduces arterial vehicle density by 12–18%, mitigating idle gridlock emissions.</div>
          </div>
        </div>
      </div>
    </div>
  `;

  const slider = document.getElementById('trip-slider');
  const tripVal = document.getElementById('trip-val');
  if (slider) {
    slider.addEventListener('input', (e) => {
      state.tripDistanceKm = parseFloat(e.target.value);
      if (tripVal) tripVal.textContent = `${state.tripDistanceKm} km`;
    });
    slider.addEventListener('change', () => {
      renderAlternatives(container);
    });
  }
}

/* =========================================================================
   8. COMMUNITY CLEAN AIR HUB VIEW
   ========================================================================= */
async function renderCommunityHub(container) {
  const hub = await api.getCommunityHub();

  container.innerHTML = `
    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl md:text-2xl font-semibold tracking-tight text-white">
          Community Hub
        </h1>
        <p class="text-xs text-slate-400 mt-0.5">
          Local air quality campaigns, anonymous incident reports, and collective progress.
        </p>
      </div>

      <button id="btn-open-report" class="bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs px-3.5 py-2 rounded-lg transition flex items-center gap-1.5">
        ${icons.plus}
        <span>Report Concern</span>
      </button>
    </div>

    <!-- Community Collective Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="glass-panel p-4">
        <div class="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Active Citizens</div>
        <div class="text-2xl font-bold tracking-tight text-slate-100 mt-1">${hub.community_stats.active_members}</div>
      </div>
      <div class="glass-panel p-4">
        <div class="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Collective CO2 Saved</div>
        <div class="text-2xl font-bold tracking-tight text-emerald-400 mt-1">${hub.community_stats.total_community_co2_saved_kg} kg</div>
      </div>
      <div class="glass-panel p-4">
        <div class="text-[11px] text-slate-500 uppercase tracking-wider font-medium">PM2.5 Averted</div>
        <div class="text-2xl font-bold tracking-tight text-cyan-400 mt-1">${hub.community_stats.total_community_pm_saved_g} g</div>
      </div>
      <div class="glass-panel p-4">
        <div class="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Reports Addressed</div>
        <div class="text-2xl font-bold tracking-tight text-slate-100 mt-1">${hub.community_stats.verified_reports_resolved}</div>
      </div>
    </div>

    <!-- Active Campaigns -->
    <div class="glass-panel p-5 mb-6">
      <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">
        Active Campaigns
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${hub.campaigns.map(c => `
          <div class="p-4 rounded-lg bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
            <div>
              <div class="text-xs font-semibold text-slate-200">${c.title}</div>
              <p class="text-xs text-slate-400 mt-1 leading-relaxed">${c.goal}</p>
              <div class="text-[11px] text-slate-300 mt-2 font-medium">Target: ${c.impact_milestone}</div>
            </div>
            <div class="mt-4 pt-2 border-t border-slate-800/80">
              <div class="flex justify-between text-[10px] text-slate-500 mb-1">
                <span>${c.participants} joined</span>
                <span class="font-medium text-slate-300">${c.progress_pct}%</span>
              </div>
              <div class="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                <div class="bg-slate-300 h-1 rounded-full" style="width: ${c.progress_pct}%"></div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Incident Reports List -->
    <div class="glass-panel p-5">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Local Reports
        </h2>
        <span class="text-[11px] text-slate-500">Anonymous incident feed</span>
      </div>

      <div class="space-y-3">
        ${hub.reports.map(r => `
          <div class="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-semibold text-slate-200">${r.title}</span>
                <span class="text-[10px] px-1.5 py-0.2 rounded font-medium uppercase ${r.severity === 'critical' ? 'border border-rose-500/30 text-rose-400 bg-rose-500/10' : 'border border-amber-500/30 text-amber-400 bg-amber-500/10'}">
                  ${r.severity}
                </span>
                <span class="text-[10px] px-1.5 py-0.2 rounded border border-slate-800 text-slate-500">
                  ${r.status}
                </span>
              </div>
              <p class="text-xs text-slate-400 mt-1">${r.description}</p>
              <div class="text-[11px] text-slate-500 mt-1">Location: ${r.location_name} · ${new Date(r.created_at).toLocaleDateString()}</div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <button class="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1 transition" onclick="window.upvoteReport(${r.id})">
                ${icons.thumbsUp}
                <span>${r.upvotes}</span>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  const reportBtn = document.getElementById('btn-open-report');
  if (reportBtn) {
    reportBtn.addEventListener('click', () => {
      openReportModal();
    });
  }
}

window.upvoteReport = async function (id) {
  await api.upvoteReport(id);
  renderCurrentView();
};

function openReportModal() {
  const modal = document.getElementById('report-modal');
  if (modal) modal.classList.remove('hidden');
}

/* =========================================================================
   9. ENVIRONMENTAL IMPACT TRACKER VIEW
   ========================================================================= */
async function renderImpactTracker(container) {
  const stats = await api.getImpactStats();

  container.innerHTML = `
    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl md:text-2xl font-semibold tracking-tight text-white">
          Impact Tracker
        </h1>
        <p class="text-xs text-slate-400 mt-0.5">
          Quantified carbon and particulate emissions avoided through clean choices.
        </p>
      </div>

      <button id="btn-log-action" class="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-3.5 py-2 rounded-lg transition flex items-center gap-1.5">
        ${icons.plus}
        <span>Log Action</span>
      </button>
    </div>

    <!-- Engagement Score & Metrics -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
      <div class="glass-panel p-5 flex flex-col items-center justify-center text-center">
        <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Sustainability Score</span>
        <div class="relative w-28 h-28 my-3 flex items-center justify-center">
          <svg class="w-full h-full transform -rotate-90">
            <circle cx="56" cy="56" r="44" stroke="rgba(255, 255, 255, 0.08)" stroke-width="8" fill="transparent" />
            <circle cx="56" cy="56" r="44" stroke="#10b981" stroke-width="8" stroke-linecap="round" fill="transparent" stroke-dasharray="276" stroke-dashoffset="${276 - (276 * stats.sustainability_score / 100)}" class="score-circle" />
          </svg>
          <div class="absolute flex flex-col items-center">
            <span class="text-2xl font-bold text-white tracking-tight">${stats.sustainability_score}</span>
            <span class="text-[9px] text-slate-500 uppercase font-medium">/ 100</span>
          </div>
        </div>
        <div class="text-xs font-semibold text-emerald-400">${stats.score_tier}</div>
        <p class="text-[11px] text-slate-500 mt-1 leading-relaxed">
          ${stats.score_explanation}
        </p>
      </div>

      <div class="glass-panel p-5 col-span-1 lg:col-span-3 flex flex-col justify-between">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div class="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800">
            <span class="text-[11px] text-slate-500 uppercase tracking-wider">CO2 Avoided</span>
            <div class="text-2xl font-bold tracking-tight text-emerald-400 mt-1">${stats.total_co2_saved_kg} kg</div>
            <span class="text-[11px] text-slate-500">~${stats.equivalent_metrics.car_kilometers_avoided} km vehicle travel offset</span>
          </div>

          <div class="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800">
            <span class="text-[11px] text-slate-500 uppercase tracking-wider">PM2.5 Averted</span>
            <div class="text-2xl font-bold tracking-tight text-cyan-400 mt-1">${stats.total_pm_saved_g} g</div>
            <span class="text-[11px] text-slate-500">~${stats.equivalent_metrics.clean_air_breathing_hours} hours clean air equivalent</span>
          </div>

          <div class="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800">
            <span class="text-[11px] text-slate-500 uppercase tracking-wider">Tree Absorption</span>
            <div class="text-2xl font-bold tracking-tight text-slate-200 mt-1">${stats.equivalent_metrics.trees_planted_equivalent}</div>
            <span class="text-[11px] text-slate-500">Annual sequestration equivalent</span>
          </div>
        </div>

        <div class="p-3 rounded-lg bg-slate-900/40 border border-slate-800/80 text-[11px] text-slate-400">
          Methodology: ${stats.methodology}
        </div>
      </div>
    </div>

    <!-- 7-Day Avoided Emission Trend -->
    <div class="glass-panel p-5 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Weekly Progress
        </h2>
        <span class="text-[11px] text-slate-500">7-Day Avoided Emissions</span>
      </div>
      <div class="relative h-56 w-full">
        <canvas id="impactChart"></canvas>
      </div>
    </div>

    <!-- Recent Actions Feed -->
    <div class="glass-panel p-5">
      <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4">
        Recent Activity
      </h2>
      <div class="space-y-3">
        ${stats.recent_actions.map(a => `
          <div class="p-3 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center justify-between">
            <div>
              <div class="text-xs font-medium text-slate-200">${a.title}</div>
              <p class="text-xs text-slate-400 mt-0.5">${a.description}</p>
              <div class="text-[10px] text-slate-500 mt-1">${new Date(a.completed_at).toLocaleDateString()}</div>
            </div>
            <div class="text-right">
              <span class="text-xs font-medium text-emerald-400">+${a.co2_saved_kg} kg CO2</span>
              <div class="text-[11px] text-cyan-400">+${a.pm_saved_g} g PM2.5</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  const logBtn = document.getElementById('btn-log-action');
  if (logBtn) {
    logBtn.addEventListener('click', () => {
      openActionModal();
    });
  }

  initImpactChart(stats.weekly_trend);
}

function initImpactChart(weekly) {
  const canvas = document.getElementById('impactChart');
  if (!canvas || !window.Chart) return;

  if (state.charts.impact) {
    state.charts.impact.destroy();
  }

  state.charts.impact = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: weekly.map(w => w.day),
      datasets: [
        {
          label: 'CO2 Avoided (kg)',
          data: weekly.map(w => w.co2_saved_kg),
          backgroundColor: '#10b981',
          borderRadius: 4
        },
        {
          label: 'PM2.5 Avoided (g)',
          data: weekly.map(w => w.pm_saved_g),
          backgroundColor: '#38bdf8',
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#64748b', font: { size: 10 } } }
      },
      scales: {
        x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { display: false } },
        y: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } }
      }
    }
  });
}

function openActionModal() {
  const modal = document.getElementById('action-modal');
  if (modal) modal.classList.remove('hidden');
}

/* =========================================================================
   10. ALERTS & NOTIFICATIONS VIEW
   ========================================================================= */
async function renderAlertsCenter(container) {
  const alertsData = await api.getAlerts();
  state.alerts = alertsData.alerts || [];

  container.innerHTML = `
    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl md:text-2xl font-semibold tracking-tight text-white">
          Alerts & Notifications
        </h1>
        <p class="text-xs text-slate-400 mt-0.5">
          Real-time smog warnings, daylight ventilation windows, and community notifications.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button id="btn-mark-all-read" class="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs px-3 py-1.5 rounded-lg transition">
          Mark All Read
        </button>
      </div>
    </div>

    <!-- Alert Simulation Testing Bar -->
    <div class="glass-panel p-3.5 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-900/40">
      <div class="text-slate-400 font-medium">
        Simulation Triggers:
      </div>
      <div class="flex flex-wrap gap-2">
        <button class="bg-slate-900 hover:bg-slate-800 text-rose-300 border border-slate-700 text-xs px-2.5 py-1 rounded-md transition" onclick="window.triggerSimAlert('smog_spike')">
          Inversion Smog Spike
        </button>
        <button class="bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-700 text-xs px-2.5 py-1 rounded-md transition" onclick="window.triggerSimAlert('ventilation')">
          Ventilation Window
        </button>
        <button class="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs px-2.5 py-1 rounded-md transition" onclick="window.triggerSimAlert('achievement')">
          Milestone Notification
        </button>
      </div>
    </div>

    <!-- Alerts List -->
    <div class="glass-panel p-5">
      <div class="space-y-3">
        ${state.alerts.length === 0 ? `
          <div class="p-8 text-center text-slate-500 text-xs">No active alerts at this moment.</div>
        ` : state.alerts.map(a => `
          <div class="p-3.5 rounded-lg border flex items-start justify-between gap-3 ${a.is_read ? 'bg-slate-900/30 border-slate-800/60 opacity-70' : 'bg-slate-900/70 border-slate-800'}">
            <div class="flex items-start gap-3">
              <span class="w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.severity === 'danger' ? 'bg-rose-500' : (a.severity === 'success' ? 'bg-emerald-500' : 'bg-cyan-500')}"></span>
              <div>
                <div class="text-xs font-semibold text-slate-200 flex items-center gap-2">
                  <span>${a.title}</span>
                  ${!a.is_read ? '<span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>' : ''}
                </div>
                <p class="text-xs text-slate-400 mt-1 leading-relaxed">${a.message}</p>
                <span class="text-[10px] text-slate-500 mt-2 block">${new Date(a.created_at).toLocaleString()}</span>
              </div>
            </div>
            ${!a.is_read ? `
              <button class="text-xs text-slate-400 hover:text-white shrink-0 font-medium" onclick="window.markSingleAlertRead(${a.id})">
                Dismiss
              </button>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;

  const markBtn = document.getElementById('btn-mark-all-read');
  if (markBtn) {
    markBtn.addEventListener('click', async () => {
      await api.markAlertsRead();
      state.alerts.forEach(a => a.is_read = 1);
      updateTopHeaderMetrics();
      renderAlertsCenter(container);
    });
  }
}

window.triggerSimAlert = async function (scenario) {
  await api.triggerDemoAlert(scenario);
  const updated = await api.getAlerts();
  state.alerts = updated.alerts;
  updateTopHeaderMetrics();
  renderCurrentView();
};

window.markSingleAlertRead = async function (id) {
  await api.markAlertsRead(id);
  const updated = await api.getAlerts();
  state.alerts = updated.alerts;
  updateTopHeaderMetrics();
  renderCurrentView();
};

/* =========================================================================
   11. SETTINGS & PREFERENCES VIEW
   ========================================================================= */
async function renderSettings(container) {
  const s = await api.getSettings();
  const gmapsKey = state.googleMapsKey || s.google_maps_api_key || '';
  const hasGmapsKey = Boolean(gmapsKey && gmapsKey.length > 15);
  const geminiKey = s.gemini_api_key || localStorage.getItem('vayusaathi_gemini_key') || '';
  const hasGeminiKey = Boolean(s.has_gemini_key || geminiKey);

  container.innerHTML = `
    <!-- Settings Header -->
    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl md:text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
          <span>Settings & Configuration</span>
        </h1>
        <p class="text-xs text-slate-400 mt-0.5">
          Google Maps engine, API credentials, GPS telemetry, accessibility features, and data management.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button onclick="window.vayusaathiNavigate ? window.vayusaathiNavigate('map') : window.hawawiseNavigate('map')" class="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 px-3.5 py-2 rounded-lg transition flex items-center gap-1.5">
          ${icons.map}
          <span>Go to Map</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Card 1: Google Maps Engine Configuration -->
      <div class="glass-panel p-5 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>Google Maps Engine</span>
            </h2>
            <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full ${hasGmapsKey ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'}">
              ${hasGmapsKey ? 'Keyed Cloud Mode' : 'Zero-Headache Mode'}
            </span>
          </div>

          <div class="p-3 mb-4 rounded-lg border border-slate-800 bg-slate-900/60 text-xs text-slate-400 space-y-1.5 leading-relaxed">
            <div class="flex items-center gap-1.5 text-slate-200 font-medium">
              <span class="text-emerald-400">${icons.check}</span>
              <span>No API Key Required Out-of-the-Box</span>
            </div>
            <p class="text-[11px] text-slate-400">
              Google Maps Roadmap, Satellite, Hybrid, Terrain & Traffic tiles load automatically with zero setup. Entering your own Google Cloud key is 100% optional for high-volume enterprise quotas.
            </p>
          </div>

          <form id="gmaps-key-form" class="space-y-4">
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-xs text-slate-400 font-medium">Google Maps API Key (Optional)</label>
                <a href="https://console.cloud.google.com/google/maps-apis/overview" target="_blank" rel="noopener" class="text-[11px] text-cyan-400 hover:underline">
                  Get Free Key from Google Cloud ↗
                </a>
              </div>
              <div class="relative">
                <input 
                  type="password" 
                  id="gmaps-key-input" 
                  value="${gmapsKey}"
                  class="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-3 pr-20 py-2 text-slate-200 text-xs font-mono focus:outline-none focus:border-slate-500"
                  placeholder="AIzaSy... (optional for custom quota)"
                />
                <button type="button" id="btn-toggle-gmaps-key" class="absolute inset-y-0 right-0 px-2.5 text-[11px] text-slate-400 hover:text-white transition">
                  Show
                </button>
              </div>
            </div>

            <!-- Default Map Layer Preset -->
            <div>
              <label class="block text-xs text-slate-400 mb-1.5 font-medium">Default Map Style</label>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <button type="button" class="px-2.5 py-1.5 rounded-lg border text-left transition ${state.mapLayer === 'google_streets' ? 'bg-slate-800 text-white border-blue-500' : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'}" onclick="window.switchMapLayer('google_streets')">
                  <div class="font-medium text-slate-200">Roadmap</div>
                  <div class="text-[10px] text-slate-500">Google Standard</div>
                </button>
                <button type="button" class="px-2.5 py-1.5 rounded-lg border text-left transition ${state.mapLayer === 'google_satellite' ? 'bg-slate-800 text-white border-blue-500' : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'}" onclick="window.switchMapLayer('google_satellite')">
                  <div class="font-medium text-slate-200">Satellite</div>
                  <div class="text-[10px] text-slate-500">Google Orbital</div>
                </button>
                <button type="button" class="px-2.5 py-1.5 rounded-lg border text-left transition ${state.mapLayer === 'google_hybrid' ? 'bg-slate-800 text-white border-blue-500' : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'}" onclick="window.switchMapLayer('google_hybrid')">
                  <div class="font-medium text-slate-200">Hybrid</div>
                  <div class="text-[10px] text-slate-500">Satellite + Streets</div>
                </button>
                <button type="button" class="px-2.5 py-1.5 rounded-lg border text-left transition ${state.mapLayer === 'google_terrain' ? 'bg-slate-800 text-white border-blue-500' : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'}" onclick="window.switchMapLayer('google_terrain')">
                  <div class="font-medium text-slate-200">Terrain</div>
                  <div class="text-[10px] text-slate-500">Topography & Relief</div>
                </button>
                <button type="button" class="px-2.5 py-1.5 rounded-lg border text-left transition ${state.mapLayer === 'google_traffic' ? 'bg-slate-800 text-white border-blue-500' : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'}" onclick="window.switchMapLayer('google_traffic')">
                  <div class="font-medium text-slate-200">Traffic</div>
                  <div class="text-[10px] text-slate-500">Live Congestion</div>
                </button>
                <button type="button" class="px-2.5 py-1.5 rounded-lg border text-left transition ${state.mapLayer === 'dark' ? 'bg-slate-800 text-white border-blue-500' : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'}" onclick="window.switchMapLayer('dark')">
                  <div class="font-medium text-slate-200">Dark Canvas</div>
                  <div class="text-[10px] text-slate-500">Minimalist Mode</div>
                </button>
              </div>
            </div>

            <!-- Default Map Zoom -->
            <div>
              <label class="block text-xs text-slate-400 mb-1 font-medium">Default Map Zoom</label>
              <select id="map-zoom-select" class="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-slate-200 text-xs focus:outline-none">
                <option value="12" ${state.mapZoomLevel === 12 ? 'selected' : ''}>Neighborhood View (12x - High Local Detail)</option>
                <option value="11" ${state.mapZoomLevel === 11 ? 'selected' : ''}>Metropolitan View (11x - Recommended)</option>
                <option value="9" ${state.mapZoomLevel === 9 ? 'selected' : ''}>Regional Corridor View (9x - NCR / Basin)</option>
                <option value="5" ${state.mapZoomLevel === 5 ? 'selected' : ''}>All-India Macro View (5x - National Network)</option>
              </select>
            </div>

            <div class="flex items-center gap-2 pt-1">
              <button type="button" id="btn-test-gmaps-key" class="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium px-3 py-2 rounded-lg transition">
                Validate Key
              </button>
              <button type="submit" class="bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition">
                Save Map Settings
              </button>
            </div>
          </form>

          <div id="gmaps-test-result" class="hidden mt-3 p-3 rounded-lg text-xs leading-relaxed border"></div>
        </div>
      </div>

      <!-- Card 2: Google Gemini 2.5 Flash GenAI Configuration -->
      <div class="glass-panel p-5 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-purple-500"></span>
              <span>Google Gemini AI</span>
            </h2>
            <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full ${hasGeminiKey ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}">
              ${hasGeminiKey ? 'Live 2.5 Flash' : 'CPCB Expert Baseline'}
            </span>
          </div>

          <p class="text-xs text-slate-400 mb-4 leading-relaxed">
            Powers the Clean-Air Assistant, custom household exposure shielding, and route suggestions. Falls back to verified CPCB scientific knowledge rules when offline.
          </p>

          <form id="key-form" class="space-y-4">
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-xs text-slate-400 font-medium">Gemini API Key</label>
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" class="text-[11px] text-cyan-400 hover:underline">
                  Get Free Key from Google AI Studio ↗
                </a>
              </div>
              <input 
                type="password" 
                id="gemini-key-input" 
                class="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2.5 text-slate-200 text-xs font-mono focus:outline-none focus:border-slate-500"
                placeholder="${hasGeminiKey ? (s.masked_key ? `Configured (${s.masked_key})` : 'Configured in browser') : 'AIzaSy... key for live Gemini 2.5 Flash'}"
              />
            </div>

            <!-- AI Persona Selection -->
            <div>
              <label class="block text-xs text-slate-400 mb-1.5 font-medium">Assistant Persona</label>
              <div class="space-y-1.5 text-xs">
                <label class="flex items-start gap-2.5 p-2 rounded-lg border ${state.aiPersona === 'scientist' ? 'bg-slate-800/80 border-slate-600 text-white' : 'bg-slate-900/40 border-slate-800 text-slate-400'} cursor-pointer">
                  <input type="radio" name="ai-persona" value="scientist" ${state.aiPersona === 'scientist' ? 'checked' : ''} class="mt-0.5" onchange="window.switchAiPersona('scientist')">
                  <div>
                    <div class="font-medium text-slate-200">Public Health & Atmospheric Scientist</div>
                    <div class="text-[11px] text-slate-500">Inversion physics, boundary layer dynamics, WHO & CPCB benchmark analysis.</div>
                  </div>
                </label>
                <label class="flex items-start gap-2.5 p-2 rounded-lg border ${state.aiPersona === 'commuter' ? 'bg-slate-800/80 border-slate-600 text-white' : 'bg-slate-900/40 border-slate-800 text-slate-400'} cursor-pointer">
                  <input type="radio" name="ai-persona" value="commuter" ${state.aiPersona === 'commuter' ? 'checked' : ''} class="mt-0.5" onchange="window.switchAiPersona('commuter')">
                  <div>
                    <div class="font-medium text-slate-200">Urban Commuter & Athlete Companion</div>
                    <div class="text-[11px] text-slate-500">Outdoor jogging safety, cycling routes, car HVAC cabin air recirculation tips.</div>
                  </div>
                </label>
                <label class="flex items-start gap-2.5 p-2 rounded-lg border ${state.aiPersona === 'pediatric' ? 'bg-slate-800/80 border-slate-600 text-white' : 'bg-slate-900/40 border-slate-800 text-slate-400'} cursor-pointer">
                  <input type="radio" name="ai-persona" value="pediatric" ${state.aiPersona === 'pediatric' ? 'checked' : ''} class="mt-0.5" onchange="window.switchAiPersona('pediatric')">
                  <div>
                    <div class="font-medium text-slate-200">Pediatric & Senior Shielding Guardian</div>
                    <div class="text-[11px] text-slate-500">Asthma protocols, infant lung vulnerability, strict HEPA filtration guidelines.</div>
                  </div>
                </label>
              </div>
            </div>

            <div class="flex items-center gap-2 pt-1">
              <button type="button" id="btn-test-key" class="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium px-3 py-2 rounded-lg transition">
                Test Connection
              </button>
              <button type="submit" class="bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition">
                Save Gemini Key
              </button>
            </div>
          </form>

          <div id="key-test-result" class="hidden mt-3 p-3 rounded-lg text-xs leading-relaxed border"></div>
        </div>
      </div>

      <!-- Card 3: Geolocation & Positioning -->
      <div class="glass-panel p-5 space-y-4">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          ${icons.crosshair}
          <span>Geolocation & Tracking</span>
        </h2>

        <!-- Auto-Locate on Startup -->
        <div class="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-900/40">
          <div>
            <div class="text-xs font-medium text-slate-200">Auto-Detect GPS on Launch</div>
            <div class="text-[11px] text-slate-500 mt-0.5">Automatically query high-accuracy GPS coordinates when page loads.</div>
          </div>
          <label class="switch shrink-0 ml-3">
            <input type="checkbox" id="toggle-auto-locate" ${state.autoLocate ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </div>

        <!-- Default Metro Fallback -->
        <div>
          <label class="block text-xs text-slate-400 mb-1 font-medium">Default Monitoring Region</label>
          <select id="select-default-city" class="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-slate-200 text-xs focus:outline-none">
            <option value="Delhi NCR" ${state.currentCity.includes('Delhi') ? 'selected' : ''}>Delhi NCR (Anand Vihar Baseline)</option>
            <option value="Mumbai" ${state.currentCity.includes('Mumbai') ? 'selected' : ''}>Mumbai (Bandra / Colaba)</option>
            <option value="Bengaluru" ${state.currentCity.includes('Bengaluru') ? 'selected' : ''}>Bengaluru (BTM Layout / City)</option>
            <option value="Kolkata" ${state.currentCity.includes('Kolkata') ? 'selected' : ''}>Kolkata (Victoria Memorial)</option>
            <option value="Hyderabad" ${state.currentCity.includes('Hyderabad') ? 'selected' : ''}>Hyderabad (Sanathnagar)</option>
            <option value="Chennai" ${state.currentCity.includes('Chennai') ? 'selected' : ''}>Chennai (Alandur)</option>
            <option value="Pune" ${state.currentCity.includes('Pune') ? 'selected' : ''}>Pune (Shivajinagar)</option>
            <option value="Ahmedabad" ${state.currentCity.includes('Ahmedabad') ? 'selected' : ''}>Ahmedabad (Maninagar)</option>
            <option value="Lucknow" ${state.currentCity.includes('Lucknow') ? 'selected' : ''}>Lucknow (Lalbagh)</option>
          </select>
        </div>

        <!-- Station Auto-Refresh Interval -->
        <div>
          <label class="block text-xs text-slate-400 mb-1 font-medium">Sensor Data Refresh Cadence</label>
          <select id="select-refresh-interval" class="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-slate-200 text-xs focus:outline-none">
            <option value="1" ${state.refreshInterval === 1 ? 'selected' : ''}>Every 1 Minute (High Precision Polling)</option>
            <option value="5" ${state.refreshInterval === 5 ? 'selected' : ''}>Every 5 Minutes (Recommended Balance)</option>
            <option value="15" ${state.refreshInterval === 15 ? 'selected' : ''}>Every 15 Minutes (Network Efficient)</option>
            <option value="0" ${state.refreshInterval === 0 ? 'selected' : ''}>Manual Refresh Only</option>
          </select>
        </div>
      </div>

      <!-- Card 4: Appearance & Display Preferences -->
      <div class="glass-panel p-5 space-y-4">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          ${icons.sun}
          <span>Display & Accessibility</span>
        </h2>

        <!-- Appearance Theme -->
        <div>
          <label class="block text-xs text-slate-400 mb-2 font-medium">Theme Mode</label>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <button class="px-3.5 py-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-2 transition ${state.theme === 'dark' ? 'bg-slate-800 text-white border-slate-500 shadow-sm' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'}" onclick="window.switchTheme('dark')">
              ${icons.moon}
              <span>Dark Theme</span>
            </button>
            <button class="px-3.5 py-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-2 transition ${state.theme === 'light' ? 'bg-slate-800 text-white border-slate-500 shadow-sm' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'}" onclick="window.switchTheme('light')">
              ${icons.sun}
              <span>Light Theme</span>
            </button>
          </div>
        </div>

        <!-- Temperature Units -->
        <div>
          <label class="block text-xs text-slate-400 mb-2 font-medium">Temperature Metric</label>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <button class="px-3 py-2 rounded-lg text-xs font-medium border text-center transition ${state.tempUnit === 'C' ? 'bg-slate-800 text-white border-slate-500' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'}" onclick="window.switchTempUnit('C')">
              Celsius (°C)
            </button>
            <button class="px-3 py-2 rounded-lg text-xs font-medium border text-center transition ${state.tempUnit === 'F' ? 'bg-slate-800 text-white border-slate-500' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'}" onclick="window.switchTempUnit('F')">
              Fahrenheit (°F)
            </button>
          </div>
        </div>

        <!-- High-Contrast Accessibility Mode -->
        <div class="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-900/40">
          <div>
            <div class="text-xs font-medium text-slate-200">High-Contrast Colorblind Mode</div>
            <div class="text-[11px] text-slate-500 mt-0.5">Enhance visual contrast and border indicators on AQI badges.</div>
          </div>
          <label class="switch shrink-0 ml-3">
            <input type="checkbox" id="toggle-high-contrast" ${state.highContrast ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- Card 5 (Full Width): Data Management & Local Persistence -->
      <div class="glass-panel p-5 lg:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            ${icons.download}
            <span>Data Management & Backup</span>
          </h2>
          <p class="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            All user profiles, sustainable action logs, and preferences are stored privately inside your browser. You can export your data as JSON or restore the clean baseline anytime.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5 shrink-0">
          <button type="button" onclick="window.exportActivityLog()" class="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-lg text-xs font-medium transition flex items-center gap-1.5">
            ${icons.download}
            <span>Export Log (.JSON)</span>
          </button>
          <button type="button" onclick="window.resetToBaselineData()" class="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3.5 py-2 rounded-lg text-xs font-medium transition flex items-center gap-1.5">
            ${icons.trash}
            <span>Restore Factory Baseline</span>
          </button>
        </div>
      </div>

    </div>
  `;

  // Attach Google Maps form listeners
  const gmapsForm = document.getElementById('gmaps-key-form');
  if (gmapsForm) {
    gmapsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const val = document.getElementById('gmaps-key-input').value.trim();
      const zoomVal = parseInt(document.getElementById('map-zoom-select').value);
      state.googleMapsKey = val;
      state.mapZoomLevel = zoomVal;
      await api.saveSettings({ google_maps_api_key: val, map_zoom: zoomVal });
      alert("Google Maps configuration saved successfully.");
      renderSettings(container);
    });
  }

  const toggleGmapsBtn = document.getElementById('btn-toggle-gmaps-key');
  if (toggleGmapsBtn) {
    toggleGmapsBtn.addEventListener('click', () => {
      const inp = document.getElementById('gmaps-key-input');
      if (inp.type === 'password') {
        inp.type = 'text';
        toggleGmapsBtn.textContent = 'Hide';
      } else {
        inp.type = 'password';
        toggleGmapsBtn.textContent = 'Show';
      }
    });
  }

  const testGmapsBtn = document.getElementById('btn-test-gmaps-key');
  if (testGmapsBtn) {
    testGmapsBtn.addEventListener('click', async () => {
      const val = document.getElementById('gmaps-key-input').value.trim();
      const resBox = document.getElementById('gmaps-test-result');
      testGmapsBtn.innerHTML = 'Checking...';
      const result = await api.testGoogleMapsKey(val);
      testGmapsBtn.innerHTML = 'Validate Key';
      if (resBox) {
        resBox.classList.remove('hidden');
        if (result.status === 'success') {
          resBox.className = 'mt-3 p-3 rounded-lg text-xs bg-emerald-500/10 border-emerald-500/30 text-emerald-300';
          resBox.innerHTML = `<strong>Verified:</strong> ${result.message}`;
        } else if (result.status === 'info') {
          resBox.className = 'mt-3 p-3 rounded-lg text-xs bg-blue-500/10 border-blue-500/30 text-blue-300';
          resBox.innerHTML = `<strong>Note:</strong> ${result.message}`;
        } else {
          resBox.className = 'mt-3 p-3 rounded-lg text-xs bg-rose-500/10 border-rose-500/30 text-rose-300';
          resBox.innerHTML = `<strong>Warning:</strong> ${result.message}`;
        }
      }
    });
  }

  // Gemini form listeners
  const form = document.getElementById('key-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const val = document.getElementById('gemini-key-input').value.trim();
      await api.saveSettings({ gemini_api_key: val });
      alert("Gemini API Key saved.");
      renderSettings(container);
    });
  }

  const testBtn = document.getElementById('btn-test-key');
  if (testBtn) {
    testBtn.addEventListener('click', async () => {
      const val = document.getElementById('gemini-key-input').value.trim();
      const resBox = document.getElementById('key-test-result');
      if (!val) {
        alert("Please enter a key to test.");
        return;
      }
      testBtn.innerHTML = 'Testing...';
      const result = await api.testGeminiKey(val);
      testBtn.innerHTML = 'Test Connection';
      if (resBox) {
        resBox.classList.remove('hidden');
        if (result.status === 'success') {
          resBox.className = 'mt-3 p-3 rounded-lg text-xs bg-emerald-500/10 border-emerald-500/30 text-emerald-300';
          resBox.innerHTML = `Verified: ${result.message} <br><em>Model: ${result.model}</em>`;
        } else {
          resBox.className = 'mt-3 p-3 rounded-lg text-xs bg-rose-500/10 border-rose-500/30 text-rose-300';
          resBox.innerHTML = `Error: ${result.message}`;
        }
      }
    });
  }

  // Toggles and Selectors
  const autoLocateToggle = document.getElementById('toggle-auto-locate');
  if (autoLocateToggle) {
    autoLocateToggle.addEventListener('change', async (e) => {
      state.autoLocate = e.target.checked;
      await api.saveSettings({ auto_locate: state.autoLocate });
    });
  }

  const highContrastToggle = document.getElementById('toggle-high-contrast');
  if (highContrastToggle) {
    highContrastToggle.addEventListener('change', async (e) => {
      state.highContrast = e.target.checked;
      await api.saveSettings({ high_contrast: state.highContrast });
      renderCurrentView();
    });
  }

  const citySelect = document.getElementById('select-default-city');
  if (citySelect) {
    citySelect.addEventListener('change', async (e) => {
      state.currentCity = e.target.value;
      await loadInitialData();
      renderSettings(container);
    });
  }

  const refreshSelect = document.getElementById('select-refresh-interval');
  if (refreshSelect) {
    refreshSelect.addEventListener('change', async (e) => {
      state.refreshInterval = parseInt(e.target.value);
      await api.saveSettings({ refresh_interval: state.refreshInterval });
    });
  }
}

window.switchTheme = function (theme) {
  applyTheme(theme);
  renderCurrentView();
};

window.switchTempUnit = function (unit) {
  state.tempUnit = unit;
  localStorage.setItem('vayusaathi_temp_unit', unit);
  localStorage.setItem('hawawise_temp_unit', unit);
  renderCurrentView();
};

window.switchMapLayer = function (layer) {
  state.mapLayer = layer;
  localStorage.setItem('vayusaathi_map_layer', layer);
  localStorage.setItem('hawawise_map_layer', layer);
  if (window.leafletMapInstance) {
    updateMapTileLayer(window.leafletMapInstance, layer);
  }
  const sel = document.getElementById('map-layer-selector');
  if (sel) sel.value = layer;
  renderCurrentView();
};

window.switchAiPersona = function (persona) {
  state.aiPersona = persona;
  localStorage.setItem('vayusaathi_ai_persona', persona);
  renderCurrentView();
};

window.toggleMapFullscreen = function () {
  const mapWrapper = document.getElementById('map-wrapper');
  if (!mapWrapper) return;
  state.isMapFullscreen = !state.isMapFullscreen;
  if (state.isMapFullscreen) {
    mapWrapper.classList.add('map-fullscreen');
    document.body.style.overflow = 'hidden';
  } else {
    mapWrapper.classList.remove('map-fullscreen');
    document.body.style.overflow = '';
  }
  const btn = document.getElementById('btn-map-fullscreen');
  if (btn) {
    btn.innerHTML = state.isMapFullscreen ? `${icons.minimize}` : `${icons.maximize}`;
  }
  if (window.leafletMapInstance) {
    setTimeout(() => {
      window.leafletMapInstance.invalidateSize();
    }, 150);
  }
};

window.exportActivityLog = function () {
  const actions = localStorage.getItem('vayusaathi_logged_actions') || localStorage.getItem('hawawise_logged_actions') || '[]';
  const profile = localStorage.getItem('vayusaathi_profile') || localStorage.getItem('hawawise_profile') || '{}';
  const data = {
    app: "VayuSaathi",
    version: "2.0.0",
    exportedAt: new Date().toISOString(),
    profile: JSON.parse(profile),
    loggedActions: JSON.parse(actions),
    activeSettings: {
      mapLayer: state.mapLayer,
      tempUnit: state.tempUnit,
      aiPersona: state.aiPersona
    }
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `VayuSaathi_Activity_Log_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

window.resetToBaselineData = function () {
  if (confirm("Restore factory baseline datasets? Your stored activity logs and custom API preferences will reset to default.")) {
    const keysToRemove = [
      'vayusaathi_theme', 'vayusaathi_temp_unit', 'vayusaathi_map_layer',
      'vayusaathi_google_maps_key', 'vayusaathi_gemini_key', 'vayusaathi_auto_locate',
      'vayusaathi_map_zoom', 'vayusaathi_high_contrast', 'vayusaathi_refresh_interval',
      'vayusaathi_ai_persona', 'vayusaathi_logged_actions', 'vayusaathi_community_reports',
      'vayusaathi_profile', 'vayusaathi_chat_history', 'vayusaathi_read_alerts',
      'hawawise_theme', 'hawawise_temp_unit', 'hawawise_map_layer'
    ];
    keysToRemove.forEach(k => localStorage.removeItem(k));
    alert("Baseline settings successfully restored.");
    window.location.reload();
  }
};

// Escape key listener to exit map fullscreen
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && state.isMapFullscreen) {
    window.toggleMapFullscreen();
  }
});

/* =========================================================================
   12. SCENARIO SIMULATIONS VIEW
   ========================================================================= */
function renderJudgesDemo(container) {
  container.innerHTML = `
    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl md:text-2xl font-semibold tracking-tight text-white">
          Scenario Simulations
        </h1>
        <p class="text-xs text-slate-400 mt-0.5">
          Pre-calibrated urban pollution scenarios, sensor diagnostics, and CPCB calibration benchmarks.
        </p>
      </div>

      <button onclick="window.hawawiseNavigate('dashboard')" class="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 px-3.5 py-2 rounded-lg transition">
        ← Return to Overview
      </button>
    </div>

    <!-- 1-Click Scenario Loaders -->
    <div class="glass-panel p-5 mb-6">
      <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
        Urban Case Studies
      </h2>
      <p class="text-xs text-slate-400 mb-4">
        Calibrate environmental metrics, household profiles, and routines to specific urban archetypes:
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Delhi -->
        <div class="p-4 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition cursor-pointer flex flex-col justify-between" onclick="window.loadJudgeScenario('delhi_winter')">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-white">Scenario A: Delhi NCR</span>
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded border border-rose-500/30 text-rose-400">AQI 386</span>
            </div>
            <div class="text-xs font-medium text-rose-300 mt-1">Severe Winter Inversion</div>
            <p class="text-xs text-slate-400 mt-2 leading-relaxed">
              Household of 4 with 1 asthmatic child and 1 senior. Open two-wheeler commuter facing acute early morning smog peaks.
            </p>
          </div>
          <button class="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium py-1.5 rounded-lg transition">
            Load Scenario →
          </button>
        </div>

        <!-- Bengaluru -->
        <div class="p-4 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition cursor-pointer flex flex-col justify-between" onclick="window.loadJudgeScenario('bengaluru_clean')">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-white">Scenario B: Bengaluru</span>
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-400">AQI 88</span>
            </div>
            <div class="text-xs font-medium text-emerald-300 mt-1">Plateau Transit Study</div>
            <p class="text-xs text-slate-400 mt-2 leading-relaxed">
              Satisfactory ambient air with localized traffic congestion. Household adopting metro rail transit and emission tracking.
            </p>
          </div>
          <button class="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium py-1.5 rounded-lg transition">
            Load Scenario →
          </button>
        </div>

        <!-- Lahore -->
        <div class="p-4 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition cursor-pointer flex flex-col justify-between" onclick="window.loadJudgeScenario('lahore_smog')">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-white">Scenario C: Lahore Basin</span>
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded border border-purple-500/30 text-purple-400">AQI 468</span>
            </div>
            <div class="text-xs font-medium text-purple-300 mt-1">Hazardous Smog Emergency</div>
            <p class="text-xs text-slate-400 mt-2 leading-relaxed">
              Transboundary agricultural smoke and thermal stagnation. Safe-haven bedroom protocol and school outdoor closures activated.
            </p>
          </div>
          <button class="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium py-1.5 rounded-lg transition">
            Load Scenario →
          </button>
        </div>
      </div>
    </div>

    <!-- Diagnostics Inspector -->
    <div class="glass-panel p-5 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Sensor & Location Diagnostics
        </h2>
        <button onclick="window.detectLocationFromDemo()" class="btn-gps-trigger bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs px-2.5 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5">
          ${icons.crosshair}
          <span>Run GPS Test</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div class="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800">
          <div class="text-slate-500">Current Position</div>
          <div class="text-xs font-medium text-white mt-1">
            ${state.userCoords ? `${state.userCoords.lat.toFixed(4)}°N, ${state.userCoords.lon.toFixed(4)}°E` : `${state.airQuality?.coordinates?.lat || 28.614}°N, ${state.airQuality?.coordinates?.lon || 77.209}°E`}
          </div>
          <div class="text-[10px] text-slate-500 mt-1">${state.userCoords ? `Live satellite lock (±${state.userCoords.accuracy}m)` : 'Standard station coordinates'}</div>
        </div>

        <div class="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800">
          <div class="text-slate-500">CPCB Formula Engine</div>
          <div class="text-xs font-medium text-emerald-400 mt-1">Linear Breakpoint Interpolation</div>
          <div class="text-[10px] text-slate-500 mt-1 font-mono">I = ((I_hi - I_lo)/(C_hi - C_lo))*(C - C_lo) + I_lo</div>
        </div>

        <div class="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800">
          <div class="text-slate-500">Dominant Sub-Index</div>
          <div class="text-xs font-medium text-rose-400 mt-1">
            ${state.airQuality?.dominant_pollutant || 'PM2.5'} (${state.airQuality?.pollutants?.pm2_5?.sub_index || 386})
          </div>
          <div class="text-[10px] text-slate-500 mt-1">Maximum across 7 measured parameters</div>
        </div>

        <div class="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800">
          <div class="text-slate-500">Inversion State</div>
          <div class="text-xs font-medium ${state.airQuality?.weather?.temperature_inversion_detected ? 'text-rose-400' : 'text-emerald-400'} mt-1">
            ${state.airQuality?.weather?.temperature_inversion_detected ? 'Boundary Trapping Active' : 'Normal Dispersion'}
          </div>
          <div class="text-[10px] text-slate-500 mt-1">Calibrated on wind speed & ambient temp</div>
        </div>
      </div>
    </div>

    <!-- Official CPCB NAQI Breakpoint Calibration Matrix -->
    <div class="glass-panel p-5 mb-6 overflow-x-auto">
      <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
        Indian National Air Quality Index (NAQI) Breakpoint Standards
      </h2>
      <table class="w-full text-left text-xs text-slate-300 min-w-[700px]">
        <thead>
          <tr class="border-b border-slate-800 text-slate-500 uppercase text-[10px]">
            <th class="pb-2.5 font-medium">Category</th>
            <th class="pb-2.5 font-medium">Index Range</th>
            <th class="pb-2.5 font-medium">PM2.5 (µg/m³)</th>
            <th class="pb-2.5 font-medium">PM10 (µg/m³)</th>
            <th class="pb-2.5 font-medium">NO2 (µg/m³)</th>
            <th class="pb-2.5 font-medium">SO2 (µg/m³)</th>
            <th class="pb-2.5 font-medium">CO (mg/m³)</th>
            <th class="pb-2.5 font-medium">O3 (µg/m³)</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/80">
          <tr><td class="py-2 text-emerald-400 font-medium">Good</td><td>0 – 50</td><td>0 – 30</td><td>0 – 50</td><td>0 – 40</td><td>0 – 40</td><td>0 – 1.0</td><td>0 – 50</td></tr>
          <tr><td class="py-2 text-teal-400 font-medium">Satisfactory</td><td>51 – 100</td><td>31 – 60</td><td>51 – 100</td><td>41 – 80</td><td>41 – 80</td><td>1.1 – 2.0</td><td>51 – 100</td></tr>
          <tr><td class="py-2 text-amber-400 font-medium">Moderate</td><td>101 – 200</td><td>61 – 90</td><td>101 – 250</td><td>81 – 180</td><td>81 – 380</td><td>2.1 – 10</td><td>101 – 168</td></tr>
          <tr><td class="py-2 text-orange-400 font-medium">Poor</td><td>201 – 300</td><td>91 – 120</td><td>251 – 350</td><td>181 – 280</td><td>381 – 800</td><td>10.1 – 17</td><td>169 – 208</td></tr>
          <tr><td class="py-2 text-red-400 font-medium">Very Poor</td><td>301 – 400</td><td>121 – 250</td><td>351 – 430</td><td>281 – 400</td><td>801 – 1600</td><td>17.1 – 34</td><td>209 – 748</td></tr>
          <tr><td class="py-2 text-rose-400 font-medium">Severe</td><td>401 – 500+</td><td>250+</td><td>430+</td><td>400+</td><td>1600+</td><td>34+</td><td>748+</td></tr>
        </tbody>
      </table>
    </div>

    <!-- Verification Checklist -->
    <div class="glass-panel p-5">
      <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
        System Capabilities
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-400">
        <div class="flex items-center gap-2"><span class="text-emerald-500">${icons.check}</span> Conversational air assistant via Google Gemini SDK</div>
        <div class="flex items-center gap-2"><span class="text-emerald-500">${icons.check}</span> Live Open-Meteo & Indian CPCB NAQI calculation</div>
        <div class="flex items-center gap-2"><span class="text-emerald-500">${icons.check}</span> Real-time browser GPS location detection & tracking</div>
        <div class="flex items-center gap-2"><span class="text-emerald-500">${icons.check}</span> Spatial monitoring network with 30+ regional stations</div>
        <div class="flex items-center gap-2"><span class="text-emerald-500">${icons.check}</span> Multi-layer Leaflet map (Dark, Light, Street)</div>
        <div class="flex items-center gap-2"><span class="text-emerald-500">${icons.check}</span> Automatic nearest-station Haversine proximity engine</div>
        <div class="flex items-center gap-2"><span class="text-emerald-500">${icons.check}</span> Click-anywhere map coordinate inspection</div>
        <div class="flex items-center gap-2"><span class="text-emerald-500">${icons.check}</span> Household protection protocols for vulnerable groups</div>
        <div class="flex items-center gap-2"><span class="text-emerald-500">${icons.check}</span> Diurnal smog schedule generator</div>
        <div class="flex items-center gap-2"><span class="text-emerald-500">${icons.check}</span> Environmental impact and carbon tracker</div>
      </div>
    </div>
  `;
}

window.detectLocationFromDemo = function () {
  detectUserLocation(false);
};

window.loadJudgeScenario = async function (scenarioKey) {
  state.userCoords = null;
  const sc = await api.getDemoScenario(scenarioKey);
  state.currentCity = sc.city;
  state.airQuality = await api.getAirQuality(sc.city);
  state.profile = sc.household;
  await api.saveProfile(sc.household);
  updateTopHeaderMetrics();
  alert(`Scenario '${sc.title}' loaded.`);
  navigateTo('dashboard');
};

// Global Navigation Helper
window.vayusaathiNavigate = window.hawawiseNavigate = function (view) {
  navigateTo(view);
};

// Setup Global Modals
function setupGlobalModals() {
  const actionModal = document.getElementById('action-modal');
  const actionForm = document.getElementById('action-form');
  const closeAction = document.getElementById('btn-close-action-modal');

  if (closeAction && actionModal) {
    closeAction.addEventListener('click', () => actionModal.classList.add('hidden'));
  }

  if (actionForm && actionModal) {
    actionForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const actType = document.getElementById('m-act-type').value;
      const actTitle = document.getElementById('m-act-title').value;
      const actCo2 = parseFloat(document.getElementById('m-act-co2').value) || 1.2;
      const actPm = parseFloat(document.getElementById('m-act-pm').value) || 0.4;

      await api.logImpactAction({
        action_type: actType,
        category: 'commute',
        title: actTitle,
        co2_saved_kg: actCo2,
        pm_saved_g: actPm,
        points: 25
      });

      actionModal.classList.add('hidden');
      alert("Action logged.");
      renderCurrentView();
    });
  }

  const reportModal = document.getElementById('report-modal');
  const reportForm = document.getElementById('report-form');
  const closeReport = document.getElementById('btn-close-report-modal');

  if (closeReport && reportModal) {
    closeReport.addEventListener('click', () => reportModal.classList.add('hidden'));
  }

  if (reportForm && reportModal) {
    reportForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('rep-title').value;
      const category = document.getElementById('rep-cat').value;
      const loc = document.getElementById('rep-loc').value;
      const sev = document.getElementById('rep-sev').value;
      const desc = document.getElementById('rep-desc').value;

      await api.submitCommunityReport({
        title,
        category,
        location_name: loc,
        severity: sev,
        description: desc
      });

      reportModal.classList.add('hidden');
      alert("Report submitted.");
      renderCurrentView();
    });
  }
}
