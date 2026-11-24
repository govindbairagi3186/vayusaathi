"""
HawaWise AI - Generative AI Service
Interfaces with Google Gemini API via official google-genai SDK.
Provides context-aware conversational assistant, daily routine generator,
family protection action planner, and impact explanation engine.
Gracefully falls back to high-fidelity CPCB/WHO environmental expert logic
when API key is absent or offline, clearly labeling the provider.
"""

import os
import json
from typing import Dict, Any, List, Optional
from backend.database import get_setting

# Try loading google-genai
try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

def get_api_key() -> Optional[str]:
    """Retrieve Gemini API key from environment variable or database settings."""
    env_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if env_key and len(env_key.strip()) > 10:
        return env_key.strip()
    db_key = get_setting("gemini_api_key")
    if db_key and len(db_key.strip()) > 10:
        return db_key.strip()
    return None

def get_genai_client() -> Optional[Any]:
    """Create authenticated GenAI client if key is available."""
    api_key = get_api_key()
    if not api_key or not GENAI_AVAILABLE:
        return None
    try:
        return genai.Client(api_key=api_key)
    except Exception:
        return None

SYSTEM_PROMPT = """You are VayuSaathi, an expert environmental scientist, public health engineer, and urban sustainability companion.
Your mission is to translate complex winter smog, urban air quality metrics (CPCB Indian NAQI and WHO benchmarks), and lifestyle dynamics into practical, actionable, personalized daily routines and protective decisions for families, students, professionals, commuters, and communities.

Adhere strictly to these principles:
1. Translate raw AQI/PM2.5 into human terms: e.g. explain how early morning winter thermal inversions trap toxic particulates near ground level between 6:00 AM - 9:00 AM.
2. Provide science-backed Indoor Air Quality (IAQ) facts: Clarify that indoor plants alone CANNOT filter out hazardous winter PM2.5 smog; seal gaps and use True HEPA (H13) air purifiers and clean ventilation timing.
3. Every recommendation must clearly detail:
   - Action: The specific behavior.
   - Why: Scientific & physiological rationale.
   - Environmental Benefit: Quantified emissions avoided where known (e.g., Delhi Metro saves ~125g CO2/km vs single-occupancy petrol car).
   - Personal Benefit: Reduced lung particulate deposition, improved sleep, energy savings.
   - Confidence / Limitations: Clearly note modeled estimates vs measured readings.
4. Keep tone compassionate, empowering, practical, and non-alarmist. Include a non-medical disclaimer when health is mentioned.
"""

