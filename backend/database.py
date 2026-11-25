"""
VayuSaathi - Database Module
SQLite persistence for household profiles, saved routines, completed actions,
chat history, community reports, alerts, and application settings.
"""

import sqlite3
import os
from contextlib import contextmanager
from datetime import datetime
from typing import Dict, Any, Optional

DB_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "data",
    "vayusaathi.db",
)


def get_connection() -> sqlite3.Connection:
    """Open a SQLite connection configured with row dict access and lock timeout."""
    os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)
    conn = sqlite3.connect(DB_FILE, timeout=10.0)
    conn.execute("PRAGMA busy_timeout=5000;")
    conn.row_factory = sqlite3.Row
    return conn


@contextmanager
def db_session():
    """Yield a managed SQLite connection that commits on success and always closes."""
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Household Profiles
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS household_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT DEFAULT 'default_user',
        household_size INTEGER DEFAULT 4,
        children_count INTEGER DEFAULT 1,
        seniors_count INTEGER DEFAULT 1,
        has_asthma_respiratory INTEGER DEFAULT 0,
        commute_mode TEXT DEFAULT 'two_wheeler',
        daily_commute_km REAL DEFAULT 15.0,
        home_ventilation TEXT DEFAULT 'split_ac_windows',
        has_air_purifier INTEGER DEFAULT 0,
        school_office_hours TEXT DEFAULT '8:00 AM - 5:00 PM',
        indoor_outdoor_pref TEXT DEFAULT 'moderate_outdoor',
        city TEXT DEFAULT 'Delhi NCR',
        created_at TEXT,
        updated_at TEXT
    )
    """)

    # Saved Routines
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS saved_routines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        city TEXT,
        aqi_level INTEGER,
        aqi_category TEXT,
        morning_schedule TEXT, -- JSON
        afternoon_schedule TEXT, -- JSON
        evening_schedule TEXT, -- JSON
        total_co2_avoided_kg REAL DEFAULT 0.0,
        total_pm_avoided_g REAL DEFAULT 0.0,
        is_active INTEGER DEFAULT 1,
        created_at TEXT
    )
    """)

    # Completed Impact Actions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS completed_actions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action_type TEXT,
        category TEXT, -- 'commute', 'household', 'community', 'indoor_air'
        title TEXT,
        description TEXT,
        co2_saved_kg REAL DEFAULT 0.0,
        pm_saved_g REAL DEFAULT 0.0,
        points INTEGER DEFAULT 10,
        completed_at TEXT
    )
    """)

    # Chat History
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT, -- 'user', 'assistant', 'system'
        content TEXT,
        metadata_json TEXT,
        created_at TEXT
    )
    """)

    # Community Reports & Concerns
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS community_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        category TEXT, -- 'waste_burning', 'dust_construction', 'vehicular_idling', 'industrial_smoke'
        description TEXT,
        location_name TEXT,
        severity TEXT, -- 'low', 'medium', 'high', 'critical'
        upvotes INTEGER DEFAULT 1,
        status TEXT DEFAULT 'Under Review',
        created_at TEXT
    )
    """)

    # User Alerts
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        message TEXT,
        severity TEXT, -- 'info', 'warning', 'danger', 'success'
        category TEXT, -- 'aqi_spike', 'health_warning', 'routine_reminder', 'achievement'
        is_read INTEGER DEFAULT 0,
        created_at TEXT
    )
    """)

    # App Settings & Secrets
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at TEXT
    )
    """)

    # Seed initial profile if not exists
    cursor.execute("SELECT COUNT(*) FROM household_profiles WHERE user_id = 'default_user'")
    if cursor.fetchone()[0] == 0:
        now = datetime.now().isoformat()
        cursor.execute("""
        INSERT INTO household_profiles (
            user_id, household_size, children_count, seniors_count,
            has_asthma_respiratory, commute_mode, daily_commute_km,
            home_ventilation, has_air_purifier, school_office_hours,
            indoor_outdoor_pref, city, created_at, updated_at
        ) VALUES (
            'default_user', 4, 1, 1, 1, 'two_wheeler', 18.0,
            'split_ac_windows', 0, '8:30 AM - 5:30 PM',
            'mostly_indoor_smog_season', 'Delhi NCR', ?, ?
        )
        """, (now, now))

    # Seed initial community campaigns and reports if empty
    cursor.execute("SELECT COUNT(*) FROM community_reports")
    if cursor.fetchone()[0] == 0:
        reports = [
            ("Biomass Waste Burning at Empty Lot", "waste_burning", "Open burning of dry leaves and plastic trash detected near sector perimeter.", "Anand Vihar Ward 4", "critical", 24, "Forwarded to Municipal Authority"),
            ("Uncovered Construction Dust Heap", "dust_construction", "Uncovered sand and gravel heaps causing heavy localized dust suspension.", "Ring Road Junction", "high", 18, "Under Investigation"),
            ("School Bus Idling Zone Congestion", "vehicular_idling", "Excessive diesel bus idling during 2:30 PM dismissal.", "Model Town School Zone", "medium", 32, "Notice Issued"),
            ("Stubble Smoke Haze Drifting from Agricultural Border", "industrial_smoke", "Dense evening smoke drifting with low wind velocity and temperature inversion.", "North Delhi Border", "critical", 45, "Action Alert Broadcasted")
        ]
        now = datetime.now().isoformat()
        for rep in reports:
            cursor.execute("""
            INSERT INTO community_reports (title, category, description, location_name, severity, upvotes, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (*rep, now))

    # Seed initial alerts if empty
    cursor.execute("SELECT COUNT(*) FROM user_alerts")
    if cursor.fetchone()[0] == 0:
        alerts = [
            ("Winter Smog Inversion Advisory", "AQI has entered 'Severe' (400+) category. Temperature inversion trapping particulates close to ground. Avoid outdoor jogging.", "danger", "aqi_spike", 0),
            ("Afternoon Ventilation Window", "Outdoor PM2.5 expected to temporarily dip between 1:00 PM - 3:00 PM. Brief HEPA cross-ventilation advised.", "info", "health_warning", 0),
            ("Clean Commute Goal Reached", "You avoided 4.2 kg CO2 and 18g PM2.5 this week by choosing Metro over personal car!", "success", "achievement", 1)
        ]
        now = datetime.now().isoformat()
        for alt in alerts:
            cursor.execute("""
            INSERT INTO user_alerts (title, message, severity, category, is_read, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """, (*alt, now))

    # Seed initial impact logs if empty
    cursor.execute("SELECT COUNT(*) FROM completed_actions")
    if cursor.fetchone()[0] == 0:
        actions = [
            ("metro_commute", "commute", "Took Metro instead of Petrol Car", "Commuted 18 km round-trip via electric metro rail instead of private car.", 2.52, 0.72, 25),
            ("carpool_shared", "commute", "Carpool with 2 Colleagues", "Shared 14 km commute ride, eliminating two separate vehicular trips.", 1.96, 0.56, 20),
            ("avoided_trash_burning", "community", "Reported & Extinguished Leaf Burning", "Prevented burning of 5 kg dry garden waste and leaf litter.", 6.00, 42.5, 50),
            ("lid_cooking_ventilation", "indoor_air", "Used Induction & Exhaust Hood", "Kept lids covered and ran chimney exhaust while cooking dinner, cutting PM2.5 peaks.", 0.45, 0.12, 15),
            ("energy_setback", "household", "Adjusted Heater Setpoint by 2°C", "Saved ~1.5 kWh electric consumption during peak load evening hours.", 1.23, 0.05, 15)
        ]
        now = datetime.now().isoformat()
        for act in actions:
            cursor.execute("""
            INSERT INTO completed_actions (action_type, category, title, description, co2_saved_kg, pm_saved_g, points, completed_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (*act, now))

    conn.commit()
    conn.close()

# Helper queries
def get_profile(user_id: str = "default_user") -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM household_profiles WHERE user_id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(row)
    return {}

def update_profile(user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    now = datetime.now().isoformat()
    cursor.execute("""
    UPDATE household_profiles SET
        household_size = ?,
        children_count = ?,
        seniors_count = ?,
        has_asthma_respiratory = ?,
        commute_mode = ?,
        daily_commute_km = ?,
        home_ventilation = ?,
        has_air_purifier = ?,
        school_office_hours = ?,
        indoor_outdoor_pref = ?,
        city = ?,
        updated_at = ?
    WHERE user_id = ?
    """, (
        data.get("household_size", 4),
        data.get("children_count", 1),
        data.get("seniors_count", 1),
        data.get("has_asthma_respiratory", 0),
        data.get("commute_mode", "two_wheeler"),
        data.get("daily_commute_km", 15.0),
        data.get("home_ventilation", "split_ac_windows"),
        data.get("has_air_purifier", 0),
        data.get("school_office_hours", "8:30 AM - 5:30 PM"),
        data.get("indoor_outdoor_pref", "mostly_indoor_smog_season"),
        data.get("city", "Delhi NCR"),
        now,
        user_id
    ))
    conn.commit()
    conn.close()
    return get_profile(user_id)

def get_setting(key: str, default: Optional[str] = None) -> Optional[str]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT value FROM app_settings WHERE key = ?", (key,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return row[0]
    return default

def set_setting(key: str, value: str):
    conn = get_connection()
    cursor = conn.cursor()
    now = datetime.now().isoformat()
    cursor.execute("""
    INSERT INTO app_settings (key, value, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    """, (key, value, now))
    conn.commit()
    conn.close()
