"""
VayuSaathi - Main FastAPI Application Server
Provides RESTful APIs for Air Quality, GenAI Assistant, Household Profiles,
Smart Routines, Indoor Air Intelligence, Sustainable Alternatives,
Community Hub, Impact Tracking, Alerts, and Demonstration Scenarios.
Serves frontend SPA static assets cleanly.
"""

import os
import json
from datetime import datetime
from typing import Dict, Any, List, Optional, Literal
from fastapi import FastAPI, HTTPException, Query, Body, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from backend.database import (
    init_db, db_session, get_connection, get_profile, update_profile,
    get_setting, set_setting
)
from backend.air_quality_service import fetch_air_quality, CITIES
from backend.gemini_service import (
    generate_chat_response, generate_smart_routine,
    generate_family_plan, get_api_key, get_genai_client
)
from backend.impact_calculator import (
    compare_transport_alternatives, get_impact_summary
)

# Initialize Database Schema & Seed Data
init_db()

app = FastAPI(
    title="VayuSaathi API",
    description="Urban Air Quality, Google Maps Spatial Monitoring & Personal Exposure Protection Companion",
    version="2.0.0"
)

# Permissive CORS for standalone local HTML/Live Server usage without exposing credentials
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Accept"],
)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """Attach standard baseline HTTP security headers to all API and static responses."""
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


# Validated Pydantic Request Models
class ChatRequest(BaseModel):
    messages: List[Dict[str, str]] = Field(default_factory=list, max_length=40)
    city: Optional[str] = Field(default="Delhi NCR", max_length=120)
    aqi: Optional[int] = Field(default=350, ge=0, le=1000)
    category: Optional[str] = Field(default="Very Poor", max_length=40)
    pm2_5: Optional[float] = Field(default=180.0, ge=0.0, le=2000.0)
    temperature_inversion: Optional[bool] = True
    ai_persona: Optional[Literal["scientist", "commuter", "pediatric"]] = "scientist"
    location_briefing: Optional[Dict[str, Any]] = None


class RoutineRequest(BaseModel):
    city: Optional[str] = Field(default="Delhi NCR", max_length=120)
    aqi: Optional[int] = Field(default=350, ge=0, le=1000)
    category: Optional[str] = Field(default="Very Poor", max_length=40)
    pm2_5: Optional[float] = Field(default=180.0, ge=0.0, le=2000.0)


class ProfileRequest(BaseModel):
    household_size: int = Field(default=4, ge=1, le=20)
    children_count: int = Field(default=1, ge=0, le=15)
    seniors_count: int = Field(default=1, ge=0, le=15)
    has_asthma_respiratory: int = Field(default=0, ge=0, le=1)
    commute_mode: str = Field(default="two_wheeler", max_length=50)
    daily_commute_km: float = Field(default=15.0, ge=0.0, le=250.0)
    home_ventilation: str = Field(default="split_ac_windows", max_length=60)
    has_air_purifier: int = Field(default=0, ge=0, le=1)
    school_office_hours: str = Field(default="8:30 AM - 5:30 PM", max_length=60)
    indoor_outdoor_pref: str = Field(default="mostly_indoor_smog_season", max_length=60)
    city: str = Field(default="Delhi NCR", max_length=120)


class ActionLogRequest(BaseModel):
    action_type: str = Field(..., min_length=1, max_length=60)
    category: str = Field(..., min_length=1, max_length=40)
    title: str = Field(..., min_length=1, max_length=140)
    description: Optional[str] = Field(default="", max_length=400)
    co2_saved_kg: float = Field(default=0.5, ge=0.0, le=500.0)
    pm_saved_g: float = Field(default=0.15, ge=0.0, le=5000.0)
    points: int = Field(default=15, ge=1, le=500)


class CommunityReportRequest(BaseModel):
    title: str = Field(..., min_length=2, max_length=140)
    category: str = Field(..., min_length=2, max_length=50)
    description: str = Field(..., min_length=4, max_length=600)
    location_name: str = Field(..., min_length=2, max_length=120)
    severity: Literal["low", "medium", "high", "critical"] = "medium"


