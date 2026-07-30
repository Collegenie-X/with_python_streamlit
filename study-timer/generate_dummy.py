import sqlite3
import os
import random
import hashlib
from datetime import date, timedelta

DB_PATH = os.path.join(os.path.dirname(__file__), 'data', 'study.db')
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

if os.path.exists(DB_PATH):
    os.remove(DB_PATH)

db = sqlite3.connect(DB_PATH)
db.executescript('''
    CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        goal_minutes INTEGER DEFAULT 30,
        color TEXT DEFAULT '#3b82f6',
        done INTEGER DEFAULT 0,
        sort_order INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        subject TEXT NOT NULL,
        start_time TEXT,
        end_time TEXT,
        duration_seconds INTEGER DEFAULT 0,
        pause_count INTEGER DEFAULT 0,
        pause_seconds INTEGER DEFAULT 0,
        date TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_sessions_student_date ON sessions(student_id, date);
    CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date);
''')

SUBJECTS = [
    ('국어', 40, '#f97316', 0),
    ('영어', 50, '#3b82f6', 1),
    ('수학', 90, '#a855f7', 2),
    ('사회', 30, '#22c55e', 3),
    ('역사', 30, '#eab308', 4),
    ('과학', 45, '#06b6d4', 5),
    ('물리', 40, '#ef4444', 6),
    ('독서', 30, '#ec4899', 7),
]
for name, goal, color, order in SUBJECTS:
    db.execute(
        'INSERT INTO subjects (name, goal_minutes, color, sort_order) VALUES (?,?,?,?)',
        (name, goal, color, order),
    )

# 20 students: 5 top / 8 average / 4 lazy / 3 ghost
STUDENTS = [
    # (name, type) — type: top, avg, lazy, ghost
    ('Alice', 'top'),
    ('Bob', 'top'),
    ('Charlie', 'top'),
    ('Diana', 'top'),
    ('Ethan', 'top'),
    ('Fiona', 'avg'),
    ('George', 'avg'),
    ('Hannah', 'avg'),
    ('Ian', 'avg'),
    ('Julia', 'avg'),
    ('Kevin', 'avg'),
    ('Luna', 'avg'),
    ('Mike', 'avg'),
    ('Nora', 'lazy'),
    ('Oscar', 'lazy'),
    ('Paul', 'lazy'),
    ('Quinn', 'lazy'),
    ('Rachel', 'ghost'),
    ('Sam', 'ghost'),
    ('Tina', 'ghost'),
]

# type → (effort_range, consistency_range, skip_weekend_extra)
PROFILES = {
    'top':   {'effort': (1.0, 1.5), 'consistency': (0.8, 0.95), 'weekend_drop': 0.1},
    'avg':   {'effort': (0.6, 1.0), 'consistency': (0.5, 0.75), 'weekend_drop': 0.25},
    'lazy':  {'effort': (0.3, 0.6), 'consistency': (0.2, 0.4),  'weekend_drop': 0.5},
    'ghost': {'effort': (0.1, 0.3), 'consistency': (0.05, 0.15),'weekend_drop': 0.7},
}

students = []
for i, (name, stype) in enumerate(STUDENTS):
    sid = hashlib.md5(f'{name}_{i}'.encode()).hexdigest()[:8]
    db.execute('INSERT INTO students (id, name) VALUES (?,?)', (sid, name))
    students.append((sid, name, stype))

today = date.today()
DAYS = 30
subj_names = [s[0] for s in SUBJECTS]
subj_goals = {s[0]: s[1] for s in SUBJECTS}

random.seed(42)
batch = []
for si, (sid, sname, stype) in enumerate(students):
    random.seed(42 + si * 100)
    prof = PROFILES[stype]
    effort = random.uniform(*prof['effort'])
    consistency = random.uniform(*prof['consistency'])

    for offset in range(DAYS):
        d = today - timedelta(days=DAYS - 1 - offset)
        ds = d.isoformat()
        is_weekend = d.weekday() >= 5
        hour = random.randint(7, 10)

        day_mood = random.uniform(0.6, 1.4)

        for subj_name in subj_names:
            threshold = consistency * (1.0 - prof['weekend_drop'] if is_weekend else 1.0)
            if random.random() > threshold * day_mood:
                continue

            num_sessions = 1
            if stype == 'top' and random.random() < 0.4:
                num_sessions = 2
            elif stype == 'avg' and random.random() < 0.2:
                num_sessions = 2

            for _ in range(num_sessions):
                base_dur = subj_goals[subj_name] * 60 * effort * day_mood
                dur = max(300, int(base_dur * random.uniform(0.5, 1.3)))
                pc = random.randint(0, 2 if stype in ('top', 'avg') else 4)
                ps = pc * random.randint(30, 120)
                end_sec = hour * 3600 + dur + ps
                eh = min(end_sec // 3600, 23)
                em = (end_sec % 3600) // 60
                batch.append((
                    sid, subj_name,
                    f'{ds}T{hour:02d}:00:00.000Z',
                    f'{ds}T{eh:02d}:{em:02d}:00.000Z',
                    dur, pc, ps, ds,
                ))
                hour = min(eh + 1, 22)

db.executemany(
    'INSERT INTO sessions '
    '(student_id, subject, start_time, end_time, duration_seconds, pause_count, pause_seconds, date) '
    'VALUES (?,?,?,?,?,?,?,?)',
    batch,
)
db.commit()

total = db.execute('SELECT COUNT(*) FROM sessions').fetchone()[0]

# print summary by type
print(f'Generated {len(students)} students, {total} sessions ({DAYS} days)')
print()
for stype in ('top', 'avg', 'lazy', 'ghost'):
    names = [n for _, n, t in students if t == stype]
    sids = [s for s, _, t in students if t == stype]
    counts = []
    for sid in sids:
        c = db.execute('SELECT COUNT(*) FROM sessions WHERE student_id=?', (sid,)).fetchone()[0]
        counts.append(c)
    avg_c = sum(counts) / len(counts) if counts else 0
    print(f'  {stype:6s}: {", ".join(names)} (avg {avg_c:.0f} sessions each)')

print(f'\nDB: {DB_PATH}')
db.close()
