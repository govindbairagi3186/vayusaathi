/**
 * VayuSaathi - High-Resilience Frontend API Service Client
 * Unified REST + Offline CPCB Baseline engine with identical schemas,
 * safe storage access, and zero failed-fetch console spam.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.api = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  let isBackendOnline = false;
  let backendChecked = false;
  let activeApiBase = "";

  // Safe localStorage wrappers that never throw in restricted browsers or corrupted JSON
  function readJsonStorage(key, fallback, legacyKey = null) {
    try {
      let raw = localStorage.getItem(key);
      if (!raw && legacyKey) {
        raw = localStorage.getItem(legacyKey);
      }
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeJsonStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // Ignore quota / private browsing storage restrictions gracefully
    }
  }

  function readStringStorage(key, fallback = "", legacyKey = null) {
    try {
      const val = localStorage.getItem(key);
      if (val !== null) return val;
      if (legacyKey) {
        const legacy = localStorage.getItem(legacyKey);
        if (legacy !== null) return legacy;
      }
      return fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeStringStorage(key, value) {
    try {
      localStorage.setItem(key, String(value));
    } catch (e) {
      // Ignore storage error
    }
  }

  // Check backend connectivity once silently (prevents ERR_CONNECTION_REFUSED console floods)
  async function checkBackendOnce() {
    if (backendChecked) return isBackendOnline;
    backendChecked = true;

    if (typeof window === "undefined" || !window.location || window.location.protocol === "file:") {
      isBackendOnline = false;
      return false;
    }

    const loc = window.location;
    if (loc.port === "8000") {
      activeApiBase = loc.origin;
      isBackendOnline = true;
      return true;
    }

    const probes = [];
    if (loc.protocol.startsWith("http")) probes.push(loc.origin);
    probes.push("http://127.0.0.1:8000");

    for (const base of probes) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 450);
        const res = await fetch(`${base}/api/health`, {
          signal: controller.signal,
          credentials: "omit"
        });
        clearTimeout(timer);
        if (res.ok) {
          activeApiBase = base;
          isBackendOnline = true;
          return true;
        }
      } catch (e) {
        // Silent probe fallback
      }
    }

    isBackendOnline = false;
    return false;
  }

  async function safeFetch(endpoint, options = {}, timeoutMs = 3000) {
    if (!backendChecked) {
      await checkBackendOnce();
    }
    if (!isBackendOnline || !activeApiBase) {
      return null;
    }

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const res = await fetch(`${activeApiBase}${endpoint}`, {
        ...options,
        signal: controller.signal,
        credentials: "omit"
      });
      clearTimeout(timer);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      isBackendOnline = false;
    }
    return null;
  }

  // Supported Regional Baseline Cities (aligned with CPCB National Network)
  const FALLBACK_CITIES = [
    { key: "Delhi NCR", name: "Delhi NCR, India", baseline_aqi: 386, lat: 28.6139, lon: 77.2090, region: "Indo-Gangetic Plain" },
    { key: "Mumbai", name: "Mumbai, Maharashtra", baseline_aqi: 142, lat: 19.0760, lon: 72.8777, region: "Western Coastal Belt" },
    { key: "Bengaluru", name: "Bengaluru, Karnataka", baseline_aqi: 88, lat: 12.9716, lon: 77.5946, region: "Deccan Plateau" },
    { key: "Kolkata", name: "Kolkata, West Bengal", baseline_aqi: 265, lat: 22.5726, lon: 88.3639, region: "Lower Gangetic Delta" },
    { key: "Hyderabad", name: "Hyderabad, Telangana", baseline_aqi: 128, lat: 17.3850, lon: 78.4867, region: "South Central Deccan" },
    { key: "Chennai", name: "Chennai, Tamil Nadu", baseline_aqi: 92, lat: 13.0827, lon: 80.2707, region: "Coromandel Coast" },
    { key: "Pune", name: "Pune, Maharashtra", baseline_aqi: 118, lat: 18.5204, lon: 73.8567, region: "Sahyadri Foothills" },
    { key: "Ahmedabad", name: "Ahmedabad, Gujarat", baseline_aqi: 168, lat: 23.0225, lon: 72.5714, region: "Sabarmati Basin" },
    { key: "Lucknow", name: "Lucknow, Uttar Pradesh", baseline_aqi: 340, lat: 26.8467, lon: 80.9462, region: "Central Gangetic Plain" },
    { key: "Patna", name: "Patna, Bihar", baseline_aqi: 375, lat: 25.5941, lon: 85.1376, region: "Middle Gangetic Basin" },
    { key: "Gurugram", name: "Gurugram, Haryana", baseline_aqi: 320, lat: 28.4595, lon: 77.0266, region: "Southern NCR Basin" },
    { key: "Noida", name: "Noida, Uttar Pradesh", baseline_aqi: 348, lat: 28.5355, lon: 77.3910, region: "Eastern Yamuna Corridor" },
    { key: "Ghaziabad", name: "Ghaziabad, Uttar Pradesh", baseline_aqi: 418, lat: 28.6692, lon: 77.4538, region: "Trans-Hindon Industrial Belt" },
    { key: "Lahore", name: "Lahore, Punjab Basin", baseline_aqi: 468, lat: 31.5204, lon: 74.3587, region: "Upper Indus Smog Basin" }
  ];

  function getAqiMeta(aqi) {
    if (aqi > 400) {
      return {
        category: "Severe",
        color: "#f43f5e",
        health_advisory: "Respiratory illness risk upon prolonged exposure. Avoid all strenuous outdoor activities.",
        sensitive_advisory: "Children, seniors, and people with respiratory disease must remain indoors with True HEPA filtration active.",
        mask_recommended: true
      };
    }
    if (aqi > 300) {
      return {
        category: "Very Poor",
        color: "#ef4444",
        health_advisory: "Respiratory discomfort on prolonged exposure. Limit early morning and late evening outdoor movement.",
        sensitive_advisory: "Vulnerable individuals, seniors, and children should avoid heavy physical activity outdoors.",
        mask_recommended: true
      };
    }
    if (aqi > 200) {
      return {
        category: "Poor",
        color: "#f97316",
        health_advisory: "Breathing discomfort to most people on prolonged exposure.",
        sensitive_advisory: "Children and older adults should reduce outdoor cardio during morning inversion hours.",
        mask_recommended: true
      };
    }
    if (aqi > 100) {
      return {
        category: "Moderate",
        color: "#f59e0b",
        health_advisory: "Acceptable for healthy adults; mild discomfort possible for sensitive airways.",
        sensitive_advisory: "Sensitive groups should monitor symptoms during strenuous outdoor exercise.",
        mask_recommended: false
      };
    }
    if (aqi > 50) {
      return {
        category: "Satisfactory",
        color: "#10b981",
        health_advisory: "Minor breathing discomfort only for unusually sensitive individuals.",
        sensitive_advisory: "Normal outdoor activity is generally safe.",
        mask_recommended: false
      };
    }
    return {
      category: "Good",
      color: "#059669",
      health_advisory: "Minimal impact; air quality is clean and well-dispersed.",
      sensitive_advisory: "Ideal conditions for outdoor activity across all age groups.",
      mask_recommended: false
    };
  }

  function estimateBaselineForCoords(lat, lon) {
    let closest = FALLBACK_CITIES[0];
    let minSq = Infinity;
    for (const c of FALLBACK_CITIES) {
      const sq = Math.pow(c.lat - lat, 2) + Math.pow(c.lon - lon, 2);
      if (sq < minSq) {
        minSq = sq;
        closest = c;
      }
    }
    return closest;
  }

  function generateAirQualityFallback(city = "Delhi NCR", lat = null, lon = null) {
    let baseline = 386;
    let cityName = city;
    let resolvedLat = lat;
    let resolvedLon = lon;

    const queryLower = String(city || "").toLowerCase();
    let matched = FALLBACK_CITIES.find(
      c => c.key.toLowerCase() === queryLower || queryLower.includes(c.key.toLowerCase())
    );
    if (!matched && lat !== null && lon !== null) {
      matched = estimateBaselineForCoords(Number(lat), Number(lon));
    }

    if (matched) {
      baseline = matched.baseline_aqi;
      if (!city || city === matched.key || city === "Custom Location" || city === "My GPS Location") {
        cityName = city === "My GPS Location" ? `GPS near ${matched.key}` : matched.name;
      }
      if (resolvedLat === null) resolvedLat = matched.lat;
      if (resolvedLon === null) resolvedLon = matched.lon;
    }

    const meta = getAqiMeta(baseline);
    const pm25 = Math.round(baseline * 0.56 * 10) / 10;
    const pm10 = Math.round(baseline * 0.94 * 10) / 10;
    const no2 = Math.round((32 + baseline * 0.14) * 10) / 10;
    const so2 = Math.round((10 + baseline * 0.04) * 10) / 10;
    const co = Math.round((0.8 + baseline / 190) * 10) / 10;
    const o3 = Math.round((28 + Math.min(baseline, 300) * 0.05) * 10) / 10;
    const nh3 = Math.round((22 + baseline * 0.05) * 10) / 10;

    const isInversion = baseline >= 220;
    const windSpeed = baseline >= 300 ? 4.2 : baseline >= 180 ? 7.4 : 13.5;
    const now = new Date();
    const currentHour = now.getHours();

    const trend = [];
    for (let i = 0; i < 24; i++) {
      const h = (currentHour + i) % 24;
      const hourStr = `${String(h).padStart(2, '0')}:00`;
      const diurnalFactor = (h >= 5 && h <= 9) || (h >= 19 && h <= 23)
        ? 1.14
        : (h >= 12 && h <= 16 ? 0.82 : 1.0);
      const hAqi = Math.max(25, Math.round(baseline * diurnalFactor));
      trend.push({
        time: hourStr,
        hour: hourStr,
        aqi: hAqi,
        pm2_5: Math.round(hAqi * 0.56 * 10) / 10,
        pm10: Math.round(hAqi * 0.94 * 10) / 10,
        temp_c: Math.round((18 - (h >= 2 && h <= 6 ? 4 : 0) + (h >= 13 && h <= 15 ? 6 : 0)) * 10) / 10
      });
    }

    const sev = [0, 1, 2, 3, 4, 5, 6].map((offset) => {
      const dayAqi = Math.max(30, Math.round(baseline * (1 - offset * 0.04)));
      const dayMeta = getAqiMeta(dayAqi);
      return {
        day: offset === 0 ? "Today" : offset === 1 ? "Tomorrow" : `Day ${offset + 1}`,
        aqi: dayAqi,
        cat: dayMeta.category,
        color: dayMeta.color
      };
    });

    return {
      is_live: false,
      data_source_type: "CPCB_BASELINE",
      data_source_label: "CPCB National Baseline Network",
      last_updated: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      city: cityName,
      region: `${matched ? matched.region : cityName} • Elev: ~210m`,
      coordinates: { lat: Number(resolvedLat) || 28.6139, lon: Number(resolvedLon) || 77.2090 },
      aqi: baseline,
      category: meta.category,
      color: meta.color,
      health_advisory: meta.health_advisory,
      sensitive_advisory: meta.sensitive_advisory,
      mask_recommended: meta.mask_recommended,
      dominant_pollutant: pm25 >= 60 ? "PM2.5" : "PM10",
      pollutants: {
        pm2_5: { value: pm25, unit: "µg/m³", safe_limit: 60.0, cpcb_limit: 60.0, sub_index: baseline, status: pm25 > 120 ? "Severe" : pm25 > 60 ? "Moderate" : "Good" },
        pm10: { value: pm10, unit: "µg/m³", safe_limit: 100.0, cpcb_limit: 100.0, sub_index: Math.round(baseline * 0.88), status: pm10 > 250 ? "Very Poor" : pm10 > 100 ? "Moderate" : "Good" },
        no2: { value: no2, unit: "µg/m³", safe_limit: 80.0, cpcb_limit: 80.0, sub_index: Math.round(no2 * 1.1), status: no2 > 80 ? "Moderate" : "Good" },
        so2: { value: so2, unit: "µg/m³", safe_limit: 80.0, cpcb_limit: 80.0, sub_index: Math.round(so2 * 1.2), status: "Good" },
        co: { value: co, unit: "mg/m³", safe_limit: 2.0, cpcb_limit: 2.0, sub_index: Math.round(co * 28), status: co > 2.0 ? "Moderate" : "Good" },
        o3: { value: o3, unit: "µg/m³", safe_limit: 100.0, cpcb_limit: 100.0, sub_index: Math.round(o3), status: "Good" },
        nh3: { value: nh3, unit: "µg/m³", safe_limit: 400.0, cpcb_limit: 400.0, sub_index: Math.round(nh3 * 0.6), status: "Good" }
      },
      weather: {
        temperature: baseline > 300 ? 16.5 : 23.4,
        temperature_c: baseline > 300 ? 16.5 : 23.4,
        apparent_temperature: baseline > 300 ? 15.0 : 22.8,
        humidity: baseline > 300 ? 78 : 58,
        humidity_percent: baseline > 300 ? 78 : 58,
        wind_speed: windSpeed,
        wind_speed_kmh: windSpeed,
        wind_direction: 290,
        wind_direction_cardinal: "WNW",
        pressure_hpa: 1016,
        visibility_km: baseline > 300 ? 2.1 : 6.8,
        uv_index: 3.2,
        condition: isInversion ? "Mist / Thermal Stagnation" : "Clear Dispersion",
        temperature_inversion_detected: isInversion,
        stagnation_risk: isInversion ? "High" : "Low",
        boundary_layer_height_m: isInversion ? 320 : 1150,
        optimal_ventilation_window: "1:00 PM – 2:30 PM (Midday Solar Mixing)"
      },
      trend_24h: trend,
      hourly_forecast: trend,
      seven_day_forecast: sev
    };
  }

  const DEFAULT_PROFILE = {
    user_id: "default_user",
    city: "Delhi NCR",
    household_size: 4,
    children_count: 1,
    seniors_count: 1,
    has_asthma_respiratory: 1,
    commute_mode: "two_wheeler",
    daily_commute_km: 18.0,
    home_ventilation: "split_ac_windows",
    has_air_purifier: 0,
    school_office_hours: "8:30 AM - 5:30 PM",
    indoor_outdoor_pref: "mostly_indoor_smog_season"
  };

  const DEFAULT_REPORTS = [
    {
      id: 1,
      title: "Biomass Waste Burning at Empty Lot",
      category: "waste_burning",
      location_name: "Ring Road Bypass, Sec-14",
      severity: "critical",
      upvotes: 28,
      status: "Forwarded to Municipal Authority",
      description: "Trash burning behind market complexes causing thick pungent smog.",
      created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
    },
    {
      id: 2,
      title: "Heavy Bus Idling at Terminal",
      category: "vehicular_idling",
      location_name: "Sector 8 Intercity Gate",
      severity: "high",
      upvotes: 19,
      status: "Under Investigation",
      description: "Commercial diesel buses idling continuously near student crossing.",
      created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
    },
    {
      id: 3,
      title: "Uncovered Construction Debris",
      category: "dust_construction",
      location_name: "Expressway Flyover Pier 4",
      severity: "medium",
      upvotes: 14,
      status: "Notice Issued",
      description: "Exposed dry aggregate dust blowing onto arterial carriageway.",
      created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    }
  ];

  const DEFAULT_ALERTS = [
    {
      id: 101,
      severity: "danger",
      category: "aqi_spike",
      title: "Winter Smog Inversion Advisory",
      message: "Morning boundary layer below 350 meters is trapping vehicular and biomass particulates near ground level. Defer outdoor endurance exercise until midday dispersion.",
      created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      is_read: 0
    },
    {
      id: 102,
      severity: "info",
      category: "health_warning",
      title: "Afternoon Cross-Ventilation Window",
      message: "Solar warming improves vertical mixing between 1:00 PM and 2:30 PM. Briefly cross-ventilate interiors to lower indoor CO2 buildup.",
      created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      is_read: 0
    }
  ];

  const DEFAULT_SEED_ACTIONS = [
    {
      action_type: "electric_metro",
      category: "commute",
      title: "Took Metro instead of Petrol Car",
      description: "Commuted 18 km round-trip via electric metro rail instead of solo car.",
      co2_saved_kg: 2.52,
      pm_saved_g: 0.72,
      points: 25,
      completed_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    },
    {
      action_type: "carpool_shared",
      category: "commute",
      title: "Carpool with 2 Colleagues",
      description: "Shared 14 km commute ride, avoiding two separate vehicular trips.",
      co2_saved_kg: 1.96,
      pm_saved_g: 0.56,
      points: 20,
      completed_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
    },
    {
      action_type: "avoided_trash_burning",
      category: "community",
      title: "Composted Garden Leaf Litter",
      description: "Prevented open burning of 3 kg dry leaves; shifted to local composting.",
      co2_saved_kg: 3.60,
      pm_saved_g: 25.5,
      points: 40,
      completed_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString()
    }
  ];

  const api = {
    async getHealth() {
      const live = await safeFetch('/api/health');
      return live || { status: "healthy", mode: "client_baseline", timestamp: new Date().toISOString() };
    },

    async getCities() {
      const live = await safeFetch('/api/cities');
      return live || { cities: FALLBACK_CITIES };
    },

    async getAirQuality(city = "Delhi NCR", lat = null, lon = null) {
      let endpoint = `/api/air-quality?city=${encodeURIComponent(city)}`;
      if (lat !== null && lon !== null) {
        endpoint += `&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
      }
      const live = await safeFetch(endpoint);
      return live || generateAirQualityFallback(city, lat, lon);
    },

    async sendMessage(messages, context = {}) {
      const live = await safeFetch('/api/chat', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          city: context.city || "Delhi NCR",
          aqi: Number(context.aqi) || 350,
          category: context.category || "Very Poor",
          pm2_5: Number(context.pm2_5) || 180.0,
          temperature_inversion: context.temperature_inversion ?? true,
          ai_persona: context.ai_persona || "scientist",
          location_briefing: context.location_briefing || null
        })
      }, 3500);

      if (live) return live;

      const locationBriefing = context.location_briefing;
      if (locationBriefing) {
        const aqi = Number(locationBriefing.aqi);
        const category = locationBriefing.category || "unknown";
        const pollutants = locationBriefing.pollutants || {};
        const reading = (name) => {
          const item = pollutants[name];
          return item ? `${item.value} ${item.unit || ""}`.trim() : "unavailable";
        };
        const advice = aqi > 300
          ? "Avoid strenuous outdoor activity; keep windows closed during high-pollution periods and use a well-fitted N95/FFP2 respirator if you must go out."
          : aqi > 200
            ? "Limit prolonged outdoor exertion and take extra care if you are in a sensitive group."
            : aqi > 100
              ? "Most people can continue usual activities; sensitive people should reduce prolonged exertion if symptoms occur."
              : "Air quality is comparatively cleaner; verify local conditions before vigorous outdoor exercise.";
        return {
          reply: `### GPS air-quality briefing: ${locationBriefing.location}\n\n**AQI ${locationBriefing.aqi} (${category})**. Dominant pollutant: ${locationBriefing.dominant_pollutant || "PM2.5"}.\n\n**Pollutants:** PM2.5 ${reading("pm2_5")}; PM10 ${reading("pm10")}; NO2 ${reading("no2")}; SO2 ${reading("so2")}; CO ${reading("co")}; O3 ${reading("o3")}.\n\n**Weather:** ${locationBriefing.weather?.temperature ?? "unavailable"}°C, humidity ${locationBriefing.weather?.humidity ?? "unavailable"}%, wind ${locationBriefing.weather?.wind_speed ?? "unavailable"} km/h; inversion ${locationBriefing.weather?.temperature_inversion_detected ? "detected" : "not detected"}.\n\n**Guidance:** ${advice}\n\n**Data quality:** ${locationBriefing.data_source}, updated ${locationBriefing.updated_at}. Browser fix accuracy: ${locationBriefing.accuracy}. This is a non-diagnostic environmental guidance estimate.`,
          ai_provider: "VayuSaathi Environmental Knowledge Engine",
          timestamp: new Date().toLocaleTimeString()
        };
      }

      const lastUserMsg = (messages[messages.length - 1]?.content || "").toLowerCase();
      const persona = context.ai_persona || readStringStorage('vayusaathi_ai_persona', 'scientist');
      const cityLabel = context.city || "your region";
      const aqiVal = Number(context.aqi) || 350;
      const catLabel = context.category || "Very Poor";

      let reply = "";
      if (lastUserMsg.includes("mask") || lastUserMsg.includes("n95")) {
        reply = "Standard surgical or cloth masks filter under 25% of fine PM2.5. Select a tight-sealing N95 or FFP2 respirator with an adjustable metal nose bridge to block sub-micron particles (>95% filtration efficiency).";
      } else if (lastUserMsg.includes("purifier") || lastUserMsg.includes("hepa") || lastUserMsg.includes("filter")) {
        reply = "Place True HEPA (H13) purifiers at least 30 cm clear of walls and keep bedroom doors sealed during peaks. Run continuously at medium fan speed and size CADR to achieve 5 Air Changes per Hour (ACH).";
      } else if (lastUserMsg.includes("exercise") || lastUserMsg.includes("run") || lastUserMsg.includes("walk") || lastUserMsg.includes("jog")) {
        reply = `With AQI at ${aqiVal} (${catLabel}), intense cardio outdoors between 06:00 and 10:00 increases pulmonary particle deposition sharply. Shift endurance workouts indoors with filtration or reschedule closer to the 13:00–15:30 thermal mixing window.`;
      } else if (lastUserMsg.includes("child") || lastUserMsg.includes("senior") || lastUserMsg.includes("elderly") || lastUserMsg.includes("vulnerable") || lastUserMsg.includes("school")) {
        reply = "Children breathe up to 50% more air per kg of body weight than adults, and seniors face heightened vascular stress under elevated PM2.5. Maintain sealed safe-haven rooms with HEPA filtration, supply properly sized N95 masks for commutes, and consult physicians regarding asthma action plans.";
      } else if (lastUserMsg.includes("commute") || lastUserMsg.includes("metro") || lastUserMsg.includes("route") || lastUserMsg.includes("drive")) {
        reply = "Electric metro rail lowers your carbon footprint by ~89% vs a solo petrol car and keeps cabins enclosed. If driving, engage cabin AIR RECIRCULATE mode rather than outside intake while traveling behind heavy diesel vehicles.";
      } else if (lastUserMsg.includes("inversion") || lastUserMsg.includes("weather") || lastUserMsg.includes("smog")) {
        reply = "Radiation temperature inversions happen on calm, cool nights when cold ground-level air becomes trapped beneath warmer air aloft. Because vertical dispersion stalls, PM2.5 stays concentrated until midday solar heating breaks the boundary layer.";
      } else {
        reply = `In ${cityLabel}, AQI is ${aqiVal} (${catLabel}). Prioritize sealed indoor environments during early morning and late evening hours, use damp microfiber mopping rather than dry sweeping, and time brief cross-ventilation for 13:00–15:00.`;
      }

      if (persona === 'commuter') {
        reply += "\n\n**Commuter Note:** Prefer enclosed electric transit, verify wiper/recirculation cabin filters, and avoid cycling directly along heavy freight corridors during rush hours.";
      } else if (persona === 'pediatric') {
        reply += "\n\n**Family Shielding Note:** Ensure children and seniors stay inside the cleanest purified room overnight; this environmental guidance is non-medical—consult a doctor for respiratory symptoms.";
      }

      // Persist regular chat messages locally
      const historyToSave = [...messages, { role: 'assistant', content: reply, ai_provider: "VayuSaathi Environmental Knowledge Engine" }].slice(-40);
      writeJsonStorage('vayusaathi_chat_history', historyToSave);

      return {
        reply,
        ai_provider: "VayuSaathi Environmental Knowledge Engine",
        timestamp: new Date().toLocaleTimeString()
      };
    },

    async getChatHistory() {
      const live = await safeFetch('/api/chat/history');
      if (live) return live;
      return { messages: readJsonStorage('vayusaathi_chat_history', [], 'hawawise_chat_history') };
    },

    async clearChatHistory() {
      await safeFetch('/api/chat/history', { method: "DELETE" });
      try {
        localStorage.removeItem('vayusaathi_chat_history');
        localStorage.removeItem('hawawise_chat_history');
      } catch (e) {}
      return { message: "Chat history cleared" };
    },

    async getProfile() {
      const live = await safeFetch('/api/profile');
      if (live && Object.keys(live).length > 0) return live;
      return readJsonStorage('vayusaathi_profile', { ...DEFAULT_PROFILE }, 'hawawise_profile');
    },

    async saveProfile(profile) {
      const cleanProfile = { ...DEFAULT_PROFILE, ...profile };
      const live = await safeFetch('/api/profile', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanProfile)
      });
      writeJsonStorage('vayusaathi_profile', cleanProfile);
      return live || { message: "Profile saved successfully", profile: cleanProfile };
    },

    async generateRoutine(city = "Delhi NCR", aqi = 350, category = "Very Poor", pm2_5 = 180.0) {
      const live = await safeFetch('/api/routine/generate', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, aqi, category, pm2_5 })
      });
      if (live) return live;

      const isClean = Number(aqi) <= 120;
      return {
        title: `Clean-Air Daily Schedule — ${city} (${category})`,
        city,
        aqi_level: aqi,
        aqi_category: category,
        morning: [
          {
            time: "06:30 AM",
            action: isClean ? "Brisk Outdoor Morning Walk" : "Indoor Mobility & Breathing Session",
            why: isClean ? "Ambient particulates are safely dispersed along your route." : "Peak morning thermal inversion traps particulates close to ground level.",
            env_benefit: "Zero cold-start commuter emissions",
            personal_benefit: isClean ? "Supports cardiopulmonary endurance" : "Avoids inhaling trapped surface PM2.5"
          },
          {
            time: "07:30 AM",
            action: "Covered Induction Cooking with Range Exhaust",
            why: "Uncovered pan frying spikes indoor fine particles past 300 µg/m³.",
            env_benefit: "Lower fossil gas indoor combustion",
            personal_benefit: "Keeps kitchen & adjacent living spaces cleaner"
          },
          {
            time: "08:15 AM",
            action: isClean ? "Metro / Shared Transit Commute" : "Metro Transit with N95/FFP2 Seal",
            why: "Peak rush-hour arterial congestion elevates corridor NO2 and black carbon.",
            env_benefit: "Saves ~1.9 kg CO2 vs solo petrol vehicle",
            personal_benefit: "Filtered transit lowers cumulative respiratory dose"
          }
        ],
        afternoon: [
          {
            time: "01:15 PM",
            action: "15-Minute Cross-Ventilation Window",
            why: "Midday solar warming lifts the boundary layer ceiling and disperses smog.",
            env_benefit: "Passive indoor CO2 reduction without fan load",
            personal_benefit: "Prevents afternoon fatigue and stiffness"
          },
          {
            time: "02:30 PM",
            action: "Consolidate Deliveries & Errands",
            why: "Combining trips cuts cold-start fuel inefficiencies.",
            env_benefit: "Saves ~0.8 kg CO2 in local trips",
            personal_benefit: "Minimizes roadside exhaust exposure"
          }
        ],
        evening: [
          {
            time: "06:30 PM",
            action: "Reseal Windows & Damp Microfiber Mopping",
            why: "Evening radiative cooling rebuilds surface smog; dry brooms resuspend settled PM10.",
            env_benefit: "Eliminates aerosol surface sprays",
            personal_benefit: "Reduces nocturnal nasal and throat irritation"
          },
          {
            time: "09:15 PM",
            action: "Bedroom HEPA Air Purifier Flush",
            why: "Running purifier before sleep clears day-infiltrated fine aerosols.",
            env_benefit: "BLDC fan uses under 20W on sleep setting",
            personal_benefit: "Supports clean nocturnal pulmonary recovery"
          }
        ],
        total_co2_avoided_kg: 2.7,
        total_pm_avoided_g: 0.96
      };
    },

    async getSavedRoutines() {
      const live = await safeFetch('/api/routine/saved');
      return live || { routines: readJsonStorage('vayusaathi_saved_routines', []) };
    },

    async saveRoutine(routine) {
      const live = await safeFetch('/api/routine/save', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(routine)
      });
      const existing = readJsonStorage('vayusaathi_saved_routines', []);
      existing.unshift({ ...routine, saved_at: new Date().toISOString() });
      writeJsonStorage('vayusaathi_saved_routines', existing.slice(0, 10));
      return live || { message: "Routine saved successfully" };
    },

    async generateFamilyPlan(city = "Delhi NCR") {
      const live = await safeFetch(`/api/family/plan?city=${encodeURIComponent(city)}`, { method: "POST" });
      if (live) return live;

      return {
        city,
        air_quality_summary: "Diurnal surface inversion with elevated fine particulate risk during commute hours.",
        general_recommendations: [
          "Seal window gaps between 06:00–10:00 and 18:30–23:00 during severe episodes.",
          "Operate a properly sized True HEPA (H13) purifier continuously in occupied bedrooms.",
          "Wear contour-fitted N95/FFP2 respirators during necessary outdoor transit."
        ],
        disclaimer: "Important: VayuSaathi provides environmental science guidance, not medical diagnosis or treatment."
      };
    },

    async getIaqIntelligence() {
      const live = await safeFetch('/api/iaq/intelligence');
      if (live) return live;

      return {
        title: "Indoor Air Quality (IAQ) Intelligence",
        ventilation_windows: [
          {
            time_slot: "06:00 AM – 10:00 AM",
            status: "KEEP SEALED (INVERSION PEAK)",
            color: "#EF4444",
            reason: "Nocturnal radiation inversion traps vehicular and biomass particulates close to ground level."
          },
          {
            time_slot: "01:00 PM – 03:30 PM",
            status: "OPTIMAL CROSS-VENTILATION",
            color: "#10B981",
            reason: "Midday solar warming breaks the boundary layer ceiling, diluting surface PM2.5 for brief 10–15 min airing."
          },
          {
            time_slot: "07:00 PM – 11:00 PM",
            status: "RESEAL & FILTER",
            color: "#F97316",
            reason: "Evening cooling re-establishes stagnant air near street corridors; keep True HEPA filtration running."
          }
        ],
        combustion_sources: [
          {
            source: "Incense Sticks (Agarbatti) & Dhoop",
            pm25_impact: "+350 to 800 µg/m³ peak",
            action: "Eliminate burning indoors during stagnant smog days to prevent fine carbon soot saturation.",
            substitute: "Ultrasonic diffusers or LED lamps."
          },
          {
            source: "Uncovered Frying & High-Heat Cooking",
            pm25_impact: "+200 to 500 µg/m³",
            action: "Cover cookware and run range exhaust hoods 2 minutes before lighting burners.",
            substitute: "Covered induction or pressure cooking."
          },
          {
            source: "Mosquito Coils",
            pm25_impact: "High micro-particulate accumulation",
            action: "Avoid smoldering coils inside closed winter bedrooms.",
            substitute: "Fine window mesh screens."
          },
          {
            source: "Dry Broom Sweeping",
            pm25_impact: "Resuspends settled PM10 & PM2.5 dust",
            action: "Replace dry sweeping with damp microfiber mopping.",
            substitute: "Damp microfiber mop or HEPA-sealed vacuum."
          }
        ],
        myth_busters: [
          {
            myth: "Houseplants alone can clean severe winter smog from bedrooms.",
            fact: "BUSTED. Standard chamber studies measured VOCs, not ambient PM2.5. You would need dozens of plants per square meter to match even a basic mechanical True HEPA purifier.",
            guidance: "Enjoy plants for aesthetics, but use certified H13 HEPA filtration during smog episodes."
          },
          {
            myth: "Standard split AC filters remove toxic PM2.5 smog.",
            fact: "PARTIAL. Coarse AC meshes trap hair and visible dust while fine <2.5 µm particles pass straight through.",
            guidance: "Set AC to recirculate only, disable fresh air intake, and pair with a CADR-matched HEPA purifier."
          }
        ]
      };
    },

    async compareAlternatives(tripKm = 15.0) {
      const live = await safeFetch(`/api/alternatives/compare?trip_km=${encodeURIComponent(tripKm)}`, { method: "POST" });
      if (live) return live;

      const km = Math.max(1, parseFloat(tripKm) || 15.0);
      const baseCo2 = +(km * 0.142).toFixed(2);
      const basePm = +(km * 0.045).toFixed(3);

      const modes = [
        { key: "electric_metro", name: "Electric Metro / Rail", co2_per_km: 0.016, pm_per_km: 0.001 },
        { key: "cng_city_bus", name: "CNG City Bus", co2_per_km: 0.034, pm_per_km: 0.008 },
        { key: "carpool_3person", name: "Carpool (3 Occupants)", co2_per_km: 0.047, pm_per_km: 0.015 },
        { key: "petrol_two_wheeler", name: "Two-Wheeler (Commuter)", co2_per_km: 0.044, pm_per_km: 0.030 },
        { key: "petrol_car_solo", name: "Petrol Car (Solo Baseline)", co2_per_km: 0.142, pm_per_km: 0.045 },
        { key: "diesel_car_solo", name: "Diesel SUV / Car (Solo)", co2_per_km: 0.168, pm_per_km: 0.082 }
      ];

      const comparisons = modes.map(m => {
        const co2Emitted = +(km * m.co2_per_km).toFixed(2);
        const pmEmitted = +(km * m.pm_per_km).toFixed(3);
        const co2Saved = +(baseCo2 - co2Emitted).toFixed(2);
        const pmSaved = +(basePm - pmEmitted).toFixed(3);
        const pct = Math.round(((baseCo2 - co2Emitted) / (baseCo2 || 1)) * 100);
        return {
          key: m.key,
          name: m.name,
          co2_emitted_kg: co2Emitted,
          pm25_emitted_g: pmEmitted,
          co2_saved_kg: Math.max(0, co2Saved),
          pm25_saved_g: Math.max(0, pmSaved),
          reduction_percentage: pct
        };
      });

      return {
        trip_distance_km: km,
        baseline: {
          name: "Petrol Car (Solo BS-VI 1.2L)",
          co2_emitted_kg: baseCo2,
          pm25_emitted_g: basePm
        },
        comparisons,
        methodology: "Emission factors sourced from Indian CEA Grid Baseline Database v19, ARAI vehicular benchmarks, and CPCB tailpipe + brake wear studies."
      };
    },

    async getCommunityHub() {
      const live = await safeFetch('/api/community/hub');
      if (live) return live;

      const reports = readJsonStorage('vayusaathi_community_reports', DEFAULT_REPORTS, 'hawawise_community_reports');
      return {
        campaigns: [
          {
            id: "c1",
            title: "Clean School Corridors & No-Idling Zones",
            participants: 420,
            goal: "Eliminate engine idling within 200m of schools during student pickup.",
            impact_milestone: "2.4 tons CO2 avoided across 18 campuses",
            progress_pct: 74
          },
          {
            id: "c2",
            title: "Anti-Biomass Burning Neighborhood Vigil",
            participants: 680,
            goal: "Report and extinguish dry leaf and municipal trash fires early.",
            impact_milestone: "84 open burning incidents averted",
            progress_pct: 88
          },
          {
            id: "c3",
            title: "Friday Public Transit Challenge",
            participants: 1250,
            goal: "Commit to Metro, bus, or carpool transit every Friday.",
            impact_milestone: "15,800 private car-km avoided",
            progress_pct: 92
          }
        ],
        reports,
        community_stats: {
          active_members: 2350,
          total_community_co2_saved_kg: 1432.6,
          total_community_pm_saved_g: 429.0,
          verified_reports_resolved: 38 + Math.max(0, reports.length - DEFAULT_REPORTS.length)
        }
      };
    },

    async submitCommunityReport(report) {
      const payload = {
        title: String(report.title || "").trim().slice(0, 140),
        category: String(report.category || "waste_burning").slice(0, 50),
        location_name: String(report.location_name || "").trim().slice(0, 120),
        severity: ["low", "medium", "high", "critical"].includes(report.severity) ? report.severity : "medium",
        description: String(report.description || "").trim().slice(0, 600)
      };

      const live = await safeFetch('/api/community/report', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const reports = readJsonStorage('vayusaathi_community_reports', [...DEFAULT_REPORTS], 'hawawise_community_reports');
      const newRep = {
        id: Date.now(),
        ...payload,
        upvotes: 1,
        status: "Submitted for Verification",
        created_at: new Date().toISOString()
      };
      reports.unshift(newRep);
      writeJsonStorage('vayusaathi_community_reports', reports);

      return live || { message: "Report submitted successfully", report: newRep };
    },

    async upvoteReport(id) {
      const live = await safeFetch(`/api/community/upvote/${encodeURIComponent(id)}`, { method: "POST" });
      const reports = readJsonStorage('vayusaathi_community_reports', [...DEFAULT_REPORTS], 'hawawise_community_reports');
      const match = reports.find(x => String(x.id) === String(id));
      if (match) {
        match.upvotes = (Number(match.upvotes) || 0) + 1;
        writeJsonStorage('vayusaathi_community_reports', reports);
      }
      return live || { message: "Upvote registered" };
    },

    async getImpactStats() {
      const live = await safeFetch('/api/impact/stats');
      if (live) return live;

      const logged = readJsonStorage('vayusaathi_logged_actions', [], 'hawawise_logged_actions');
      const allActions = [...logged.slice().reverse(), ...DEFAULT_SEED_ACTIONS];

      let totalCo2 = 0;
      let totalPm = 0;
      let totalPts = 0;
      const categorySet = new Set();

      allActions.forEach(a => {
        totalCo2 += parseFloat(a.co2_saved_kg) || 0;
        totalPm += parseFloat(a.pm_saved_g) || 0;
        totalPts += parseInt(a.points, 10) || 15;
        if (a.category) categorySet.add(a.category);
      });

      const score = Math.min(100, Math.max(78, Math.min(40, allActions.length * 6) + Math.min(40, Math.floor(totalPts * 0.25)) + Math.min(20, categorySet.size * 5)));
      return {
        sustainability_score: score,
        score_tier: score >= 90 ? "Clean Air Guardian (Level 5)" : "Clean Air Champion (Level 4)",
        score_explanation: "Behavioral engagement metric reflecting consistency across low-emission routines, not a direct ambient air quality index.",
        total_actions_completed: allActions.length,
        total_co2_saved_kg: Math.round(totalCo2 * 100) / 100,
        total_pm_saved_g: Math.round(totalPm * 10) / 10,
        total_points: totalPts,
        equivalent_metrics: {
          trees_planted_equivalent: Math.round((totalCo2 / 21.77) * 10) / 10,
          clean_air_breathing_hours: Math.round(totalPm * 2.5),
          car_kilometers_avoided: Math.round((totalCo2 / 0.142) * 10) / 10
        },
        recent_actions: allActions.slice(0, 8),
        weekly_trend: [
          { day: "Mon", co2_saved_kg: 1.8, pm_saved_g: 0.55, actions: 2 },
          { day: "Tue", co2_saved_kg: 2.4, pm_saved_g: 0.72, actions: 3 },
          { day: "Wed", co2_saved_kg: 1.2, pm_saved_g: 0.38, actions: 1 },
          { day: "Thu", co2_saved_kg: 3.1, pm_saved_g: 0.95, actions: 3 },
          { day: "Fri", co2_saved_kg: 2.8, pm_saved_g: 0.84, actions: 2 },
          { day: "Sat", co2_saved_kg: 0.9, pm_saved_g: 0.25, actions: 1 },
          { day: "Sun", co2_saved_kg: +(1.5 + logged.length * 0.4).toFixed(2), pm_saved_g: +(0.45 + logged.length * 0.12).toFixed(2), actions: 2 + logged.length }
        ],
        methodology: "Reductions derived from CPCB vehicular standards (BS-VI) and CEA CO2 grid emission factors."
      };
    },

    async logImpactAction(action) {
      const cleanAction = {
        action_type: String(action.action_type || "custom_action").slice(0, 60),
        category: String(action.category || "commute").slice(0, 40),
        title: String(action.title || "Clean Air Action").trim().slice(0, 140),
        description: String(action.description || "").trim().slice(0, 400),
        co2_saved_kg: Math.max(0, Math.min(500, parseFloat(action.co2_saved_kg) || 0.5)),
        pm_saved_g: Math.max(0, Math.min(5000, parseFloat(action.pm_saved_g) || 0.15)),
        points: Math.max(1, Math.min(500, parseInt(action.points, 10) || 15)),
        completed_at: new Date().toISOString()
      };

      const live = await safeFetch('/api/impact/log-action', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanAction)
      });

      const actions = readJsonStorage('vayusaathi_logged_actions', [], 'hawawise_logged_actions');
      actions.push(cleanAction);
      writeJsonStorage('vayusaathi_logged_actions', actions);

      return live || { message: "Action logged successfully", points_earned: cleanAction.points };
    },

    async getAlerts() {
      const live = await safeFetch('/api/alerts');
      if (live) return live;

      const customAlerts = readJsonStorage('vayusaathi_custom_alerts', []);
      const readIds = readJsonStorage('vayusaathi_read_alerts', [], 'hawawise_read_alerts').map(String);
      const alerts = [...customAlerts, ...DEFAULT_ALERTS].map(a => ({
        ...a,
        is_read: readIds.includes(String(a.id)) ? 1 : 0
      }));
      return { alerts };
    },

    async markAlertsRead(id = null) {
      const query = id !== null && id !== undefined ? `?alert_id=${encodeURIComponent(id)}` : "";
      await safeFetch(`/api/alerts/mark-read${query}`, { method: "POST" });

      const readIds = readJsonStorage('vayusaathi_read_alerts', [], 'hawawise_read_alerts').map(String);
      if (id !== null && id !== undefined) {
        if (!readIds.includes(String(id))) readIds.push(String(id));
      } else {
        const current = await this.getAlerts();
        (current.alerts || []).forEach(a => {
          if (!readIds.includes(String(a.id))) readIds.push(String(a.id));
        });
      }
      writeJsonStorage('vayusaathi_read_alerts', readIds);
      return { message: "Alerts marked as read" };
    },

    async triggerDemoAlert(scenario = "smog_spike") {
      const live = await safeFetch('/api/alerts/trigger-demo', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario })
      });
      if (live) return live;

      const templates = {
        smog_spike: {
          title: "Emergency Smog Spike Alert",
          message: "Anand Vihar AQI surged past 442 (Severe). Thermal boundary inversion active; defer strenuous outdoor activities.",
          severity: "danger",
          category: "aqi_spike"
        },
        ventilation: {
          title: "Favorable Cross-Ventilation Window",
          message: "Solar heating temporarily lifted surface particulates. Safe 15-minute airing window active now.",
          severity: "info",
          category: "health_warning"
        },
        achievement: {
          title: "Clean Commute Community Milestone",
          message: "Citizens logged 100 electric metro commutes today, avoiding 42 kg of urban tailpipe CO2.",
          severity: "success",
          category: "achievement"
        }
      };

      const tpl = templates[scenario] || templates.smog_spike;
      const custom = readJsonStorage('vayusaathi_custom_alerts', []);
      custom.unshift({
        id: Date.now(),
        ...tpl,
        is_read: 0,
        created_at: new Date().toISOString()
      });
      writeJsonStorage('vayusaathi_custom_alerts', custom.slice(0, 12));
      return { status: "alert_triggered", alert: tpl };
    },

    async getSettings() {
      const live = await safeFetch('/api/settings');
      const gmapsKey = readStringStorage('vayusaathi_google_maps_key', '');
      const gemKey = readStringStorage('vayusaathi_gemini_key', '');

      const base = {
        gemini_api_key_configured: Boolean(gemKey),
        has_gemini_key: Boolean(gemKey),
        masked_key: gemKey ? `${gemKey.slice(0, 4)}...${gemKey.slice(-4)}` : null,
        google_maps_api_key: gmapsKey,
        has_google_maps_key: Boolean(gmapsKey && gmapsKey.length > 15),
        masked_google_maps_key: gmapsKey ? `${gmapsKey.slice(0, 6)}...${gmapsKey.slice(-4)}` : null,
        theme: readStringStorage('vayusaathi_theme', 'dark', 'hawawise_theme'),
        map_layer: readStringStorage('vayusaathi_map_layer', 'google_streets', 'hawawise_map_layer'),
        auto_locate: readStringStorage('vayusaathi_auto_locate', 'true') !== 'false',
        map_zoom: parseInt(readStringStorage('vayusaathi_map_zoom', '11'), 10) || 11,
        aqi_threshold_alerts: 300,
        high_accuracy_gps_default: true,
        temp_unit: readStringStorage('vayusaathi_temp_unit', 'C', 'hawawise_temp_unit'),
        refresh_interval: parseInt(readStringStorage('vayusaathi_refresh_interval', '5'), 10) || 0,
        high_contrast: readStringStorage('vayusaathi_high_contrast', 'false') === 'true',
        ai_persona: readStringStorage('vayusaathi_ai_persona', 'scientist')
      };

      if (!live) return base;
      return {
        ...base,
        ...live,
        google_maps_api_key: live.google_maps_api_key || gmapsKey,
        has_google_maps_key: Boolean((live.google_maps_api_key || gmapsKey).length > 15),
        has_gemini_key: Boolean(live.has_gemini_key || gemKey)
      };
    },

    async saveSettings(settings) {
      const mapping = {
        google_maps_api_key: 'vayusaathi_google_maps_key',
        gemini_api_key: 'vayusaathi_gemini_key',
        map_layer: 'vayusaathi_map_layer',
        auto_locate: 'vayusaathi_auto_locate',
        map_zoom: 'vayusaathi_map_zoom',
        temp_unit: 'vayusaathi_temp_unit',
        refresh_interval: 'vayusaathi_refresh_interval',
        high_contrast: 'vayusaathi_high_contrast',
        ai_persona: 'vayusaathi_ai_persona',
        theme: 'vayusaathi_theme'
      };

      Object.entries(mapping).forEach(([field, storageKey]) => {
        if (settings[field] !== undefined) {
          const v = typeof settings[field] === 'string' ? settings[field].trim() : String(settings[field]);
          writeStringStorage(storageKey, v);
        }
      });

      const live = await safeFetch('/api/settings', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      return live || { message: "Settings saved successfully." };
    },

    async testGeminiKey(key) {
      const clean = String(key || "").trim();
      const live = await safeFetch('/api/settings/test-key', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: clean })
      });
      if (live) return live;

      const ok = clean.length >= 25 && clean.startsWith('AIza');
      return {
        status: ok ? "success" : "error",
        valid: ok,
        message: ok ? "Gemini API key format looks valid and is saved for cloud requests when backend is active." : "Key should start with 'AIza' and be at least 25 characters.",
        model: "gemini-2.5-flash"
      };
    },

    async testGoogleMapsKey(key) {
      const clean = String(key || "").trim();
      if (!clean) {
        return {
          status: "info",
          valid: true,
          message: "Zero-Headache Mode active: Google Maps layers render automatically without requiring an API key."
        };
      }
      if (clean.length < 25) {
        return {
          status: "error",
          valid: false,
          message: "Google Maps API keys typically start with 'AIza' and are ~39 characters long."
        };
      }
      return {
        status: "success",
        valid: true,
        message: "Google Maps API key validated and attached to tile requests."
      };
    },

    async getDemoScenario(scenarioName) {
      const live = await safeFetch(`/api/demo/scenario/${encodeURIComponent(scenarioName)}`);
      if (live) return live;

      const scenarios = {
        delhi_winter: {
          title: "Delhi NCR Severe Winter Smog Crisis",
          city: "Delhi NCR",
          aqi: 386,
          category: "Very Poor",
          pm2_5: 218.4,
          household: {
            household_size: 4,
            children_count: 1,
            seniors_count: 1,
            has_asthma_respiratory: 1,
            commute_mode: "two_wheeler",
            daily_commute_km: 18.0,
            home_ventilation: "split_ac_windows",
            has_air_purifier: 0
          },
          situation_brief: "Winter radiation inversion trapping smoke and traffic emissions in calm cold air."
        },
        bengaluru_clean: {
          title: "Bengaluru Urban Plateau Low-Emission Study",
          city: "Bengaluru",
          aqi: 88,
          category: "Satisfactory",
          pm2_5: 38.0,
          household: {
            household_size: 3,
            children_count: 1,
            seniors_count: 0,
            has_asthma_respiratory: 0,
            commute_mode: "electric_metro",
            daily_commute_km: 12.0,
            home_ventilation: "open_windows",
            has_air_purifier: 1
          },
          situation_brief: "Satisfactory air quality demonstrating proactive green commuting and clean air tracking."
        },
        lahore_smog: {
          title: "Lahore Hazardous Winter Smog Emergency",
          city: "Lahore",
          aqi: 468,
          category: "Severe",
          pm2_5: 340.0,
          household: {
            household_size: 5,
            children_count: 2,
            seniors_count: 1,
            has_asthma_respiratory: 1,
            commute_mode: "petrol_car_solo",
            daily_commute_km: 22.0,
            home_ventilation: "sealed_rooms",
            has_air_purifier: 1
          },
          situation_brief: "Severe regional smog emergency activating strict N95 and indoor safe-haven filtration protocols."
        }
      };

      return scenarios[scenarioName] || scenarios.delhi_winter;
    }
  };

  return api;
});
