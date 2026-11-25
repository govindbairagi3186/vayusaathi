# VayuSaathi – Your AI Companion for Cleaner Air 🌿
**GenAI-Powered Winter Smog & Urban Air Pollution Assistant for Families and Communities**

[![Python](https://img.shields.io/badge/Python-3.14-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![Google Gemini](https://img.shields.io/badge/GenAI-Google%20Gemini%202.5%20Flash-4285F4.svg)](https://ai.google.dev/)
[![CPCB NAQI](https://img.shields.io/badge/Standard-CPCB%20Indian%20NAQI-green.svg)](https://cpcb.nic.in/)
[![1080p MP4](https://img.shields.io/badge/Video%20Demo-1080p%20Rendered-red.svg)](video-submission/)

---

## 🌟 Executive Summary & Problem Statement

Every winter across northern India (the Indo-Gangetic Plain) and major urban basins, dense toxic smog blankets metropolitan areas. Stagnant cold air combined with shallow nocturnal radiation inversions traps vehicular emissions, industrial smoke, and agricultural residue at ground level.

Standard air quality apps display raw numerical AQI numbers (e.g., *AQI 420 - Severe*), which trigger anxiety without providing actionable decisions:
- *Can our children attend morning sports or outdoor recess?*
- *Is morning cycling or jogging safe under current conditions?*
- *How can families protect infants and asthmatic seniors indoors?*
- *When is the safest time of day to ventilate the home?*
- *Do houseplants alone filter toxic winter PM2.5? (Science says NO).*
- *Which commuting and household choices actually cut emissions?*

**VayuSaathi** bridges this gap. It translates complex atmospheric metrics into personalized, science-backed daily routines, household shielding plans, and verified low-emission lifestyle alternatives.

---

## 🏆 Key Features & System Modules

### 1. Location-Based Air Quality & Inversion Dashboard
- **Indian National AQI (NAQI):** Calculates sub-indices for PM2.5, PM10, NO2, SO2, CO, and O3 following official Central Pollution Control Board (CPCB) linear interpolation breakpoints.
- **GPS-Based Local Air Quality:** Requests a fresh high-accuracy browser location, waits up to 20 seconds for a better fix, and rejects fixes worse than 10 km. Displays the browser-reported accuracy and an AI-generated briefing for the returned AQI and pollutant readings. Location-based Open-Meteo values are model estimates, not measurements from a sensor at the user's exact coordinates.
- **Meteorological & Inversion Detection:** Real-time temperature, humidity, wind velocity, and automated boundary-layer thermal inversion alerts.
- **24-Hour Diurnal Trend Curves:** Visualizes peak smog accumulation periods (06:00–09:00 & 20:00–23:00) vs solar dilution windows (13:00–15:30).
- **Data Transparency Guarantee:** Clearly distinguishes live Open-Meteo API data from verified CPCB historical baseline demo data. Never fabricates live readings.

### 2. Conversational GenAI Assistant
- **Google Gemini 2.5 Flash Integration:** Powered by the official `google-genai` SDK with secure backend proxying.
- **Context-Aware Prompt Engineering:** Injects live city, AQI, particulate concentrations, inversion alerts, and household vulnerability parameters into every inference turn.
- **Physiological & Environmental "Why":** Explains the scientific rationale behind each suggestion (e.g., how high minute-ventilation during aerobic jogging deposits fine particles directly into pulmonary alveoli).
- **Graceful Offline Fallback:** When no API key is configured or network is sandboxed, activates the built-in CPCB & WHO Environmental Expert Knowledge Engine.

### 3. Personalized Family Protection Mode
- **Household Calibration:** Collects family size, counts of children under 12, seniors over 60, and respiratory vulnerability (asthma, bronchitis).
- **Targeted Defense Protocols:** Custom shielding strategies for children, seniors, and home clean zones.
- **Safe-Haven Bedroom Strategy:** Guidelines for creating a sealed clean room with True HEPA filtration.
- **Daily Family Checklist:** Interactive tracking of mask readiness, window seals, and pre-filter maintenance.

### 4. Smart Daily Routine Planner
- **3-Part Smog-Synchronized Timeline:** Morning, Afternoon, and Evening schedules designed around diurnal particulate curves.
- **Direct Impact Metrics:** Shows avoided personal exposure and estimated emissions avoided per routine item.
- **Interactive Completion & Persistence:** Mark habits completed and save routines to SQLite database.

### 5. Indoor Air Quality (IAQ) Intelligence
- **Diurnal Ventilation Window Matrix:** Highlights dangerous early morning inversion hours vs safe midday solar freshening windows.
- **Indoor Combustion Hazards:** Quantifies particle spikes from incense sticks (*agarbatti*), deep frying, mosquito coils, and dry broom sweeping.
- **CADR Purifier Sizing Calculator:** Calculates required Clean Air Delivery Rate (m³/hr and CFM) to achieve 5 Air Changes per Hour (ACH) for any room dimensions.
- **Myth-Busters Section:** Scientifically debunks common myths, explicitly proving that houseplants alone cannot clean winter PM2.5 smog.

### 6. Low-Emission Lifestyle Alternatives Engine
- **Interactive Trip Slider:** Compares 7 transportation modes (Solo petrol car, diesel car, two-wheeler, 3-person carpool, CNG bus, electric Metro, walking).
- **Verified Emission Factors:** Derived from ARAI, CPCB, and Indian Central Electricity Authority (CEA Baseline Database v19).
- **Household & Community Practices:** Quantifies the massive impact of preventing open waste burning (1 kg waste avoided = 8.5g PM2.5 saved).

### 7. Community Clean Air Hub & Anonymous Reporting
- **Community Campaigns:** Clean School Corridors, Anti-Biomass Burning Vigil, and Friday Transit Challenges.
- **Anonymous Pollution Concern Reporting:** Allows citizens to report localized burning, construction dust, and vehicle idling hotspots without exposing private home addresses.
- **Community Action Checklist & Upvotes:** Upvote community concerns to accelerate municipal resolution.

### 8. Environmental Impact Tracker
- **Personal Sustainability Engagement Score (0–100):** A transparent behavioral engagement metric measuring habit frequency and eco-consistency.
- **Avoided Emission Metrics:** Total avoided CO2 (kg), direct PM2.5 prevented (g), car-km avoided, and annual tree absorption equivalents.
- **7-Day Bar Charts & Audit Trail:** Interactive weekly progress charts and recent activity log.

### 9. Smart Alerts Center
- Real-time and simulated warnings for inversion smog spikes, favorable airing windows, and community milestones.
- In-app simulator for testing and evaluation.

### 10. Judges' Demonstration Mode
- **1-Click Case Studies:** Instant pre-configured setups for:
  - *Delhi NCR Winter Smog Crisis* (AQI 386, Inversion, Child & Senior at home)
  - *Bengaluru Urban Plateau Study* (AQI 88, Metro commuter)
  - *Lahore Transboundary Smog Emergency* (AQI 468, Hazardous emergency)
- **In-App Video Demonstration Player:** Streams the rendered 1080p MP4 presentation video directly inside the browser.

---

## 🏗️ Technical Architecture

```
HAWAWASIAI/
│
├── backend/
│   ├── main.py                  # FastAPI server, endpoints, static & video mounting
│   ├── database.py              # SQLite schema, migrations, seed data, queries
│   ├── air_quality_service.py   # Open-Meteo live API, CPCB NAQI calculation, baseline cache
│   ├── gemini_service.py        # Google GenAI SDK integration & CPCB expert fallback
│   └── impact_calculator.py     # CEA/ARAI/CPCB emission factors & sustainability score
│
├── frontend/
│   ├── index.html               # Modern responsive SPA container
│   ├── css/
│   │   └── style.css            # Custom glassmorphism, animations, dark/light themes
│   ├── js/
│   │   ├── app.js               # Reactive router, views, interactive Chart.js, Leaflet
│   │   └── api.js               # REST client for backend endpoints
│   └── poster.jpg               # Video presentation thumbnail poster
│
├── video-submission/
│   ├── HawaWise_AI_Demo.mp4     # Mandatory 1080p MP4 demonstration video (rendered)
│   ├── storyboard.md            # Detailed scene-by-scene storyboard
│   ├── voiceover_script.md      # Professional narration script
│   ├── subtitles.srt            # Synchronized SubRip subtitles
│   ├── generate_video.py        # Automated video renderer (Pillow, SAPI, NumPy, FFmpeg)
│   ├── frames/                  # 1920x1080 slide artwork for all 8 scenes
│   └── audio/                   # Generated narration tracks & ambient music score
│
├── data/
│   └── hawawise.db              # SQLite persistence database
│
├── run_server.py                # Server launcher script
├── start.bat                    # Windows batch launcher
├── start.ps1                    # PowerShell launcher
├── .env.example                 # Environment configuration template
└── README.md                    # Project documentation
```

---

## 🚀 Quickstart & Installation

### Prerequisites
- Python 3.10+ (Tested on Python 3.14)
- Modern Web Browser (Chrome, Edge, Firefox, Safari)

### 1. Clone or Open Workspace
```bash
cd HAWAWASIAI
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Google Gemini API key if you want live cloud LLM inference:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If no API key is provided, the application runs fully functional using the built-in CPCB & WHO Environmental Expert Knowledge Engine).*

### 3. Start Application Server
```bash
python run_server.py
```
*(Or double click `start.bat` / run `powershell -File start.ps1`).*

### 4. Open in Browser
Visit: **[http://localhost:8000](http://localhost:8000)**

---


## 🧪 Testing & Verification Report

| Test Scenario | Module | Verified Behavior | Status |
| :--- | :--- | :--- | :--- |
| **Server Startup** | FastAPI Backend | All 34 REST routes loaded cleanly on port 8000 | ✅ PASS |
| **Database Persistence** | SQLite Engine | 8 tables initialized, seed profiles, alerts & reports loaded | ✅ PASS |
| **Air Quality Feeds** | CPCB NAQI Engine | Sub-indices correctly calculated for PM2.5, PM10, NO2, SO2, CO, O3 | ✅ PASS |
| **Data Transparency** | Dashboard UI | Distinct labels for Live Open-Meteo vs CPCB Demo Baseline | ✅ PASS |
| **GenAI Conversational Engine** | Gemini Service | Context-aware responses with physiological & environmental rationale | ✅ PASS |
| **Daily Routine Planner** | Timeline Generator | Diurnal morning/afternoon/evening routine with checkmarks & impact | ✅ PASS |
| **Family Protection** | Profile Calibrator | Child & senior shielding with non-medical disclaimer | ✅ PASS |
| **IAQ Intelligence** | Sizing Calculator | CADR room sizing (5 ACH) & plant myth-busting verified | ✅ PASS |
| **Emissions Engine** | Alternatives Engine | Verified 88% CO2 cut for Metro vs petrol car (15 km) | ✅ PASS |
| **Community Hub** | Anonymous Reporting | Privacy-safe concern logging with upvotes & campaigns | ✅ PASS |
| **Video Production** | FFmpeg Renderer | 1080p MP4 generated with voiceover & ambient audio score | ✅ PASS |

---

## 📄 License & Attribution
Developed for the National Hackathon 2026.  
Environmental standards based on Central Pollution Control Board (CPCB) NAQI guidelines, WHO Global Air Quality Guidelines, and CEA CO2 Baseline Database for the Indian Power Sector.