async def generate_chat_response(
    messages: List[Dict[str, str]],
    context: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Generate conversational AI response using Gemini API or expert environmental engine.
    """
    client = get_genai_client()
    current_aqi = context.get("aqi", 350)
    category = context.get("category", "Very Poor")
    city = context.get("city", "Delhi NCR")
    pm2_5 = context.get("pm2_5", 180.0)
    temp = context.get("temp", 16.0)
    humidity = context.get("humidity", 78)
    inversion = context.get("temperature_inversion", True)

    profile = context.get("profile", {})
    kids = profile.get("children_count", 1)
    seniors = profile.get("seniors_count", 1)
    asthma = profile.get("has_asthma_respiratory", 0)
    commute = profile.get("commute_mode", "two_wheeler")

    context_summary = f"""
[Current Live Environmental Context]
City: {city}
Current Indian AQI: {current_aqi} ({category})
PM2.5: {pm2_5} µg/m³ (CPCB 24h safe standard is 60 µg/m³)
Ambient Temp: {temp}°C, Humidity: {humidity}%
Winter Temperature Inversion: {"ACTIVE (trapping pollutants in shallow surface boundary layer)" if inversion else "Normal dispersion"}

[User Household Context]
Household members: {profile.get('household_size', 4)} (Children under 12: {kids}, Seniors over 60: {seniors})
Respiratory / Asthma vulnerability: {"Yes (High Sensitivity)" if asthma else "None reported"}
Primary Commuting Mode: {commute}
Home Ventilation Condition: {profile.get('home_ventilation', 'split_ac_windows')}
Air Purifier in Home: {"Yes" if profile.get('has_air_purifier') else "No"}
"""
    location_briefing = context.get("location_briefing")
    if location_briefing:
        context_summary += f"\n[GPS Air-Quality Briefing Details]\n{json.dumps(location_briefing, ensure_ascii=False)}\n"

    user_query = messages[-1]["content"] if messages else "How can I protect my family today?"

    if client:
        try:
            # Build conversation prompt
            conversation_history = "\n".join([f"{m['role'].capitalize()}: {m['content']}" for m in messages[-4:]])
            full_prompt = f"{SYSTEM_PROMPT}\n\n{context_summary}\n\nConversation So Far:\n{conversation_history}\n\nAssistant:"

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=full_prompt,
            )
            return {
                "reply": response.text,
                "ai_provider": "google_gemini_api",
                "model_name": "gemini-2.5-flash",
                "is_live_ai": True,
                "context_used": {
                    "city": city,
                    "aqi": current_aqi,
                    "category": category,
                    "pm2_5": pm2_5
                }
            }
        except Exception as e:
            # Fall through to expert fallback
            pass

    # Expert Environmental Knowledge Fallback Engine
    # Generates rich, environmentally accurate responses mapped to CPCB guidelines
    fallback_reply = generate_expert_reply(
        user_query, city, current_aqi, category, pm2_5, kids, seniors,
        asthma, commute, inversion, location_briefing
    )
    
    return {
        "reply": fallback_reply,
        "ai_provider": "offline_structured_expert_engine",
        "model_name": "cpcb-who-environmental-expert-v1",
        "is_live_ai": False,
        "note": "Generated via HawaWise Environmental Intelligence Engine. Configure GEMINI_API_KEY in Settings or .env for live Gemini 2.5 Flash cloud generation.",
        "context_used": {
            "city": city,
            "aqi": current_aqi,
            "category": category,
            "pm2_5": pm2_5
        }
    }

def generate_expert_reply(
    query: str,
    city: str,
    aqi: int,
    category: str,
    pm2_5: float,
    kids: int,
    seniors: int,
    asthma: bool,
    commute: str,
    inversion: bool,
    location_briefing: Optional[Dict[str, Any]] = None
) -> str:
    """Generate high-fidelity, science-backed guidance when cloud LLM is unconfigured."""
    q_lower = query.lower()

    if location_briefing:
        aqi = int(location_briefing.get("aqi", aqi))
        category = location_briefing.get("category", category)
        location = location_briefing.get("location", city)
        pollutants = location_briefing.get("pollutants", {})
        weather = location_briefing.get("weather", {})
        data_source = location_briefing.get("data_source", "Air-quality service")
        accuracy = location_briefing.get("accuracy", "not reported")
        updated_at = location_briefing.get("updated_at", "time not reported")
        dominant = location_briefing.get("dominant_pollutant", "not identified")
        advice = (
            "Avoid strenuous outdoor activity. Keep windows closed during high-pollution periods and use a well-fitted N95/FFP2 respirator if you must go out."
            if aqi > 300 else
            "Limit prolonged outdoor exertion and take extra care if you are in a sensitive group."
            if aqi > 200 else
            "Most people can continue usual activities; sensitive people should reduce prolonged exertion if they notice symptoms."
            if aqi > 100 else
            "Air quality is comparatively cleaner; check local conditions before strenuous outdoor activity."
        )
        pollutant_labels = {
            "pm2_5": "PM2.5",
            "pm10": "PM10",
            "no2": "NO2",
            "so2": "SO2",
            "co": "CO",
            "o3": "O3",
            "nh3": "NH3",
        }
        pollutant_lines = "\n".join(
            f"- **{pollutant_labels.get(name, name.upper())}:** {item.get('value', 'unavailable')} {item.get('unit', '')}"
            for name, item in pollutants.items()
        ) or "- Detailed pollutant readings are unavailable."
        weather_summary = (
            f"{weather.get('temperature', 'unavailable')}°C, "
            f"{weather.get('humidity', 'unavailable')}% humidity, "
            f"wind {weather.get('wind_speed', 'unavailable')} km/h, "
            f"inversion {'detected' if weather.get('temperature_inversion_detected') else 'not detected'}"
        )
        return f"""### GPS Air-Quality Briefing: {location}

**AQI: {aqi} ({category})**  
The highest reported pollutant is **{dominant}**.

**Weather:** {weather_summary}.

**Pollutant readings**
{pollutant_lines}

**What to do:** {advice}

**Data quality:** {data_source}, updated {updated_at}. Browser location accuracy is {accuracy}. This is a coordinate-based estimate and may differ from a nearby CPCB monitoring station; it is not a medical assessment."""

    if any(k in q_lower for k in ["cycling", "exercise", "jog", "workout", "run"]):
        if aqi > 200:
            return f"""### ⚠️ Outdoor Exercise Advisory for {city} (AQI: {aqi} - {category})

**Direct Assessment:** **Outdoor cycling or strenuous running is NOT advisable today.**

**Scientific Rationale:**
- During heavy aerobic respiration, minute ventilation increases from ~6 L/min at rest to **40–80 L/min**.
- Deep mouth breathing bypasses natural nasal filtration, delivering fine PM2.5 particulates deep into pulmonary alveoli and systemic circulation.
- With current PM2.5 at **{pm2_5} µg/m³** (nearly **{pm2_5/60:.1f}x the CPCB 24-hour safe threshold**), an hour-long outdoor jog would deposit an estimated 150–220 µg of particulate mass directly into your airways.

**Recommended Safe Alternatives:**
1. **Indoor Aerobic Routine:** Switch to indoor bodyweight circuits, yoga, or stationary resistance workouts in a closed room with air purification.
2. **Timing Window:** If you must venture out, wait until **1:30 PM – 3:30 PM**, when daytime solar heating temporarily breaks the surface thermal inversion and dilutes particulate concentrations.
3. **Protection:** Wear a certified, well-fitted **N95/FFP2 respirator** (cloth masks provide <20% PM2.5 filtration).

*Note: This advice is based on CPCB health criteria and WHO particulate guidelines; consult your physician for clinical conditions.*"""

    elif any(k in q_lower for k in ["indoor", "room", "purifier", "plant", "ventilat", "home"]):
        return f"""### 🏠 Indoor Air Quality Strategy for {city} (AQI: {aqi} - {category})

**Key Challenge:** In winter, indoor air frequently becomes 2x to 5x more hazardous than outdoor air due to trapped indoor combustion combined with outdoor smog seepage.

**1. Strategic Ventilation Windows:**
- **Keep windows tightly shut:** Between **6:00 AM – 10:00 AM** and **7:00 PM – 11:00 PM**, when nocturnal radiation inversions trap heavy particulate smog near ground level.
- **Micro-Ventilation:** If indoor CO2 feels stuffy, crack a window on the leeward (non-windward) side for **10–15 minutes between 1:00 PM – 3:00 PM**, then reseal and turn purifiers to max speed.

**2. Eliminating Indoor Particle Sources:**
- **Zero Open Combustion:** Completely avoid burning incense sticks (*agarbatti*), *dhoop*, mosquito coils, or decorative candles. A single burning incense stick emits PM2.5 concentrations exceeding 400 µg/m³ in an enclosed bedroom!
- **Active Kitchen Ventilation:** Always switch on the exhaust hood or chimney 2 minutes *before* heating cooking oil and keep lids closed.

**3. Air Purifier Optimization & Sizing:**
- Ensure purifiers use **True HEPA (H13)** filters capable of capturing 99.97% of particles ≥ 0.3 microns.
- **Myth Buster:** *Houseplants alone do NOT clean winter smog.* NASA studies were conducted in tiny sealed chambers against VOCs; plants have virtually zero filtration capacity for rapid ambient PM2.5 particulates.

**4. Vulnerable Members Protection:**
{"- **Special Alert:** Keep your child and senior members in the designated clean-air bedroom where purifier operates 24/7." if (kids > 0 or seniors > 0) else ""}"""

    elif any(k in q_lower for k in ["commute", "travel", "metro", "car", "bus", "transport"]):
        return f"""### 🚇 Sustainable & Low-Exposure Commute Analysis for {city}

**Current Assessment for your {commute.replace('_', ' ').title()} commute:**

**1. Exposure Comparison:**
- **Two-Wheeler / Walking:** Direct open-air exposure. In current {category} air ({pm2_5} µg/m³ PM2.5), a 30-minute two-wheeler commute exposes riders to severe particulate peaks. Wear a snugly sealed **N95 respirator** at all times.
- **Air-Conditioned Metro / Electric Train:** **Best Option.** Delhi Metro underground stations and rolling stock feature multi-stage filtration, reducing commuter particulate exposure by **40% to 65%** compared to street level.
- **Private Car:** Keep AC set strictly to **Internal Recirculation Mode** to avoid pulling raw tailpipe exhaust into the passenger cabin.

**2. Quantified Environmental Savings:**
- Shifting a 15 km daily round-trip commute from a petrol car to electric Metro rail:
  - **Avoids ~2.1 kg CO2 daily** (~54 kg CO2 per month).
  - **Avoids ~0.65 g of direct street-level PM2.5 emissions**.
- Every commuter switching to mass transit eases the vehicular congestion idle time that produces 3x more toxic CO and NOx emissions during cold starts."""

    elif any(k in q_lower for k in ["routine", "schedule", "daily plan"]):
        return f"""### 📅 AI-Engineered Clean-Air Daily Routine ({city} | AQI: {aqi})

**Morning (06:00 – 11:00) | Peak Inversion Phase**
- **06:30 AM:** Windows sealed. Purifiers set to medium. Morning stretches or yoga indoors.
- **07:30 AM:** Breakfast with covered cooking; run kitchen chimney on high.
- **08:30 AM Commute:** Avoid open two-wheeler travel if possible; take electric Metro rail or carpool. Wear N95 mask for any transit walking segments.

**Afternoon (11:00 – 16:00) | Smog Dilution Window**
- **01:30 PM:** Optimum window for brief outdoor errands or short 15-minute cross-ventilation if indoor air is stale.
- **02:30 PM:** Opt for plant-forward meal; turn off unused workstation appliances (cuts peak load power plant emissions).

**Evening & Night (16:00 – 22:30) | Re-accumulation Phase**
- **05:30 PM Commute:** Reseal car windows; metro commute.
- **07:00 PM:** Clean entrance doormats; wet-mop floors with damp microfiber cloth (never dry sweep, which resuspends settled PM10 dust).
- **09:30 PM:** Continuous HEPA purifier running in bedrooms on sleep mode. Keep vulnerable children/seniors in filtered bedrooms."""

    else:
        return f"""### 🌿 VayuSaathi Guidance for {city} (AQI: {aqi} - {category})

**Environmental Snapshot:**
- **Current Air Quality:** Indian AQI is **{aqi}**, classified as **{category}**.
- **Primary Driver:** PM2.5 concentration is **{pm2_5} µg/m³**, driven by winter boundary layer trapping and calm winds.
{f"- **Special Care Flag:** Your household includes {kids} child(ren) and {seniors} senior(s). Children inhale 50% more air per pound of body weight than adults, making proactive indoor shielding critical." if (kids > 0 or seniors > 0) else ""}

**Top 3 Immediate Recommendations:**
1. **Protect Indoors:** Keep doors and windows tightly closed during early mornings and late evenings. Use wet-mopping rather than dry brooms to prevent particulate resuspension.
2. **Low-Emission Commuting:** Shift routine trips to electric rail or buses. Avoid single-occupant car trips which exacerbate localized street-level toxic NO2 and PM2.5.
3. **Personal Shielding:** When stepping outdoors, wear an **N95/FFP2 respirator**. Surgical and cloth masks do not create an airtight seal against sub-micron particles.

Feel free to ask me for custom routines, commuting footprint comparisons, or school air safety guidelines!"""

async def generate_smart_routine(
    city: str,
    aqi_data: Dict[str, Any],
    profile: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Generate structured morning, afternoon, and evening routine
    with quantified impact estimates and rationale.
    """
    client = get_genai_client()
    aqi = aqi_data.get("aqi", 350)
    category = aqi_data.get("category", "Very Poor")
    pm2_5 = aqi_data.get("pollutants", {}).get("pm2_5", {}).get("value", 180.0)

    prompt = f"""Generate a structured, science-backed 3-part daily routine (Morning, Afternoon, Evening) for a resident in {city} under Indian AQI {aqi} ({category}, PM2.5 {pm2_5} µg/m³).
Household: {profile.get('household_size', 4)} members, {profile.get('children_count', 1)} children, {profile.get('seniors_count', 1)} seniors, primary commute {profile.get('commute_mode', 'two_wheeler')}.

Return strictly a valid JSON object matching this schema:
{{
  "title": "Clean-Air Daily Action Routine",
  "aqi_context": "AQI {aqi} ({category})",
  "morning": [
    {{"time": "06:30 AM", "action": "Indoor Yoga / Light Stretching", "why": "Avoid outdoor running during severe morning inversion smog peak.", "env_benefit": "Zero outdoor emissions", "personal_benefit": "Protects deep lung alveoli from heavy PM2.5 deposition", "completed": false}}
  ],
  "afternoon": [
    {{"time": "01:30 PM", "action": "Brief Solar Airing Window", "why": "Daytime solar heating dilutes surface particulates, allowing 10-min freshening.", "env_benefit": "Reduces indoor CO2 accumulation naturally", "personal_benefit": "Prevents headache and midday lethargy", "completed": false}}
  ],
  "evening": [
    {{"time": "07:00 PM", "action": "Wet-Mop Living Areas", "why": "Damp microfiber traps settled dust without resuspending particulate matter into breathing zone.", "env_benefit": "Zero chemical aerosol emissions", "personal_benefit": "Cuts sleeping particulate exposure by up to 35%", "completed": false}}
  ],
  "total_co2_avoided_kg": 2.4,
  "total_pm_avoided_g": 0.85
}}
"""

    if client:
        try:
            resp = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            data = json.loads(resp.text)
            data["ai_provider"] = "google_gemini_api"
            return data
        except Exception:
            pass

    # Expert Local Engine Routine
    is_severe = aqi > 300
    return {
        "title": f"Tailored Winter Smog Defense Routine ({category})",
        "aqi_context": f"Indian AQI {aqi} ({category}) | PM2.5: {pm2_5} µg/m³",
        "ai_provider": "offline_structured_expert_engine",
        "note": "Constructed using CPCB Diurnal Smog Profiles & National Clean Air Programme (NCAP) recommendations.",
        "morning": [
            {
                "time": "06:30 AM",
                "action": "Indoor Exercise & Deep Breathing in Purified Space",
                "why": "Nocturnal boundary layer thermal inversion traps heavy particulates at breathing level until 09:30 AM.",
                "env_benefit": "Avoids cold vehicle start emissions during early hours.",
                "personal_benefit": "Eliminates ~180 µg of toxic heavy metal particle inhalation compared to outdoor running.",
                "completed": False
            },
            {
                "time": "07:30 AM",
                "action": "Lid-Covered Induction Cooking with Range Hood Active",
                "why": "Unvented shallow frying generates indoor PM2.5 exceeding 350 µg/m³ within 15 minutes.",
                "env_benefit": "Electric induction reduces direct household gas combustion.",
                "personal_benefit": "Keeps living area particulate levels within safe baseline.",
                "completed": False
            },
            {
                "time": "08:15 AM",
                "action": f"Shift Commute to Electric Metro Rail ({profile.get('commute_mode', 'metro').title()} Alternative)",
                "why": "Street-level vehicular corridors produce acute toxic nitrogen dioxide and ultra-fine carbon black.",
                "env_benefit": "Saves ~1.8 kg CO2 and 0.52g PM2.5 per 15 km round trip.",
                "personal_benefit": "Air-filtered metro trains cut commuter particulate exposure by ~50%.",
                "completed": False
            }
        ],
        "afternoon": [
            {
                "time": "01:15 PM",
                "action": "15-Minute Controlled Leeward Window Freshening",
                "why": "Midday solar insolation creates thermal updrafts that temporarily disperse ground-level smog.",
                "env_benefit": "Naturally lowers indoor CO2 below 800 ppm without power-heavy auxiliary ventilation.",
                "personal_benefit": "Enhances cognitive alertness and alleviates afternoon fatigue.",
                "completed": False
            },
            {
                "time": "02:30 PM",
                "action": "Consolidate Local Errand Runs / Remote Meetings",
                "why": "Eliminates non-essential short engine-cold trips that produce 3x higher emissions per km.",
                "env_benefit": "Avoids 0.8 kg CO2 and unnecessary fuel burn.",
                "personal_benefit": "Reduces fatigue and stress from congested smoggy traffic corridors.",
                "completed": False
            }
        ],
        "evening": [
            {
                "time": "06:30 PM",
                "action": "Reseal Entry Doors & Damp Microfiber Floor Mopping",
                "why": "Evening temperature drops trigger secondary smog inversion; dry brooms kick up settled PM10 dust.",
                "env_benefit": "Eliminates aerosolized chemical disinfectant sprays.",
                "personal_benefit": "Prevents nighttime asthma exacerbations and allergen sensitization.",
                "completed": False
            },
            {
                "time": "09:00 PM",
                "action": "Bedroom HEPA Purifier Sleep Mode Activation & Door Closure",
                "why": "Humans spend ~8 continuous hours in one room; maintaining <25 µg/m³ PM2.5 during sleep aids lung recovery.",
                "env_benefit": "Modern brushless DC motor purifiers draw only 18W on sleep mode.",
                "personal_benefit": "Improves REM sleep architecture and decreases systemic vascular inflammation.",
                "completed": False
            }
        ],
        "total_co2_avoided_kg": 2.6,
        "total_pm_avoided_g": 0.94
    }

async def generate_family_plan(
    profile: Dict[str, Any],
    aqi_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Generate targeted family protection action plan.
    """
    client = get_genai_client()
    aqi = aqi_data.get("aqi", 350)
    category = aqi_data.get("category", "Very Poor")
    kids = profile.get("children_count", 1)
    seniors = profile.get("seniors_count", 1)
    asthma = profile.get("has_asthma_respiratory", 0)

    prompt = f"""Generate a personalized Family Pollution Action Plan for Indian AQI {aqi} ({category}).
Family profile: {kids} children under 12, {seniors} seniors over 60, asthma sensitivity: {asthma}.
Include:
1. Shielding strategies for children and seniors.
2. Home clean-zone setup.
3. School and workplace travel protocol.
4. Non-medical disclaimer.
Return JSON."""

    if client:
        try:
            resp = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
            return json.loads(resp.text)
        except Exception:
            pass

    # Expert Engine Fallback
    return {
        "title": f"Family Protection Plan ({category} Smog Event)",
        "ai_provider": "offline_structured_expert_engine",
        "household_summary": {
            "family_size": profile.get("household_size", 4),
            "children": kids,
            "seniors": seniors,
            "respiratory_flag": bool(asthma)
        },
        "critical_advisories": [
            {
                "target": "Children (under 12)",
                "risk": "Faster breathing rate and developing lung airways make children especially susceptible to bronchial hyperresponsiveness.",
                "action": "Cancel outdoor sports and recess when AQI > 250. Ensure children wear well-fitted child-sized N95 masks during school commute."
            },
            {
                "target": "Older Adults (over 60)",
                "risk": "Particulate exposure elevates systemic arterial pressure and increases acute cardiovascular episode risk.",
                "action": "Remain in designated clean-air bedroom during morning smog hours (06:00 - 10:00 AM). Maintain hydration and keep prescribed inhalers accessible."
            },
            {
                "target": "Home Clean-Zone Protocol",
                "risk": "Infiltration of ambient PM2.5 through balcony cracks and exhaust vents.",
                "action": "Create one sealed 'Safe Haven' bedroom with continuous True HEPA filtration, weather-stripped door seals, and strictly zero indoor combustion."
            }
        ],
        "daily_checklist": [
            {"item": "Check morning AQI & temperature inversion status before sending kids to school", "done": False},
            {"item": "Verify child has certified N95 mask packed in backpack", "done": False},
            {"item": "Ensure car ventilation is set to RECIRCULATE before driving", "done": False},
            {"item": "Inspect HEPA purifier pre-filters for dust clogging", "done": False},
            {"item": "Keep windows sealed during early morning peak smog hours", "done": False}
        ],
        "disclaimer": "Important: VayuSaathi provides environmental and behavioral protective guidance based on CPCB and WHO scientific frameworks. This does not constitute clinical medical diagnosis or treatment. Consult a licensed physician for respiratory conditions."
    }
