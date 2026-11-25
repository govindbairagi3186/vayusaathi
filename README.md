# VayuSaathi – Urban Air Quality, Google Maps Station Network & Clean-Air Companion

**GenAI-powered and CPCB-calibrated winter smog & urban air pollution assistant for families, commuters, and communities.**

**Live Website:** [https://govindbairagi3186.github.io/vayusaathi/](https://govindbairagi3186.github.io/vayusaathi/)

---

## Key Capabilities

1. **Overview & CPCB NAQI Engine**
   - Sub-index calculation across **PM2.5, PM10, NO2, SO2, CO, O3, and NH3** using Indian Central Pollution Control Board (CPCB) linear breakpoints.
   - 24-hour diurnal curve visualizing thermal inversion buildup (`06:00–09:00` & `20:00–23:00`) vs afternoon dispersion (`13:00–15:30`).
   - Transparent source labeling distinguishing live Open-Meteo API estimates from calibrated baseline station profiles.

2. **Google Maps Station Network & Live Geolocation**
   - **Zero-Headache Google Maps Engine**: Supports **Google Roadmap, Satellite, Hybrid, Terrain, and Live Traffic** views right out of the box without requiring mandatory billing or API keys (with optional custom Google Cloud key support in Settings).
   - **30 National CPCB Corridors**: Instant search, severity filtering, proximity sorting (Haversine distance), coordinate inspector pins, fullscreen map mode, and continuous live GPS watch tracking.

3. **Household Shielding, Schedules & Clean-Air Assistant**
   - **Conversational Assistant**: Google Gemini 2.5 Flash integration with offline fallback rule engine tailored to **Scientist**, **Commuter**, or **Pediatric** personas.
   - **Vulnerable Cohorts & Daily Routine**: Age-calibrated guidance for children, seniors, and asthma sensitivities alongside a smog-synchronized daily schedule.
   - **Indoor Air Quality (IAQ)**: Diurnal ventilation windows, CADR room purifier sizing calculator, indoor combustion comparisons, and myth-busters.
   - **Transit & Impact Tracker**: Emissions comparison (CEA/ARAI/CPCB factors), sustainability engagement score, weekly bar charts, and anonymous neighborhood incident reporting.

4. **Security, Accessibility & Standalone Resilience**
   - **100% Standalone Browser Execution**: Opens directly via `frontend/index.html` with zero console errors when offline, and automatically connects to FastAPI if running locally.
   - **XSS & Input Hardening**: Strict HTML entity escaping across user chats, incident feeds, and activity logs; Pydantic input validation and HTTP security headers on backend routes.
   - **Accessibility**: Keyboard-focusable cards and dialogs, ARIA live status notifications, `prefers-reduced-motion` support, Light/Dark themes, and High-Contrast AQI mode.

---

## Project Structure

```text
VayuSaathi/
├── backend/
│   ├── main.py                  # FastAPI server, Pydantic validation & static serving
│   ├── database.py              # SQLite persistence & managed session helper
│   ├── air_quality_service.py   # Open-Meteo sync & CPCB NAQI breakpoints engine
│   ├── gemini_service.py        # Google Gemini 2.5 Flash & CPCB expert fallback
│   └── impact_calculator.py     # CEA/ARAI emission factors & sustainability metrics
├── frontend/
│   ├── index.html               # Semantic single-page application shell
│   ├── css/style.css            # Restrained theme tokens, Google Maps overlays & A11y rules
│   └── js/
│       ├── api.js               # Dual-mode REST + offline CPCB client
│       └── app.js               # Views, Google Maps controller, charts, GPS & Settings Hub
├── run_server.py                # FastAPI / Uvicorn entrypoint (port 8000)
├── start.bat                    # Windows one-click launcher (auto-detects backend or opens browser)
├── test_suite.py                # Backend contract verification suite
└── README.md                    # Documentation
```

---

## Quick Start

### Option 1: Standalone Browser Mode (No Setup Required)
Open [frontend/index.html](frontend/index.html) directly in Chrome, Edge, or Firefox (or double-click `start.bat`). All maps, CPCB dashboards, schedules, IAQ sizing tools, and local storage features operate immediately.

### Option 2: Full-Stack FastAPI Server Mode (Requires Python 3.10+)
1. Optionally set `GEMINI_API_KEY` / `GOOGLE_MAPS_API_KEY` as environment variables or configure keys inside **Settings & Keys** in the UI.
2. Start the server:
   ```bash
   python run_server.py
   ```
3. Visit **`http://127.0.0.1:8000`**.
