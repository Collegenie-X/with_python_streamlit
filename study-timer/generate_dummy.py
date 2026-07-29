import json, os, random
from datetime import date, timedelta

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
SESSIONS_DIR = os.path.join(DATA_DIR, 'sessions')
os.makedirs(SESSIONS_DIR, exist_ok=True)

subjects = [
    {"name": "영어", "goal_minutes": 50, "color": "#2196f3", "done": False},
    {"name": "국어", "goal_minutes": 30, "color": "#FF9800", "done": False},
    {"name": "수학", "goal_minutes": 90, "color": "#ae4c8f", "done": False},
    {"name": "과학", "goal_minutes": 45, "color": "#9C27B0", "done": False},
]

with open(os.path.join(DATA_DIR, 'subjects.json'), 'w', encoding='utf-8') as f:
    json.dump(subjects, f, ensure_ascii=False, indent=2)

random.seed(42)
today = date.today()

# --- 내 세션 데이터 (90일) ---
for offset in range(90):
    d = today - timedelta(days=89 - offset)
    dow = d.weekday()
    is_weekend = dow >= 5
    sessions = []
    hour = 8
    for subj in subjects:
        if random.random() < (0.3 if not is_weekend else 0.5):
            continue
        for _ in range(random.choice([1, 1, 2]) if not is_weekend else random.choice([1, 2, 2, 3])):
            dur = max(300, int(subj['goal_minutes'] * 60 * random.uniform(0.3, 1.4)))
            pc = random.randint(0, 3)
            ps = pc * random.randint(30, 120)
            eh = (hour * 3600 + dur + ps) // 3600
            em = ((hour * 3600 + dur + ps) % 3600) // 60
            sessions.append({
                "subject": subj['name'],
                "start_time": f"{d}T{hour:02d}:00:00.000Z",
                "end_time": f"{d}T{eh:02d}:{em:02d}:00.000Z",
                "duration_seconds": dur,
                "pause_count": pc,
                "pause_seconds": ps,
            })
            hour = min(eh + 1, 22)
    if sessions:
        with open(os.path.join(SESSIONS_DIR, f"{d}.json"), 'w', encoding='utf-8') as f:
            json.dump(sessions, f, ensure_ascii=False, indent=2)

# --- 반 평균 데이터 (20명 기준) ---
random.seed(99)
class_avg = {
    "class_size": 20,
    "daily": {},
    "subject_daily": {},
}

for offset in range(90):
    d = today - timedelta(days=89 - offset)
    ds = d.isoformat()
    is_weekend = d.weekday() >= 5
    base = 140 if not is_weekend else 90
    avg_total = max(30, int(base + random.gauss(0, 30)))
    class_avg["daily"][ds] = {
        "avg_study_minutes": avg_total,
        "avg_pause_minutes": max(0, int(avg_total * random.uniform(0.05, 0.15))),
        "top_study_minutes": int(avg_total * random.uniform(1.5, 2.2)),
        "bottom_study_minutes": max(0, int(avg_total * random.uniform(0.2, 0.5))),
    }
    for subj in subjects:
        key = subj['name']
        if key not in class_avg["subject_daily"]:
            class_avg["subject_daily"][key] = {}
        ratio = subj['goal_minutes'] / sum(s['goal_minutes'] for s in subjects)
        subj_avg = max(5, int(avg_total * ratio + random.gauss(0, 8)))
        class_avg["subject_daily"][key][ds] = {
            "avg_study_minutes": subj_avg,
            "top_study_minutes": int(subj_avg * random.uniform(1.4, 2.0)),
        }

with open(os.path.join(DATA_DIR, 'class_avg.json'), 'w', encoding='utf-8') as f:
    json.dump(class_avg, f, ensure_ascii=False, indent=2)

print(f"Generated 90 days + class avg: {today - timedelta(89)} ~ {today}")
