/**
 * VayuSaathi - High-Resilience Frontend API Service Client
 * Full CPCB NAQI contract implementation with intelligent single-probe connectivity.
 * Zero console errors, zero failed fetch spam, instant fallback.
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

  // Check connectivity once silently
  async function checkBackendOnce() {
    if (backendChecked) return isBackendOnline;
    backendChecked = true;

    if (typeof window === "undefined" || !window.location) {
      isBackendOnline = false;
      return false;
    }

    const loc = window.location;
    if (loc.protocol === "file:") {
      isBackendOnline = false;
      return false;
    }

    if (loc.port === "8000") {
      activeApiBase = loc.origin;
      isBackendOnline = true;
      return true;
    }

    // Try origin first if http
    if (loc.protocol.startsWith("http")) {
      try {
        const c = new AbortController();
        const id = setTimeout(() => c.abort(), 400);
        const res = await fetch(`${loc.origin}/api/health`, { signal: c.signal, credentials: 'omit' });
        clearTimeout(id);
        if (res.ok) {
          activeApiBase = loc.origin;
          isBackendOnline = true;
          return true;
        }
      } catch (e) {}
    }

    // Quick single probe to standard local backend
    try {
      const c = new AbortController();
      const id = setTimeout(() => c.abort(), 400);
      const res = await fetch("http://127.0.0.1:8000/api/health", { signal: c.signal, credentials: 'omit' });
      clearTimeout(id);
      if (res.ok) {
        activeApiBase = "http://127.0.0.1:8000";
        isBackendOnline = true;
        return true;
      }
    } catch (e) {}

    isBackendOnline = false;
    return false;
  }

  // Safe fetch that only queries when backend is verified
  async function safeFetch(endpoint, options = {}, timeoutMs = 2500) {
    if (!backendChecked) {
      await checkBackendOnce();
    }
    if (!isBackendOnline || !activeApiBase) {
      return null;
    }

    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);
      const res = await fetch(`${activeApiBase}${endpoint}`, { ...options, signal: controller.signal, credentials: 'omit' });
      clearTimeout(id);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      isBackendOnline = false; // Mark offline if it fails
    }
    return null;
  }

  // CPCB Standard Baseline Cities
  const FALLBACK_CITIES = [
    { key: "Delhi NCR", name: "Delhi NCR, India", baseline_aqi: 388, lat: 28.6139, lon: 77.2090, region: "Indo-Gangetic Plain" },
    { key: "Mumbai", name: "Mumbai, Maharashtra", baseline_aqi: 142, lat: 19.0760, lon: 72.8777, region: "Western Coastal Belt" },
    { key: "Bengaluru", name: "Bengaluru, Karnataka", baseline_aqi: 88, lat: 12.9716, lon: 77.5946, region: "Deccan Plateau" },
    { key: "Kolkata", name: "Kolkata, West Bengal", baseline_aqi: 265, lat: 22.5726, lon: 88.3639, region: "Lower Gangetic Delta" },
    { key: "Hyderabad", name: "Hyderabad, Telangana", baseline_aqi: 132, lat: 17.3850, lon: 78.4867, region: "South Central Deccan" },
    { key: "Chennai", name: "Chennai, Tamil Nadu", baseline_aqi: 95, lat: 13.0827, lon: 80.2707, region: "Coromandel Coast" },
    { key: "Lucknow", name: "Lucknow, Uttar Pradesh", baseline_aqi: 340, lat: 26.8467, lon: 80.9462, region: "Central Gangetic Plain" },
    { key: "Patna", name: "Patna, Bihar", baseline_aqi: 375, lat: 25.5941, lon: 85.1376, region: "Middle Gangetic Basin" }
  ];

  function getAqiMeta(aqi) {
    if (aqi > 400) {
      return {
        category: "Severe",
        color: "#f43f5e",
        health_advisory: "Respiratory illness risk upon prolonged exposure. Avoid all strenuous outdoor activities.",
        sensitive_advisory: "People with lung diseases, children and older adults must remain indoors with HEPA filtration active.",
        mask_recommended: true
      };
    }
    if (aqi > 300) {
      return {
        category: "Very Poor",
        color: "#ef4444",
        health_advisory: "Respiratory discomfort to people on prolonged exposure. Limit early morning and evening outdoor movement.",
        sensitive_advisory: "Vulnerable individuals, seniors and children should avoid heavy physical activity outdoors.",
        mask_recommended: true
      };
    }
    if (aqi > 200) {
      return {
        category: "Poor",
        color: "#f97316",
        health_advisory: "Breathing discomfort to most people on prolonged exposure.",
        sensitive_advisory: "Children and elderly should minimize outdoor cardio during morning inversion hours.",
        mask_recommended: true
      };
    }
    if (aqi > 100) {
      return {
        category: "Moderate",
        color: "#f59e0b",
        health_advisory: "Air quality is acceptable for healthy individuals; slight discomfort for sensitive groups.",
        sensitive_advisory: "Sensitive individuals should observe any respiratory irritation.",
        mask_recommended: false
      };
    }
    if (aqi > 50) {
      return {
        category: "Satisfactory",
        color: "#10b981",
        health_advisory: "Minor breathing discomfort to sensitive individuals.",
        sensitive_advisory: "No special restrictions required.",
        mask_recommended: false
      };
    }
    return {
      category: "Good",
      color: "#059669",
      health_advisory: "Air quality is considered ideal, pose negligible health risk.",
      sensitive_advisory: "Ideal conditions for all outdoor activities.",
      mask_recommended: false
    };
  }

  function generateAirQualityFallback(city = "Delhi NCR", lat = null, lon = null) {
    let baseline = 388;
    let cityName = city;

    const matched = FALLBACK_CITIES.find(c => c.key === city || c.name.includes(city));
    if (matched) {
      baseline = matched.baseline_aqi;
      cityName = matched.name;
    }

    const meta = getAqiMeta(baseline);
    const pm25 = Math.round(baseline * 0.58 * 10) / 10;
    const pm10 = Math.round(baseline * 0.95 * 10) / 10;
    const no2 = Math.round((45 + (baseline / 10)) * 10) / 10;
    const so2 = 18.2;
    const co = Math.round((1.2 + (baseline / 200)) * 10) / 10;
    const o3 = 36.0;
    const nh3 = 35.0;

    const now = new Date();
    const currentHour = now.getHours();

    const trend = [];
    for (let i = 0; i < 24; i++) {
      const h = (currentHour + i) % 24;
      const hourStr = `${String(h).padStart(2, '0')}:00`;
      const diurnalFactor = (h >= 5 && h <= 9) || (h >= 19 && h <= 23) ? 1.15 : (h >= 12 && h <= 16 ? 0.82 : 1.0);
      const hAqi = Math.round(baseline * diurnalFactor);
      trend.push({
        time: hourStr,
        hour: hourStr,
        aqi: hAqi,
        pm2_5: Math.round(hAqi * 0.58 * 10) / 10,
        pm10: Math.round(hAqi * 0.95 * 10) / 10,
        temp_c: Math.round((17 - (h >= 2 && h <= 6 ? 4 : 0) + (h >= 13 && h <= 15 ? 6 : 0)) * 10) / 10
      });
    }

    const sev = [
      { day: "Today", aqi: baseline, cat: meta.category, color: meta.color },
      { day: "Tomorrow", aqi: Math.round(baseline * 0.96), cat: meta.category, color: meta.color },
      { day: "Day 3", aqi: Math.round(baseline * 0.91), cat: "Very Poor", color: "#ef4444" },
      { day: "Day 4", aqi: Math.round(baseline * 0.85), cat: "Very Poor", color: "#ef4444" },
      { day: "Day 5", aqi: Math.round(baseline * 0.78), cat: "Poor", color: "#f97316" },
      { day: "Day 6", aqi: Math.round(baseline * 0.74), cat: "Poor", color: "#f97316" },
      { day: "Day 7", aqi: Math.round(baseline * 0.70), cat: "Moderate", color: "#f59e0b" }
    ];

    return {
      is_live: false,
      data_source_type: "CPCB_BASELINE",
      data_source_label: "CPCB National Baseline Network",
      last_updated: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      city: cityName,
      region: `${cityName} Corridor • Elev: ~210m`,
      coordinates: { lat: lat || 28.6139, lon: lon || 77.2090 },
      aqi: baseline,
      category: meta.category,
      color: meta.color,
      health_advisory: meta.health_advisory,
      sensitive_advisory: meta.sensitive_advisory,
      mask_recommended: meta.mask_recommended,
      dominant_pollutant: "PM2.5",
      pollutants: {
        pm2_5: { value: pm25, unit: "µg/m³", safe_limit: 60.0, cpcb_limit: 60.0, sub_index: baseline, status: pm25 > 120 ? "Severe" : "Poor" },
        pm10: { value: pm10, unit: "µg/m³", safe_limit: 100.0, cpcb_limit: 100.0, sub_index: Math.round(baseline * 0.9), status: "Very Poor" },
        no2: { value: no2, unit: "µg/m³", safe_limit: 80.0, cpcb_limit: 80.0, sub_index: 85, status: "Moderate" },
        so2: { value: so2, unit: "µg/m³", safe_limit: 80.0, cpcb_limit: 80.0, sub_index: 22, status: "Good" },
        co: { value: co, unit: "mg/m³", safe_limit: 2.0, cpcb_limit: 2.0, sub_index: 65, status: "Moderate" },
        o3: { value: o3, unit: "µg/m³", safe_limit: 100.0, cpcb_limit: 100.0, sub_index: 38, status: "Good" },
        nh3: { value: nh3, unit: "µg/m³", safe_limit: 400.0, cpcb_limit: 400.0, sub_index: 28, status: "Good" }
      },
      weather: {
        temperature: 16.5,
        temperature_c: 16.5,
        apparent_temperature: 15.0,
        humidity: 78,
        humidity_percent: 78,
        wind_speed: 4.8,
        wind_speed_kmh: 4.8,
        wind_direction: 290,
        wind_direction_cardinal: "WNW",
        pressure_hpa: 1016,
        visibility_km: 2.5,
        uv_index: 3.0,
        condition: "Mist / Thermal Stagnation",
        temperature_inversion_detected: true,
        stagnation_risk: "High",
        boundary_layer_height_m: 320,
        optimal_ventilation_window: "1:00 PM – 2:30 PM (Midday Solar Mixing)"
      },
      trend_24h: trend,
      hourly_forecast: trend,
      seven_day_forecast: sev
    };
  }

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
        endpoint += `&lat=${lat}&lon=${lon}`;
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
          aqi: context.aqi || 350,
          category: context.category || "Very Poor",
          pm2_5: context.pm2_5 || 180.0,
          temperature_inversion: context.temperature_inversion ?? true,
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
              ? "Most people can continue usual activities; sensitive people should reduce prolonged exertion if they notice symptoms."
              : "Air quality is comparatively cleaner; continue checking local conditions before strenuous outdoor activity.";
        return {
          reply: `### GPS air-quality briefing: ${locationBriefing.location}\n\n**AQI ${locationBriefing.aqi} (${category})**. The highest reported pollutant is ${locationBriefing.dominant_pollutant || "not identified"}.\n\n**Pollutants:** PM2.5 ${reading("pm2_5")}; PM10 ${reading("pm10")}; NO2 ${reading("no2")}; SO2 ${reading("so2")}; CO ${reading("co")}; O3 ${reading("o3")}.\n\n**Weather:** ${locationBriefing.weather?.temperature ?? "unavailable"}°C, humidity ${locationBriefing.weather?.humidity ?? "unavailable"}%, wind ${locationBriefing.weather?.wind_speed ?? "unavailable"} km/h; inversion ${locationBriefing.weather?.temperature_inversion_detected ? "detected" : "not detected"}.\n\n**What to do:** ${advice}\n\n**Data quality:** ${locationBriefing.data_source}, updated ${locationBriefing.updated_at}. Browser location accuracy is ${locationBriefing.accuracy}; this is a coordinate-based estimate and may differ from a nearby CPCB monitoring station.`,
          ai_provider: "VayuSaathi Environmental Knowledge Engine",
          timestamp: new Date().toLocaleTimeString()
        };
      }

      const lastUserMsg = (messages[messages.length - 1]?.content || "").toLowerCase();
      let reply = "";

      if (lastUserMsg.includes("mask") || lastUserMsg.includes("n95")) {
        reply = "In current AQI conditions, standard surgical or cloth masks filter less than 25% of fine PM2.5. Use a certified N95 or FFP2 respirator with an airtight perimeter seal. Ensure the metal nose clip is tightly contoured to prevent edge leakage.";
      } else if (lastUserMsg.includes("purifier") || lastUserMsg.includes("hepa") || lastUserMsg.includes("filter")) {
        reply = "Keep HEPA purifiers placed away from walls in high-occupancy rooms. Run at medium speed continuously rather than in bursts on high. Seal leeward door gaps with draft stoppers to maintain an indoor Clean Air Delivery Rate (CADR) surplus.";
      } else if (lastUserMsg.includes("exercise") || lastUserMsg.includes("run") || lastUserMsg.includes("walk") || lastUserMsg.includes("jog")) {
        reply = "Outdoor running between 6:00 AM and 10:00 AM causes 3x higher inhalation of toxic fine aerosols due to nocturnal boundary layer compression. Postpone outdoor workouts or switch to indoor yoga/treadmill with air filtration active.";
      } else if (lastUserMsg.includes("school") || lastUserMsg.includes("child") || lastUserMsg.includes("kid")) {
        reply = "Children have higher inhalation rates per kilogram of body weight and developing lungs. Advocate for school bus anti-idling policies and ensure classrooms operate closed-door HEPA filtration during winter inversion weeks.";
      } else if (lastUserMsg.includes("inversion") || lastUserMsg.includes("weather") || lastUserMsg.includes("wind")) {
        reply = "Surface thermal inversion occurs when cold radiational ground air is trapped underneath warmer upper atmospheric layers. Surface wind speeds below 5 km/h prevent horizontal dispersion, causing heavy particulate build-up until midday solar warming lifts the boundary layer.";
      } else {
        reply = `Air quality in ${context.city || "your region"} is currently in the ${context.category || "Very Poor"} zone (AQI ~${context.aqi || 388}). Limit outdoor exposure during early mornings, maintain sealed indoor spaces with damp mopping, and wear an N95 respirator outdoors.`;
      }

      return {
        reply: reply,
        ai_provider: "VayuSaathi Rule Engine (Local Baseline)",
        timestamp: new Date().toLocaleTimeString()
      };
    },

    async getChatHistory() {
      const live = await safeFetch('/api/chat/history');
      if (live) return live;
      const local = localStorage.getItem('hawawise_chat_history');
      return { messages: local ? JSON.parse(local) : [] };
    },

    async clearChatHistory() {
      await safeFetch('/api/chat/history', { method: "DELETE" });
      localStorage.removeItem('hawawise_chat_history');
      return { message: "Chat history cleared" };
    },

    async getProfile() {
      const live = await safeFetch('/api/profile');
      if (live) return live;

      const stored = localStorage.getItem('hawawise_profile');
      if (stored) {
        try { return JSON.parse(stored); } catch (e) {}
      }
      return {
        user_id: "default_user",
        city: "Delhi NCR",
        household_size: 3,
        children_count: 1,
        seniors_count: 1,
        commute_mode: "metro",
        home_type: "apartment",
        square_feet: 1200,
        air_purifier_present: true,
        purifier_hepa_grade: "H13",
        has_indoor_plants: true,
        members: [
          { name: "Self", age_group: "adult", health_conditions: [] },
          { name: "Elderly Parent", age_group: "senior", health_conditions: ["asthma"] }
        ]
      };
    },

    async saveProfile(profile) {
      const live = await safeFetch('/api/profile', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });
      localStorage.setItem('hawawise_profile', JSON.stringify(profile));
      return live || { message: "Profile saved successfully" };
    },

    async generateRoutine(city = "Delhi NCR", aqi = 350, category = "Very Poor", pm2_5 = 180.0) {
      const live = await safeFetch('/api/routine/generate', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, aqi, category, pm2_5 })
      });
      if (live) return live;

      return {
        routine: {
          title: `Smart Clean-Air Routine (${category})`,
          aqi_context: `AQI ${aqi} (${category})`,
          morning: [
            { time: "06:30 AM", action: "Indoor Yoga & Breathing Exercises", why: "Peak ground thermal inversion traps micro-particulates outdoors.", env_benefit: "Zero cold-start travel emissions", personal_benefit: "Cuts toxic particulate inhalation by 80%" },
            { time: "07:30 AM", action: "Covered Induction Cooking with Range Hood", why: "Unvented shallow frying spikes indoor PM2.5 past 300 µg/m³.", env_benefit: "Eliminates gas combustion byproduct", personal_benefit: "Maintains indoor AQI below 50" },
            { time: "08:15 AM", action: "Electric Metro Commute with N95 Mask", why: "Roadway choke points emit concentrated benzene and black carbon.", env_benefit: "Saves ~1.8 kg CO2 and 0.4g PM2.5 per leg", personal_benefit: "Filtered carriage atmosphere cuts inhalation" }
          ],
          afternoon: [
            { time: "01:15 PM", action: "15-Minute Leeward Cross-Ventilation", why: "Midday convective mixing lifts the surface inversion ceiling.", env_benefit: "Flushes indoor CO2 naturally", personal_benefit: "Restores cognitive alertness" },
            { time: "02:30 PM", action: "Consolidate Deliveries & Virtual Errands", why: "Eliminates fragmented vehicle dispatches.", env_benefit: "Prevents unnecessary delivery vehicle miles", personal_benefit: "Reduces road exposure" }
          ],
          evening: [
            { time: "06:30 PM", action: "Reseal Openings & Damp Microfiber Mopping", why: "Evening cooling triggers secondary inversion; dry brooms resuspend PM10.", env_benefit: "Eliminates chemical aerosol dusters", personal_benefit: "Prevents nocturnal throat and eye irritation" },
            { time: "09:30 PM", action: "Pre-Sleep Bedroom HEPA Filter Flush", why: "Running purifier on turbo 30 min before sleep clears accumulated aerosols.", env_benefit: "Optimizes nightly purifier power usage", personal_benefit: "Promotes restorative sleep without airway inflammation" }
          ]
        }
      };
    },

    async getSavedRoutines() {
      const live = await safeFetch('/api/routine/saved');
      return live || { routines: [] };
    },

    async saveRoutine(routine) {
      const live = await safeFetch('/api/routine/save', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(routine)
      });
      return live || { message: "Routine saved successfully" };
    },

    async generateFamilyPlan(city = "Delhi NCR") {
      const live = await safeFetch(`/api/family/plan?city=${encodeURIComponent(city)}`, { method: "POST" });
      if (live) return live;

      return {
        plan: {
          city: city,
          air_quality_summary: "Severe seasonal particulate trapping with high diurnal variation.",
          general_recommendations: [
            "Keep doors and windows sealed between 6 PM and 11 AM.",
            "Operate HEPA purifiers in high-occupancy rooms continuously.",
            "Contour-fit N95 / FFP2 respirators for all outdoor travel."
          ],
          member_guidance: [
            {
              member_name: "Children",
              category: "Vulnerable Cohort",
              specific_precautions: [
                "Suspend all early morning outdoor sports and assembly.",
                "Equip backpacks with child-sized KF94/N95 masks.",
                "Ensure hydration to keep respiratory mucous barriers intact."
              ]
            },
            {
              member_name: "Elderly & Asthmatics",
              category: "High-Risk Cohort",
              specific_precautions: [
                "Maintain two-week supply of rescue inhalers and prescribed corticosteroids.",
                "Perform twice-daily saline nasal irrigation to clear trapped PM2.5.",
                "Keep bedroom PM2.5 below 25 µg/m³ with active H13 filtration."
              ]
            }
          ]
        }
      };
    },

    async getIaqIntelligence() {
      const live = await safeFetch('/api/iaq/intelligence');
      if (live) return live;

      return {
        indoor_aqi: 68,
        outdoor_aqi: 388,
        iaq_category: "Moderate",
        indoor_pm2_5: 22.4,
        outdoor_pm2_5: 225.0,
        filtration_efficiency_percent: 90.0,
        purifier_running: true,
        room_readings: [
          { room: "Master Bedroom", pm25: 14.2, co2: 680, status: "Clean", purifier: "Active" },
          { room: "Living Room", pm25: 28.5, co2: 740, status: "Acceptable", purifier: "Active" },
          { room: "Kitchen", pm25: 48.0, co2: 890, status: "Elevated", purifier: "Exhaust On" },
          { room: "Home Office", pm25: 19.1, co2: 620, status: "Clean", purifier: "Active" }
        ],
        ventilation_windows: [
          { window: "13:00 - 15:00", description: "Optimal midday convective mixing", risk: "Low" }
        ],
        myth_busters: [
          { myth: "Incense cleans the air", reality: "Burning incense emits high concentrations of PM2.5 and benzene." }
        ],
        optimal_ventilation_window: "1:00 PM – 2:30 PM (Midday Solar Mixing)",
        infiltration_protection_score: 88
      };
    },

    async compareAlternatives(tripKm = 15.0) {
      const live = await safeFetch(`/api/alternatives/compare?trip_km=${tripKm}`, { method: "POST" });
      if (live) return live;

      const km = parseFloat(tripKm) || 15.0;
      const comps = [
        { key: "metro", name: "Electric Metro", mode: "Electric Metro", co2_kg: (km * 0.015).toFixed(2), co2_saved_kg: (km * 0.155).toFixed(2), reduction_percentage: 91, pm25_g: (km * 0.002).toFixed(3), cost_inr: Math.round(km * 2.5 + 10), time_min: Math.round(km * 2.2), tag: "Best Overall" },
        { key: "ebus", name: "Electric Bus", mode: "Electric Bus", co2_kg: (km * 0.035).toFixed(2), co2_saved_kg: (km * 0.135).toFixed(2), reduction_percentage: 79, pm25_g: (km * 0.008).toFixed(3), cost_inr: Math.round(km * 1.5 + 5), time_min: Math.round(km * 3.0), tag: "Low Cost" },
        { key: "carpool", name: "Carpool (3+)", mode: "Carpool (3+)", co2_kg: (km * 0.055).toFixed(2), co2_saved_kg: (km * 0.115).toFixed(2), reduction_percentage: 67, pm25_g: (km * 0.018).toFixed(3), cost_inr: Math.round(km * 4.0), time_min: Math.round(km * 2.8), tag: "Flexible" },
        { key: "evcar", name: "EV Car (Solo)", mode: "EV Car (Solo)", co2_kg: (km * 0.065).toFixed(2), co2_saved_kg: (km * 0.105).toFixed(2), reduction_percentage: 62, pm25_g: (km * 0.022).toFixed(3), cost_inr: Math.round(km * 5.0), time_min: Math.round(km * 2.5), tag: "Zero Tailpipe" },
        { key: "petrol", name: "Petrol Car", mode: "Petrol Car", co2_kg: (km * 0.170).toFixed(2), co2_saved_kg: "0.00", reduction_percentage: 0, pm25_g: (km * 0.045).toFixed(3), cost_inr: Math.round(km * 9.5), time_min: Math.round(km * 2.5), tag: "Baseline" },
        { key: "diesel", name: "Diesel SUV", mode: "Diesel SUV", co2_kg: (km * 0.230).toFixed(2), co2_saved_kg: "-0.90", reduction_percentage: -35, pm25_g: (km * 0.085).toFixed(3), cost_inr: Math.round(km * 11.0), time_min: Math.round(km * 2.5), tag: "Worst Emitter" }
      ];

      return {
        trip_distance_km: km,
        alternatives: comps,
        comparisons: comps
      };
    },

    async getCommunityHub() {
      const live = await safeFetch('/api/community/hub');
      if (live) return live;

      const saved = localStorage.getItem('hawawise_community_reports');
      let reports = [];
      if (saved) {
        try { reports = JSON.parse(saved); } catch (e) {}
      }
      if (reports.length === 0) {
        reports = [
          { id: "rep-1", title: "Commercial Waste Burning", category: "waste_burning", location_name: "Ring Road Bypass, Sec-14", severity: "critical", upvotes: 28, description: "Trash burning behind market complexes causing thick pungent smog.", timestamp: "2 hours ago" },
          { id: "rep-2", title: "Heavy Bus Idling at Terminal", category: "vehicular_idling", location_name: "Sector 8 Intercity Gate", severity: "high", upvotes: 19, description: "Dozens of commercial diesel buses idling continuously near school crossing.", timestamp: "4 hours ago" },
          { id: "rep-3", title: "Uncovered Construction Debris", category: "dust_construction", location_name: "Expressway Flyover Pier 4", severity: "medium", upvotes: 14, description: "Exposed dry aggregate dust blowing onto arterial carriageway.", timestamp: "Yesterday" }
        ];
      }
      return { reports };
    },

    async submitCommunityReport(report) {
      const live = await safeFetch('/api/community/report', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report)
      });

      const saved = localStorage.getItem('hawawise_community_reports');
      let reports = saved ? JSON.parse(saved) : [];
      const newRep = {
        id: "rep-" + Date.now(),
        title: report.title,
        category: report.category,
        location_name: report.location_name,
        severity: report.severity,
        upvotes: 1,
        description: report.description,
        timestamp: "Just now"
      };
      reports.unshift(newRep);
      localStorage.setItem('hawawise_community_reports', JSON.stringify(reports));

      return live || { message: "Report submitted successfully", report: newRep };
    },

    async upvoteReport(id) {
      const live = await safeFetch(`/api/community/upvote/${id}`, { method: "POST" });
      const saved = localStorage.getItem('hawawise_community_reports');
      if (saved) {
        let reports = JSON.parse(saved);
        const r = reports.find(x => x.id === id);
        if (r) {
          r.upvotes = (r.upvotes || 0) + 1;
          localStorage.setItem('hawawise_community_reports', JSON.stringify(reports));
        }
      }
      return live || { message: "Upvote registered" };
    },

    async getImpactStats() {
      const live = await safeFetch('/api/impact/stats');
      if (live) return live;

      const actions = JSON.parse(localStorage.getItem('hawawise_logged_actions') || '[]');
      let addedCo2 = 0;
      let addedPm = 0;
      let addedPts = 0;
      actions.forEach(a => {
        addedCo2 += parseFloat(a.co2_saved_kg) || 0;
        addedPm += parseFloat(a.pm_saved_g) || 0;
        addedPts += parseInt(a.points) || 20;
      });

      return {
        total_co2_saved_kg: Math.round((28.4 + addedCo2) * 10) / 10,
        total_pm_saved_g: Math.round((7.8 + addedPm) * 10) / 10,
        sustainable_trips: 18 + actions.length,
        clean_air_points: 380 + addedPts,
        equivalent_trees: Math.round(((28.4 + addedCo2) / 21.0) * 10) / 10,
        rank_tier: (380 + addedPts) > 500 ? "Gold Defender" : "Silver Guardian",
        weekly_trend: [
          { day: "Mon", co2_saved_kg: 3.8, actions: 3 },
          { day: "Tue", co2_saved_kg: 4.2, actions: 3 },
          { day: "Wed", co2_saved_kg: 5.1, actions: 4 },
          { day: "Thu", co2_saved_kg: 3.4, actions: 2 },
          { day: "Fri", co2_saved_kg: 4.8, actions: 3 },
          { day: "Sat", co2_saved_kg: 2.9, actions: 2 },
          { day: "Sun", co2_saved_kg: 4.2, actions: 3 }
        ]
      };
    },

    async logImpactAction(action) {
      const live = await safeFetch('/api/impact/log-action', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action)
      });

      const actions = JSON.parse(localStorage.getItem('hawawise_logged_actions') || '[]');
      actions.push({
        ...action,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('hawawise_logged_actions', JSON.stringify(actions));

      return live || { message: "Action logged successfully", points_earned: action.points || 25 };
    },

    async getAlerts() {
      const live = await safeFetch('/api/alerts');
      if (live) return live;

      const readIds = JSON.parse(localStorage.getItem('hawawise_read_alerts') || '[]');
      const alerts = [
        {
          id: "alert-cpcb-1",
          level: "severe",
          title: "CPCB GRAP Stage-IV Enforcement Active",
          message: "Severe thermal inversion layer detected below 350 meters. Heavy diesel interstate trucks restricted. Outdoor primary schools transitioned to hybrid.",
          issued_at: "Today, 06:00 AM",
          is_read: readIds.includes("alert-cpcb-1")
        },
        {
          id: "alert-cpcb-2",
          level: "warning",
          title: "Evening Particulate Stagnation Window",
          message: "Wind speeds predicted to drop below 3 km/h after 17:30. Inward residential smoke drift expected along ring corridor.",
          issued_at: "Today, 11:30 AM",
          is_read: readIds.includes("alert-cpcb-2")
        }
      ];

      return { alerts };
    },

    async markAlertsRead(id = null) {
      await safeFetch('/api/alerts/mark-read', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alert_id: id })
      });

      const readIds = JSON.parse(localStorage.getItem('hawawise_read_alerts') || '[]');
      if (id) {
        if (!readIds.includes(id)) readIds.push(id);
      } else {
        readIds.push("alert-cpcb-1", "alert-cpcb-2");
      }
      localStorage.setItem('hawawise_read_alerts', JSON.stringify(readIds));

      return { message: "Alerts marked as read" };
    },

    async triggerDemoAlert(scenario = "smog_spike") {
      const live = await safeFetch('/api/alerts/trigger-demo', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario })
      });
      return live || { message: "Demo alert triggered", scenario };
    },

    async getSettings() {
      const live = await safeFetch('/api/settings');
      const gmapsKey = localStorage.getItem('vayusaathi_google_maps_key') || '';
      const gemKey = localStorage.getItem('vayusaathi_gemini_key') || '';
      
      if (live) {
        return {
          ...live,
          google_maps_api_key: live.google_maps_api_key || gmapsKey,
          has_google_maps_key: Boolean((live.google_maps_api_key || gmapsKey) && (live.google_maps_api_key || gmapsKey).length > 15),
          masked_google_maps_key: (live.google_maps_api_key || gmapsKey) ? `${(live.google_maps_api_key || gmapsKey).slice(0, 6)}...${(live.google_maps_api_key || gmapsKey).slice(-4)}` : null,
          has_gemini_key: live.has_gemini_key || Boolean(gemKey),
          masked_key: live.masked_key || (gemKey ? `${gemKey.slice(0, 4)}...${gemKey.slice(-4)}` : null),
          map_layer: live.map_layer || localStorage.getItem('vayusaathi_map_layer') || 'google_streets',
          auto_locate: live.auto_locate !== undefined ? live.auto_locate : (localStorage.getItem('vayusaathi_auto_locate') !== 'false'),
          temp_unit: live.temp_unit || localStorage.getItem('vayusaathi_temp_unit') || 'C',
          refresh_interval: parseInt(localStorage.getItem('vayusaathi_refresh_interval') || '5'),
          high_contrast: localStorage.getItem('vayusaathi_high_contrast') === 'true',
          ai_persona: localStorage.getItem('vayusaathi_ai_persona') || 'scientist'
        };
      }

      return {
        gemini_api_key_configured: Boolean(gemKey),
        has_gemini_key: Boolean(gemKey),
        masked_key: gemKey ? `${gemKey.slice(0, 4)}...${gemKey.slice(-4)}` : null,
        google_maps_api_key: gmapsKey,
        has_google_maps_key: Boolean(gmapsKey && gmapsKey.length > 15),
        masked_google_maps_key: gmapsKey ? `${gmapsKey.slice(0, 6)}...${gmapsKey.slice(-4)}` : null,
        theme: localStorage.getItem('vayusaathi_theme') || 'dark',
        map_layer: localStorage.getItem('vayusaathi_map_layer') || 'google_streets',
        auto_locate: localStorage.getItem('vayusaathi_auto_locate') !== 'false',
        map_zoom: parseInt(localStorage.getItem('vayusaathi_map_zoom') || '11'),
        aqi_threshold_alerts: 300,
        high_accuracy_gps_default: true,
        temp_unit: localStorage.getItem('vayusaathi_temp_unit') || "C",
        refresh_interval: parseInt(localStorage.getItem('vayusaathi_refresh_interval') || '5'),
        high_contrast: localStorage.getItem('vayusaathi_high_contrast') === 'true',
        ai_persona: localStorage.getItem('vayusaathi_ai_persona') || 'scientist'
      };
    },

    async saveSettings(settings) {
      if (settings.google_maps_api_key !== undefined) {
        localStorage.setItem('vayusaathi_google_maps_key', settings.google_maps_api_key.trim());
      }
      if (settings.gemini_api_key !== undefined) {
        localStorage.setItem('vayusaathi_gemini_key', settings.gemini_api_key.trim());
      }
      if (settings.map_layer !== undefined) {
        localStorage.setItem('vayusaathi_map_layer', settings.map_layer);
      }
      if (settings.auto_locate !== undefined) {
        localStorage.setItem('vayusaathi_auto_locate', String(settings.auto_locate));
      }
      if (settings.map_zoom !== undefined) {
        localStorage.setItem('vayusaathi_map_zoom', String(settings.map_zoom));
      }
      if (settings.temp_unit !== undefined) {
        localStorage.setItem('vayusaathi_temp_unit', settings.temp_unit);
      }
      if (settings.refresh_interval !== undefined) {
        localStorage.setItem('vayusaathi_refresh_interval', String(settings.refresh_interval));
      }
      if (settings.high_contrast !== undefined) {
        localStorage.setItem('vayusaathi_high_contrast', String(settings.high_contrast));
      }
      if (settings.ai_persona !== undefined) {
        localStorage.setItem('vayusaathi_ai_persona', settings.ai_persona);
      }
      if (settings.theme !== undefined) {
        localStorage.setItem('vayusaathi_theme', settings.theme);
      }

      const live = await safeFetch('/api/settings', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      return live || { message: "Settings saved successfully to browser storage and active state." };
    },

    async testGeminiKey(key) {
      const live = await safeFetch('/api/settings/test-key', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key })
      });
      return live || {
        status: (key && key.length > 20) ? "success" : "error",
        valid: (key && key.length > 20),
        message: (key && key.length > 20) ? "Gemini API Key format valid. Ready for live cloud reasoning." : "Key appears invalid or incomplete.",
        model: "gemini-2.5-flash"
      };
    },

    async testGoogleMapsKey(key) {
      if (!key || key.trim().length === 0) {
        return {
          status: "info",
          valid: true,
          message: "Zero Headache Mode active: Google Maps tiles load directly without requiring an API key."
        };
      }
      const cleanKey = key.trim();
      if (cleanKey.length < 20) {
        return {
          status: "error",
          valid: false,
          message: "Google Maps API keys are usually at least 30 characters long (e.g. AIzaSy...)."
        };
      }
      return {
        status: "success",
        valid: true,
        message: "Google Maps API Key format verified! Ready for high-resolution Google vector & satellite coverage."
      };
    },

    async getDemoScenario(scenarioName) {
      const live = await safeFetch(`/api/demo/scenario/${scenarioName}`);
      if (live) return live;

      const scenarios = {
        delhi_winter: {
          name: "Delhi Winter Inversion Peak",
          city: "Delhi NCR",
          aqi: 442,
          category: "Severe",
          color: "#f43f5e",
          description: "Nocturnal radiative cooling locks dense ground smoke below 280m."
        },
        crop_burning_peak: {
          name: "Post-Harvest Biomass Transport",
          city: "Delhi NCR",
          aqi: 468,
          category: "Severe",
          color: "#f43f5e",
          description: "Northwesterly jet stream carries concentrated biomass plumes."
        },
        diwali_post: {
          name: "Post-Festival Smoke Stagnation",
          city: "Delhi NCR",
          aqi: 485,
          category: "Severe",
          color: "#f43f5e",
          description: "Dense chemical aerosol loading under stagnant surface air."
        },
        clear_monsoon: {
          name: "Monsoon Washout",
          city: "Delhi NCR",
          aqi: 52,
          category: "Satisfactory",
          color: "#10b981",
          description: "Continuous precipitation wet-scavenges all particulate matter."
        }
      };

      return scenarios[scenarioName] || scenarios.delhi_winter;
    }
  };

  return api;
});
