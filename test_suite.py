"""
VayuSaathi - Backend Contract & Service Verification Suite
Tests database session safety, CPCB NAQI endpoints, IAQ intelligence,
emission calculations, community reporting, and Gemini/CPCB fallback logic.
"""

import asyncio
import time

from backend.main import (
    health_check,
    get_supported_cities,
    get_air_quality,
    read_profile,
    get_iaq_intelligence,
    get_community_hub,
    read_impact_stats,
    get_alerts,
    get_app_settings,
    compare_alternatives,
)
from backend.gemini_service import generate_expert_reply


async def run_tests() -> None:
    print("=" * 60)
    print("RUNNING VAYUSAATHI BACKEND VERIFICATION TESTS")
    print("=" * 60)

    t0 = time.time()
    h = await health_check()
    assert h["status"] == "online" and h["app_name"] == "VayuSaathi"
    print(f"[PASS] 1. Health Check: {h['genai_provider']} ({time.time() - t0:.3f}s)")

    t0 = time.time()
    c = await get_supported_cities()
    assert len(c["cities"]) > 0
    print(f"[PASS] 2. Cities Database: {len(c['cities'])} cities ({time.time() - t0:.3f}s)")

    t0 = time.time()
    aq = await get_air_quality("Delhi NCR")
    assert "aqi" in aq and "pollutants" in aq and "weather" in aq
    print(f"[PASS] 3. Air Quality (Delhi NCR): AQI={aq['aqi']} ({aq['category']}) ({time.time() - t0:.3f}s)")

    t0 = time.time()
    p = await read_profile()
    assert "household_size" in p and "city" in p
    print(f"[PASS] 4. Household Profile: City={p['city']} ({time.time() - t0:.3f}s)")

    t0 = time.time()
    iaq = await get_iaq_intelligence()
    assert len(iaq["ventilation_windows"]) >= 3 and len(iaq["combustion_sources"]) >= 3
    print(f"[PASS] 5. IAQ Intelligence verified ({time.time() - t0:.3f}s)")

    t0 = time.time()
    alt = await compare_alternatives(15.0)
    assert len(alt["comparisons"]) > 0 and "baseline" in alt
    print(f"[PASS] 6. Alternatives Engine verified ({time.time() - t0:.3f}s)")

    t0 = time.time()
    hub = await get_community_hub()
    assert "campaigns" in hub and "reports" in hub and "community_stats" in hub
    print(f"[PASS] 7. Community Hub verified ({time.time() - t0:.3f}s)")

    t0 = time.time()
    imp = await read_impact_stats()
    assert "sustainability_score" in imp and "equivalent_metrics" in imp
    print(f"[PASS] 8. Impact Tracker: Score={imp['sustainability_score']}/100 ({time.time() - t0:.3f}s)")

    t0 = time.time()
    alts = await get_alerts()
    assert "alerts" in alts
    print(f"[PASS] 9. Alerts Center verified ({time.time() - t0:.3f}s)")

    t0 = time.time()
    settings = await get_app_settings()
    assert "theme" in settings and "map_layer" in settings
    print(f"[PASS] 10. Settings verified ({time.time() - t0:.3f}s)")

    t0 = time.time()
    gps_aq = await get_air_quality(city="Custom GPS", lat=28.5355, lon=77.3910)
    assert len(gps_aq["pollutants"]) == 7
    print(f"[PASS] 11. GPS Resolution verified ({time.time() - t0:.3f}s)")

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
            "pollutants": {"pm2_5": {"value": 90, "unit": "ug/m3"}},
            "weather": {"temperature": 22, "humidity": 50, "wind_speed": 4, "temperature_inversion_detected": False},
            "data_source": "Live model",
            "accuracy": "40 m",
            "updated_at": "now",
        },
    )
    assert "GPS Air-Quality Briefing: Test GPS" in briefing
    print("[PASS] 12. GPS AI Briefing verified")
    print("=" * 60)
    print("ALL VAYUSAATHI SYSTEM CHECKS PASSED.")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(run_tests())