class SettingsRequest(BaseModel):
    gemini_api_key: Optional[str] = Field(default=None, max_length=256)
    google_maps_api_key: Optional[str] = Field(default=None, max_length=256)
    theme: Optional[Literal["dark", "light"]] = "dark"
    demo_mode: Optional[bool] = False
    map_layer: Optional[str] = Field(default="google_streets", max_length=40)
    auto_locate: Optional[bool] = True
    temp_unit: Optional[Literal["C", "F"]] = "C"

# API Routes

@app.get("/api/health")
async def health_check():
    api_key = get_api_key()
    has_key = bool(api_key and len(api_key) > 8)
    return {
        "status": "online",
        "app_name": "VayuSaathi",
        "version": "1.0.0",
        "genai_configured": has_key,
        "genai_provider": "google_gemini_api" if has_key else "cpcb_expert_engine_fallback",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/cities")
async def get_supported_cities():
    result = []
    for city_key, data in CITIES.items():
        result.append({
            "key": city_key,
            "name": data["name"],
            "region": data["region"],
            "lat": data["lat"],
            "lon": data["lon"],
            "smog_profile": data["smog_profile"],
            "baseline_aqi": data["demo_baseline"]["aqi"],
            "baseline_category": data["demo_baseline"]["category"]
        })
    return {"cities": result}

@app.get("/api/air-quality")
async def get_air_quality(
    city: str = Query("Delhi NCR", description="City name"),
    lat: Optional[float] = Query(None, description="Custom latitude"),
    lon: Optional[float] = Query(None, description="Custom longitude")
):
    # FastAPI supplies Query objects only when the route function is invoked
    # directly (for example in verification/test code). Normalize those objects
    # so direct and HTTP calls follow the same data path.
    if hasattr(city, "default"):
        city = city.default
    if hasattr(lat, "default"):
        lat = lat.default
    if hasattr(lon, "default"):
        lon = lon.default
    data = await fetch_air_quality(city_name=city, custom_lat=lat, custom_lon=lon)
    return data

@app.post("/api/chat")
async def chat_assistant(req: ChatRequest):
    profile = get_profile("default_user")
    context = {
        "city": req.city,
        "aqi": req.aqi,
        "category": req.category,
        "pm2_5": req.pm2_5,
        "temperature_inversion": req.temperature_inversion,
        "ai_persona": req.ai_persona,
        "location_briefing": req.location_briefing,
        "profile": profile
    }

    if req.messages:
        last_user = req.messages[-1]
        if last_user.get("role") == "user":
            with db_session() as conn:
                conn.execute(
                    """
                    INSERT INTO chat_messages (role, content, metadata_json, created_at)
                    VALUES (?, ?, ?, ?)
                    """,
                    ("user", last_user.get("content", "")[:2000], json.dumps({"city": req.city, "aqi": req.aqi}), datetime.now().isoformat())
                )

    ai_response = await generate_chat_response(req.messages, context)

    with db_session() as conn:
        conn.execute(
            """
            INSERT INTO chat_messages (role, content, metadata_json, created_at)
            VALUES (?, ?, ?, ?)
            """,
            ("assistant", ai_response.get("reply", ""), json.dumps(ai_response), datetime.now().isoformat())
        )

    return ai_response

@app.get("/api/chat/history")
async def get_chat_history():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, role, content, metadata_json, created_at FROM chat_messages ORDER BY id ASC LIMIT 50")
    rows = cursor.fetchall()
    conn.close()
    return {"messages": [dict(r) for r in rows]}

@app.delete("/api/chat/history")
async def clear_chat_history():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM chat_messages")
    conn.commit()
    conn.close()
    return {"status": "cleared"}

@app.get("/api/profile")
async def read_profile():
    return get_profile("default_user")

@app.post("/api/profile")
async def save_profile(req: ProfileRequest):
    updated = update_profile("default_user", req.model_dump())
    return {"status": "saved", "profile": updated}

@app.post("/api/routine/generate")
async def create_routine(req: RoutineRequest):
    profile = get_profile("default_user")
    aq_data = await fetch_air_quality(req.city)
    routine = await generate_smart_routine(req.city, aq_data, profile)
    return routine

@app.get("/api/routine/saved")
async def list_saved_routines():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM saved_routines ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    result = []
    for r in rows:
        d = dict(r)
        d["morning_schedule"] = json.loads(d["morning_schedule"]) if d["morning_schedule"] else []
        d["afternoon_schedule"] = json.loads(d["afternoon_schedule"]) if d["afternoon_schedule"] else []
        d["evening_schedule"] = json.loads(d["evening_schedule"]) if d["evening_schedule"] else []
        result.append(d)
    return {"routines": result}

@app.post("/api/routine/save")
async def save_routine(data: Dict[str, Any] = Body(...)):
    conn = get_connection()
    cursor = conn.cursor()
    now = datetime.now().isoformat()
    cursor.execute("""
    INSERT INTO saved_routines (
        title, city, aqi_level, aqi_category,
        morning_schedule, afternoon_schedule, evening_schedule,
        total_co2_avoided_kg, total_pm_avoided_g, is_active, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    """, (
        data.get("title", "Daily Clean Routine"),
        data.get("city", "Delhi NCR"),
        data.get("aqi_level", 350),
        data.get("aqi_category", "Very Poor"),
        json.dumps(data.get("morning", [])),
        json.dumps(data.get("afternoon", [])),
        json.dumps(data.get("evening", [])),
        data.get("total_co2_avoided_kg", 2.5),
        data.get("total_pm_avoided_g", 0.8),
        now
    ))
    conn.commit()
    conn.close()
    return {"status": "saved"}

@app.post("/api/family/plan")
async def create_family_plan(city: str = Query("Delhi NCR")):
    profile = get_profile("default_user")
    aq_data = await fetch_air_quality(city)
    plan = await generate_family_plan(profile, aq_data)
    return plan

@app.get("/api/iaq/intelligence")
async def get_iaq_intelligence():
    """
    Returns practical indoor air quality improvement guidance,
    ventilation timing windows, myth busters, and filtration physics.
    """
    return {
        "title": "Indoor Air Quality (IAQ) Intelligence",
        "ventilation_windows": [
            {
                "time_slot": "06:00 AM - 10:00 AM",
                "status": "DANGER - KEEP SEALED",
                "color": "#EF4444",
                "reason": "Severe morning radiation thermal inversion. Ground-level cold air trapped with toxic vehicular and biomass smoke. Opening windows will flood living spaces with raw PM2.5."
            },
            {
                "time_slot": "01:00 PM - 03:30 PM",
                "status": "OPTIMAL VENTILATION WINDOW",
                "color": "#10B981",
                "reason": "Solar ground warming breaks the nocturnal inversion layer, driving convective mixing and diluting surface PM2.5. Ideal time for 10-15 min cross-ventilation to clear indoor CO2."
            },
            {
                "time_slot": "07:00 PM - 11:00 PM",
                "status": "HIGH ALERT - SEAL DOORS",
                "color": "#F97316",
                "reason": "Evening temperature drops trigger secondary inversion and rush-hour emissions re-accumulation. Keep air purifiers running."
            }
        ],
        "combustion_sources": [
            {
                "source": "Incense Sticks (Agarbatti) & Dhoop",
                "pm25_impact": "+350 to 800 µg/m³ peak",
                "action": "Eliminate completely during winter. Incense smoke contains benzene, polycyclic aromatic hydrocarbons (PAHs), and fine carbon soot.",
                "substitute": "Essential oil ultrasonic diffusers (without heating) or electric LED diyas."
            },
            {
                "source": "Uncovered Deep Frying & Cooking",
                "pm25_impact": "+200 to 500 µg/m³",
                "action": "Always cover pans with lids; switch kitchen range hood/chimney on 2 minutes before igniting burners and keep on for 5 minutes post cooking.",
                "substitute": "Steam, pressure cook, or use induction stovetops."
            },
            {
                "source": "Mosquito Coils",
                "pm25_impact": "Equal to ~75-100 cigarettes in PM2.5 mass!",
                "action": "Never burn mosquito coils indoors in sealed winter rooms.",
                "substitute": "Fine window mesh screens and electric mosquito swatters."
            },
            {
                "source": "Dry Broom Sweeping",
                "pm25_impact": "Resuspends settled coarse & fine PM10/PM2.5 dust",
                "action": "Prohibit dry brooms during smog season.",
                "substitute": "Damp microfiber mopping or vacuum cleaners with sealed HEPA exhaust."
            }
        ],
        "myth_busters": [
            {
                "myth": "Indoor plants (like Snake Plant or Peace Lily) can clean winter smog from your apartment.",
                "fact": "BUSTED. NASA's 1989 study was done in small airtight chambers measuring VOCs, not ambient PM2.5 particulates. Peer-reviewed environmental studies show you would need 10 to 100 plants per square meter to equal the particulate removal rate of even a basic mechanical True HEPA filter.",
                "guidance": "Enjoy houseplants for aesthetics, but do NOT rely on them as an air purification system during smog emergencies."
            },
            {
                "myth": "Keeping AC turned on cleans the room air.",
                "fact": "PARTIAL. Standard split AC units only recirculate air through basic coarse mesh filters (captures hair and large dust, but lets 99% of fine PM2.5 pass through). Only dedicated HEPA H13 purifiers capture sub-micron particles.",
                "guidance": "Install True HEPA purifiers alongside your AC, and never use 'Fresh Air Intake' modes during smog days."
            }
        ],
        "air_filtration_guide": {
            "cadr_formula": "CADR (m³/hr) should be at least 5x the room volume in m³ for severe smog conditions.",
            "rule_of_thumb": "For a 200 sq ft (18.5 m²) bedroom with 9 ft ceiling: Volume = 51 m³. Recommended CADR = 250 m³/hr to achieve 5 air changes per hour (ACH).",
            "filter_types": [
                {"name": "Pre-Filter", "target": "Pet dander, human hair, coarse dust", "maintenance": "Wash every 2 weeks"},
                {"name": "Activated Carbon", "target": "VOCs, cooking odors, NO2, ozone", "maintenance": "Replace every 6-9 months"},
                {"name": "True HEPA (H13)", "target": "99.97% of particles down to 0.3 microns (PM2.5, pollen, bacteria)", "maintenance": "Replace every 6-12 months; never wash with water"}
            ]
        }
    }

@app.post("/api/alternatives/compare")
async def compare_alternatives(trip_km: float = Query(15.0)):
    return compare_transport_alternatives(trip_km)

@app.get("/api/community/hub")
async def get_community_hub():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM community_reports ORDER BY upvotes DESC")
    reports = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT COUNT(*) FROM completed_actions")
    total_actions = cursor.fetchone()[0]

    cursor.execute("SELECT SUM(co2_saved_kg), SUM(pm_saved_g) FROM completed_actions")
    tot = cursor.fetchone()
    comm_co2 = round((tot[0] or 0.0) + 1420.5, 1) # aggregate community milestone
    comm_pm = round((tot[1] or 0.0) + 385.0, 1)

    conn.close()

    campaigns = [
        {
            "id": "c1",
            "title": "Clean School Corridors & No-Idling Zones",
            "participants": 420,
            "goal": "Enforce strict zero engine idling within 200m of schools during student pickup.",
            "impact_milestone": "2.4 tons CO2 avoided across 18 participating institutions",
            "progress_pct": 74
        },
        {
            "id": "c2",
            "title": "Anti-Biomass Burning Neighborhood Vigil",
            "participants": 680,
            "goal": "Identify and extinguish leaf and municipal trash burning before smoke accumulates.",
            "impact_milestone": "84 open burning incidents averted and composted",
            "progress_pct": 88
        },
        {
            "id": "c3",
            "title": "Friday Public Transit Challenge",
            "participants": 1250,
            "goal": "Pledge to commute exclusively via Metro, bus, or carpool every Friday.",
            "impact_milestone": "15,800 private car-km removed from city roads",
            "progress_pct": 92
        }
    ]

    return {
        "campaigns": campaigns,
        "reports": reports,
        "community_stats": {
            "active_members": 2350,
            "total_community_co2_saved_kg": comm_co2,
            "total_community_pm_saved_g": comm_pm,
            "verified_reports_resolved": 38
        }
    }

@app.post("/api/community/report")
async def submit_community_report(req: CommunityReportRequest):
    conn = get_connection()
    cursor = conn.cursor()
    now = datetime.now().isoformat()
    cursor.execute("""
    INSERT INTO community_reports (title, category, description, location_name, severity, upvotes, status, created_at)
    VALUES (?, ?, ?, ?, ?, 1, 'Submitted for Verification', ?)
    """, (req.title, req.category, req.description, req.location_name, req.severity, now))
    conn.commit()
    conn.close()
    return {"status": "reported", "message": "Thank you for safeguarding your community air!"}

@app.post("/api/community/upvote/{report_id}")
async def upvote_report(report_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE community_reports SET upvotes = upvotes + 1 WHERE id = ?", (report_id,))
    conn.commit()
    conn.close()
    return {"status": "upvoted"}

@app.get("/api/impact/stats")
async def read_impact_stats():
    return get_impact_summary()

@app.post("/api/impact/log-action")
async def log_impact_action(req: ActionLogRequest):
    conn = get_connection()
    cursor = conn.cursor()
    now = datetime.now().isoformat()
    cursor.execute("""
    INSERT INTO completed_actions (action_type, category, title, description, co2_saved_kg, pm_saved_g, points, completed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (req.action_type, req.category, req.title, req.description, req.co2_saved_kg, req.pm_saved_g, req.points, now))
    conn.commit()
    conn.close()
    return {"status": "logged", "summary": get_impact_summary()}

@app.get("/api/alerts")
async def get_alerts():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM user_alerts ORDER BY id DESC LIMIT 20")
    rows = cursor.fetchall()
    conn.close()
    return {"alerts": [dict(r) for r in rows]}

@app.post("/api/alerts/mark-read")
async def mark_alerts_read(alert_id: Optional[int] = None):
    conn = get_connection()
    cursor = conn.cursor()
    if alert_id:
        cursor.execute("UPDATE user_alerts SET is_read = 1 WHERE id = ?", (alert_id,))
    else:
        cursor.execute("UPDATE user_alerts SET is_read = 1")
    conn.commit()
    conn.close()
    return {"status": "updated"}

@app.post("/api/alerts/trigger-demo")
async def trigger_demo_alert(scenario: str = Body("smog_spike", embed=True)):
    scenarios = {
        "smog_spike": ("⚠️ Emergency Smog Spike Alert", "Anand Vihar AQI has surged past 445 (Severe+). Boundary layer thermal inversion active. Reschedule outdoor plans immediately.", "danger", "aqi_spike"),
        "ventilation": ("🌬️ Favorable Airing Window Active", "Solar warming has diluted surface smog. Next 20 minutes are safe for brief cross-ventilation to vent indoor CO2.", "info", "health_warning"),
        "achievement": ("🌟 Community Challenge Completed!", "Your community logged 100 sustainable public transit commutes today! 42 kg CO2 avoided.", "success", "achievement")
    }
    title, msg, sev, cat = scenarios.get(scenario, scenarios["smog_spike"])
    conn = get_connection()
    cursor = conn.cursor()
    now = datetime.now().isoformat()
    cursor.execute("""
    INSERT INTO user_alerts (title, message, severity, category, is_read, created_at)
    VALUES (?, ?, ?, ?, 0, ?)
    """, (title, msg, sev, cat, now))
    conn.commit()
    conn.close()
    return {"status": "alert_triggered", "alert": {"title": title, "message": msg, "severity": sev}}

@app.get("/api/settings")
async def get_app_settings():
    api_key = get_api_key()
    masked_key = ""
    if api_key:
        masked_key = f"{api_key[:4]}...{api_key[-4:]}" if len(api_key) > 8 else "***"
    
    gmaps_key = get_setting("google_maps_api_key", "")
    masked_gmaps = f"{gmaps_key[:4]}...{gmaps_key[-4:]}" if len(gmaps_key) > 8 else ""

    return {
        "has_gemini_key": bool(api_key),
        "masked_key": masked_key,
        "has_google_maps_key": bool(gmaps_key),
        "masked_google_maps_key": masked_gmaps,
        "theme": get_setting("theme", "dark"),
        "map_layer": get_setting("map_layer", "google_streets"),
        "auto_locate": get_setting("auto_locate", "1") == "1",
        "temp_unit": get_setting("temp_unit", "C"),
        "demo_mode": get_setting("demo_mode", "0") == "1",
        "supported_models": ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]
    }

@app.post("/api/settings")
async def update_app_settings(req: SettingsRequest):
    if req.gemini_api_key is not None:
        if req.gemini_api_key.strip():
            set_setting("gemini_api_key", req.gemini_api_key.strip())
        else:
            set_setting("gemini_api_key", "")
    if req.google_maps_api_key is not None:
        set_setting("google_maps_api_key", req.google_maps_api_key.strip())
    if req.map_layer is not None:
        set_setting("map_layer", req.map_layer)
    if req.auto_locate is not None:
        set_setting("auto_locate", "1" if req.auto_locate else "0")
    if req.temp_unit is not None:
        set_setting("temp_unit", req.temp_unit)
    if req.theme:
        set_setting("theme", req.theme)
    if req.demo_mode is not None:
        set_setting("demo_mode", "1" if req.demo_mode else "0")
    return {"status": "saved"}

@app.post("/api/settings/test-key")
async def test_gemini_key(key: str = Body(..., embed=True)):
    if not key or len(key.strip()) < 10:
        raise HTTPException(status_code=400, detail="Invalid API Key format.")
    try:
        from google import genai
        client = genai.Client(api_key=key.strip())
        resp = client.models.generate_content(
            model="gemini-2.5-flash",
            contents="Say 'VayuSaathi Gemini Verified' in 5 words."
        )
        return {
            "status": "success",
            "message": "Gemini API Key verified successfully!",
            "model": "gemini-2.5-flash",
            "response": resp.text.strip()
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Connection test failed: {str(e)}"
        }

@app.get("/api/demo/scenario/{scenario_name}")
async def get_demo_scenario(scenario_name: str):
    """
    Judges' Demonstration Mode Quick Scenario Loader.
    Provides instant pre-configured real-world case studies:
    - 'delhi_winter': Severe winter smog inversion, vulnerable child & senior, two-wheeler commute
    - 'bengaluru_clean': Moderate Deccan plateau, EV/Metro commuter, eco-forward
    - 'lahore_smog': Hazardous winter transboundary smog event, asthmatic household
    """
    scenarios = {
        "delhi_winter": {
            "title": "Delhi NCR Severe Winter Smog Crisis",
            "city": "Delhi NCR",
            "aqi": 386,
            "category": "Very Poor",
            "pm2_5": 218.4,
            "household": {
                "household_size": 4,
                "children_count": 1,
                "seniors_count": 1,
                "has_asthma_respiratory": 1,
                "commute_mode": "two_wheeler",
                "daily_commute_km": 18.0,
                "home_ventilation": "split_ac_windows",
                "has_air_purifier": 0
            },
            "situation_brief": "Winter radiation inversion trapping agricultural burning smoke and vehicular exhaust in stagnant cold air. Sensitive family members requiring immediate protective routine."
        },
        "bengaluru_clean": {
            "title": "Bengaluru Urban Plateau Low-Emission Study",
            "city": "Bengaluru",
            "aqi": 88,
            "category": "Satisfactory",
            "pm2_5": 38.0,
            "household": {
                "household_size": 3,
                "children_count": 1,
                "seniors_count": 0,
                "has_asthma_respiratory": 0,
                "commute_mode": "electric_metro",
                "daily_commute_km": 12.0,
                "home_ventilation": "open_windows",
                "has_air_purifier": 1
            },
            "situation_brief": "Satisfactory air conditions with localized traffic bottlenecks. Demonstrates proactive sustainability habits and clean commute tracking."
        },
        "lahore_smog": {
            "title": "Lahore Hazardous Winter Smog Emergency",
            "city": "Lahore",
            "aqi": 468,
            "category": "Severe",
            "pm2_5": 340.0,
            "household": {
                "household_size": 5,
                "children_count": 2,
                "seniors_count": 1,
                "has_asthma_respiratory": 1,
                "commute_mode": "petrol_car_solo",
                "daily_commute_km": 22.0,
                "home_ventilation": "sealed_rooms",
                "has_air_purifier": 1
            },
            "situation_brief": "Hazardous winter inversion emergency. Extreme fine particulate saturation requiring immediate school closures, strict N95 adherence, and indoor safe-haven room protocol."
        }
    }
    return scenarios.get(scenario_name, scenarios["delhi_winter"])

# Mount Frontend Static Assets
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")
if os.path.exists(frontend_dir):
    css_dir = os.path.join(frontend_dir, "css")
    js_dir = os.path.join(frontend_dir, "js")
    if os.path.exists(css_dir):
        app.mount("/css", StaticFiles(directory=css_dir), name="frontend_css")
    if os.path.exists(js_dir):
        app.mount("/js", StaticFiles(directory=js_dir), name="frontend_js")
    app.mount("/static", StaticFiles(directory=frontend_dir), name="frontend_static")


@app.api_route("/", methods=["GET", "HEAD"])
async def serve_index():
    index_file = os.path.join(frontend_dir, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"message": "VayuSaathi API is running. Frontend index.html not found."}
