"""
HawaWise AI - Direct Test Suite
Tests all core services: database, air quality, gemini service, impact calculator, and FastAPI endpoints.
"""

import sys
import time

print("STEP 0: Starting test_suite.py...", flush=True)

import asyncio
print("STEP 1: asyncio imported", flush=True)

from backend.main import health_check
print("STEP 2: health_check imported", flush=True)

from backend.main import (
    get_supported_cities, get_air_quality,
    read_profile, get_iaq_intelligence, get_community_hub,
    read_impact_stats, get_alerts, get_app_settings,
    compare_alternatives
)
from backend.gemini_service import generate_expert_reply
print("STEP 3: All endpoints imported", flush=True)

async def run_tests():
    print("=" * 60, flush=True)
    print("RUNNING HAWAWISE AI SYSTEM VERIFICATION TESTS", flush=True)
    print("=" * 60, flush=True)

    # 1. Health check
    t0 = time.time()
    h = await health_check()
    print(f"[PASS] 1. Health Check: Status={h['status']}, GenAI Provider={h['genai_provider']} ({time.time()-t0:.3f}s)", flush=True)

    # 2. Supported Cities
    t0 = time.time()
    c = await get_supported_cities()
    print(f"[PASS] 2. Cities Database: {len(c['cities'])} major urban centers configured ({time.time()-t0:.3f}s)", flush=True)

    # 3. Air Quality & CPCB Standard
    t0 = time.time()
    aq = await get_air_quality("Delhi NCR")
    print(f"[PASS] 3. Air Quality (Delhi NCR): AQI={aq['aqi']} ({aq['category']}), PM2.5={aq['pollutants']['pm2_5']['value']} ug/m3, Inversion={aq['weather']['temperature_inversion_detected']}, Source={aq['data_source_type']} ({time.time()-t0:.3f}s)", flush=True)

    # 4. Household Profile
    t0 = time.time()
    p = await read_profile()
    print(f"[PASS] 4. Household Profile: City={p['city']}, Size={p['household_size']} members, Kids={p['children_count']}, Seniors={p['seniors_count']}, Commute={p['commute_mode']} ({time.time()-t0:.3f}s)", flush=True)

    # 5. IAQ Intelligence
    t0 = time.time()
    iaq = await get_iaq_intelligence()
    print(f"[PASS] 5. IAQ Intelligence: {len(iaq['ventilation_windows'])} diurnal ventilation windows, {len(iaq['myth_busters'])} myth busters ({time.time()-t0:.3f}s)", flush=True)

    # 6. Sustainable Alternatives Comparison
    t0 = time.time()
    alt = await compare_alternatives(15.0)
    metro = [m for m in alt['comparisons'] if 'metro' in m['key']][0]
    print(f"[PASS] 6. Alternatives Engine: 15 km Commute -> Electric Metro saves {metro['co2_saved_kg']} kg CO2 ({metro['reduction_percentage']}% cut vs petrol car) ({time.time()-t0:.3f}s)", flush=True)

    # 7. Community Hub
    t0 = time.time()
    hub = await get_community_hub()
    print(f"[PASS] 7. Community Hub: {len(hub['campaigns'])} active campaigns, {len(hub['reports'])} reports, Collective CO2 saved={hub['community_stats']['total_community_co2_saved_kg']} kg ({time.time()-t0:.3f}s)", flush=True)

    # 8. Impact Tracker & Sustainability Score
    t0 = time.time()
    imp = await read_impact_stats()
    print(f"[PASS] 8. Impact Tracker: Personal Score={imp['sustainability_score']}/100 ({imp['score_tier']}), Total Actions={imp['total_actions_completed']} ({time.time()-t0:.3f}s)", flush=True)

    # 9. Alerts Center
    t0 = time.time()
    alts = await get_alerts()
    print(f"[PASS] 9. Alerts Center: {len(alts['alerts'])} active alerts ({time.time()-t0:.3f}s)", flush=True)

    # 10. App Settings
    t0 = time.time()
    settings = await get_app_settings()
    print(f"[PASS] 10. App Settings: Theme={settings['theme']}, Gemini Configured={settings['has_gemini_key']} ({time.time()-t0:.3f}s)")

    # 11. GPS Location Resolution & Full Parameter Validation
    t0 = time.time()
    gps_aq = await get_air_quality(city="Custom GPS", lat=28.5355, lon=77.3910)
    assert "lat" in gps_aq["coordinates"] and "lon" in gps_aq["coordinates"], "Missing coordinates"
    assert len(gps_aq["pollutants"]) == 7, f"Expected 7 pollutants, got {len(gps_aq['pollutants'])}"
    for p in ["pm2_5", "pm10", "no2", "so2", "co", "o3", "nh3"]:
        assert p in gps_aq["pollutants"], f"Missing pollutant {p}"
        assert "sub_index" in gps_aq["pollutants"][p], f"Missing sub_index in {p}"
    
    w = gps_aq["weather"]
    for param in ["temperature", "apparent_temperature", "humidity", "wind_speed", "wind_direction", "pressure", "visibility", "uv_index", "weather_condition"]:
        assert param in w, f"Missing weather param {param}"
    
    print(f"[PASS] 11. GPS Resolution (28.5355N, 77.3910E): Title='{gps_aq['city']}', AQI={gps_aq['aqi']} ({gps_aq['category']}), Dominant={gps_aq['dominant_pollutant']}, All 7 Pollutants & 9 Weather Parameters Verified ({time.time()-t0:.3f}s)")

    # 12. GPS Context-Aware Environmental Briefing
    briefing = generate_expert_reply(
        "Summarize the air quality at my GPS location",
        "Test GPS",
        245,
        "Poor",
        90.0,
        0,
        0,
        False,
        "metro",
        False,
        {
            "location": "Test GPS",
            "aqi": 245,
            "category": "Poor",
            "dominant_pollutant": "PM2.5",
            "pollutants": {
                "pm2_5": {"value": 90, "unit": "ug/m3"},
                "pm10": {"value": 120, "unit": "ug/m3"}
            },
            "weather": {
                "temperature": 22,
                "humidity": 50,
                "wind_speed": 4,
                "temperature_inversion_detected": False
            },
            "data_source": "Live model",
            "accuracy": "40 m",
            "updated_at": "now"
        }
    )
    assert "GPS Air-Quality Briefing: Test GPS" in briefing
    assert "AQI: 245 (Poor)" in briefing
    assert "PM2.5" in briefing and "90 ug/m3" in briefing
    assert "22" in briefing and "40 m" in briefing
    print("[PASS] 12. GPS AI Briefing: Includes local AQI, pollutant detail, weather and fix accuracy")

    print("=" * 60)
    print("ALL SYSTEM CHECKS PASSED.")
    print("=" * 60)

if __name__ == "__main__":
    print("STEP 4: Invoking asyncio.run(run_tests())...", flush=True)
    asyncio.run(run_tests())
    print("STEP 5: Completed successfully!", flush=True)
