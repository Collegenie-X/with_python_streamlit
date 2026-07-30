import sqlite3
import os
import hashlib
from datetime import date, timedelta
from flask import Flask, render_template, request, jsonify, g

app = Flask(__name__)

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
DB_PATH = os.path.join(DATA_DIR, 'study.db')
COLORS_12 = [
    '#3b82f6', '#f97316', '#a855f7', '#22c55e', '#ef4444', '#06b6d4',
    '#eab308', '#ec4899', '#14b8a6', '#f43f5e', '#8b5cf6', '#84cc16',
]

os.makedirs(DATA_DIR, exist_ok=True)
with sqlite3.connect(DB_PATH) as _conn:
    _conn.executescript('''
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
            distraction_seconds INTEGER DEFAULT 0,
            distraction_phone INTEGER DEFAULT 0,
            distraction_spacing INTEGER DEFAULT 0,
            distraction_away INTEGER DEFAULT 0,
            distraction_drowsy INTEGER DEFAULT 0,
            date TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
        );
        CREATE INDEX IF NOT EXISTS idx_sessions_student_date ON sessions(student_id, date);
        CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date);
    ''')
    for col, coltype in [
        ('distraction_seconds', 'INTEGER DEFAULT 0'),
        ('distraction_phone', 'INTEGER DEFAULT 0'),
        ('distraction_spacing', 'INTEGER DEFAULT 0'),
        ('distraction_away', 'INTEGER DEFAULT 0'),
        ('distraction_drowsy', 'INTEGER DEFAULT 0'),
    ]:
        try:
            _conn.execute(f'ALTER TABLE sessions ADD COLUMN {col} {coltype}')
        except sqlite3.OperationalError:
            pass

    FIXED_SUBJECTS = [
        ('국어', 40, '#f97316', 0), ('영어', 50, '#3b82f6', 1),
        ('수학', 90, '#a855f7', 2), ('사회', 30, '#22c55e', 3),
        ('역사', 30, '#eab308', 4), ('과학', 45, '#06b6d4', 5),
        ('물리', 40, '#ef4444', 6), ('독서', 30, '#ec4899', 7),
    ]
    for name, goal, color, order in FIXED_SUBJECTS:
        _conn.execute(
            'INSERT OR IGNORE INTO subjects (name, goal_minutes, color, sort_order) VALUES (?,?,?,?)',
            (name, goal, color, order),
        )


def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
        g.db.execute('PRAGMA journal_mode=WAL')
        g.db.execute('PRAGMA foreign_keys=ON')
    return g.db


@app.teardown_appcontext
def close_db(exc):
    db = g.pop('db', None)
    if db:
        db.close()


def rows_to_list(rows):
    return [dict(r) for r in rows]


# ── 페이지 ──

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')


@app.route('/db')
def db_viewer():
    return render_template('db_viewer.html')


@app.route('/api/db/stats/subjects', methods=['GET'])
def db_subject_stats():
    db = get_db()
    rows = db.execute('''
        SELECT s.subject,
               COUNT(*) as session_count,
               ROUND(AVG(s.duration_seconds) / 60.0, 1) as avg_minutes,
               ROUND(SUM(s.duration_seconds) / 60.0, 1) as total_minutes,
               ROUND(MIN(s.duration_seconds) / 60.0, 1) as min_minutes,
               ROUND(MAX(s.duration_seconds) / 60.0, 1) as max_minutes,
               ROUND(AVG(s.pause_count), 1) as avg_pause_count,
               COUNT(DISTINCT s.student_id) as student_count
        FROM sessions s
        GROUP BY s.subject
        ORDER BY total_minutes DESC
    ''').fetchall()
    return jsonify([dict(r) for r in rows])


@app.route('/api/db/tables', methods=['GET'])
def db_tables():
    db = get_db()
    tables = db.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    ).fetchall()
    result = []
    for t in tables:
        name = t['name']
        count = db.execute(f'SELECT COUNT(*) as c FROM [{name}]').fetchone()['c']
        cols = db.execute(f'PRAGMA table_info([{name}])').fetchall()
        result.append({
            'name': name,
            'count': count,
            'columns': [{'name': c['name'], 'type': c['type'], 'pk': bool(c['pk'])} for c in cols],
        })
    return jsonify(result)


@app.route('/api/db/query', methods=['POST'])
def db_query():
    data = request.get_json()
    table = data.get('table', '')
    limit = min(int(data.get('limit', 100)), 500)
    offset = int(data.get('offset', 0))
    order = data.get('order', '')
    direction = 'DESC' if data.get('desc') else 'ASC'
    search = data.get('search', '').strip()
    sql_raw = data.get('sql', '').strip()

    db = get_db()

    if sql_raw:
        sql_lower = sql_raw.lower().strip()
        if not sql_lower.startswith('select'):
            return jsonify({'error': 'SELECT 쿼리만 실행할 수 있습니다'}), 400
        try:
            rows = db.execute(sql_raw).fetchall()
            if not rows:
                return jsonify({'columns': [], 'rows': [], 'total': 0})
            columns = rows[0].keys()
            return jsonify({
                'columns': list(columns),
                'rows': [dict(r) for r in rows[:500]],
                'total': len(rows),
            })
        except Exception as e:
            return jsonify({'error': str(e)}), 400

    if not table:
        return jsonify({'error': 'table 필요'}), 400

    where = ''
    params = []
    if search:
        cols = db.execute(f'PRAGMA table_info([{table}])').fetchall()
        clauses = [f'CAST([{c["name"]}] AS TEXT) LIKE ?' for c in cols]
        where = 'WHERE ' + ' OR '.join(clauses)
        params = [f'%{search}%'] * len(cols)

    count_sql = f'SELECT COUNT(*) as c FROM [{table}] {where}'
    total = db.execute(count_sql, params).fetchone()['c']

    order_clause = f'ORDER BY [{order}] {direction}' if order else ''
    query = f'SELECT * FROM [{table}] {where} {order_clause} LIMIT ? OFFSET ?'
    rows = db.execute(query, params + [limit, offset]).fetchall()

    columns = []
    if rows:
        columns = list(rows[0].keys())
    else:
        cols = db.execute(f'PRAGMA table_info([{table}])').fetchall()
        columns = [c['name'] for c in cols]

    return jsonify({
        'columns': columns,
        'rows': [dict(r) for r in rows],
        'total': total,
    })


# ── 학생 CRUD ──

@app.route('/api/students', methods=['GET'])
def get_students():
    db = get_db()
    rows = db.execute('SELECT id, name FROM students ORDER BY created_at').fetchall()
    return jsonify(rows_to_list(rows))


@app.route('/api/students/add', methods=['POST'])
def add_student():
    data = request.get_json()
    name = data.get('name', '').strip()
    if not name:
        return jsonify({'error': '이름을 입력해주세요'}), 400
    db = get_db()
    if db.execute('SELECT id FROM students WHERE name=?', (name,)).fetchone():
        return jsonify({'error': '이미 존재하는 학생입니다'}), 400
    student_id = hashlib.md5(f'{name}_{date.today()}'.encode()).hexdigest()[:8]
    db.execute('INSERT INTO students (id, name) VALUES (?, ?)', (student_id, name))
    db.commit()
    return jsonify({'ok': True, 'id': student_id, 'name': name})


@app.route('/api/students/edit', methods=['POST'])
def edit_student():
    data = request.get_json()
    student_id = data.get('id', '')
    new_name = data.get('name', '').strip()
    if not new_name:
        return jsonify({'error': '이름을 입력해주세요'}), 400
    db = get_db()
    existing = db.execute(
        'SELECT id FROM students WHERE name=? AND id!=?', (new_name, student_id)
    ).fetchone()
    if existing:
        return jsonify({'error': '이미 존재하는 이름입니다'}), 400
    db.execute('UPDATE students SET name=? WHERE id=?', (new_name, student_id))
    db.commit()
    return jsonify({'ok': True})


@app.route('/api/students/delete', methods=['POST'])
def delete_student():
    data = request.get_json()
    student_id = data.get('id', '')
    db = get_db()
    db.execute('DELETE FROM sessions WHERE student_id=?', (student_id,))
    db.execute('DELETE FROM students WHERE id=?', (student_id,))
    db.commit()
    return jsonify({'ok': True})


# ── 과목 CRUD ──

@app.route('/api/subjects', methods=['GET'])
def get_subjects():
    db = get_db()
    rows = db.execute(
        'SELECT name, goal_minutes, color, done FROM subjects ORDER BY sort_order, id'
    ).fetchall()
    return jsonify([
        {'name': r['name'], 'goal_minutes': r['goal_minutes'],
         'color': r['color'], 'done': r['done']}
        for r in rows
    ])


@app.route('/api/subjects/add', methods=['POST'])
def add_subject():
    data = request.get_json()
    name = data.get('name', '').strip()
    goal = data.get('goal_minutes', 30)
    if not name:
        return jsonify({'error': '과목 이름을 입력해주세요'}), 400
    db = get_db()
    if db.execute('SELECT id FROM subjects WHERE name=?', (name,)).fetchone():
        return jsonify({'error': '이미 존재하는 과목입니다'}), 400
    count = db.execute('SELECT COUNT(*) as c FROM subjects').fetchone()['c']
    color = data.get('color', COLORS_12[count % len(COLORS_12)])
    db.execute(
        'INSERT INTO subjects (name, goal_minutes, color, sort_order) VALUES (?,?,?,?)',
        (name, goal, color, count),
    )
    db.commit()
    return jsonify({'ok': True})


@app.route('/api/subjects/delete', methods=['POST'])
def delete_subject():
    data = request.get_json()
    name = data.get('name', '')
    db = get_db()
    db.execute('DELETE FROM subjects WHERE name=?', (name,))
    db.commit()
    return jsonify({'ok': True})


@app.route('/api/subjects/edit', methods=['POST'])
def edit_subject():
    data = request.get_json()
    old_name = data.get('old_name', '')
    new_name = data.get('name', '').strip()
    goal = data.get('goal_minutes')
    color = data.get('color')
    db = get_db()
    target = new_name or old_name
    if new_name and new_name != old_name:
        if db.execute('SELECT id FROM subjects WHERE name=? AND name!=?',
                      (new_name, old_name)).fetchone():
            return jsonify({'error': '이미 존재하는 과목입니다'}), 400
        db.execute('UPDATE subjects SET name=? WHERE name=?', (new_name, old_name))
        db.execute('UPDATE sessions SET subject=? WHERE subject=?', (new_name, old_name))
        target = new_name
    if goal is not None:
        db.execute('UPDATE subjects SET goal_minutes=? WHERE name=?', (goal, target))
    if color is not None:
        db.execute('UPDATE subjects SET color=? WHERE name=?', (color, target))
    db.commit()
    return jsonify({'ok': True})


@app.route('/api/subjects/reorder', methods=['POST'])
def reorder_subjects():
    data = request.get_json()
    order = data.get('order', [])
    db = get_db()
    for i, name in enumerate(order):
        db.execute('UPDATE subjects SET sort_order=? WHERE name=?', (i, name))
    db.commit()
    return jsonify({'ok': True})


@app.route('/api/subjects/toggle_done', methods=['POST'])
def toggle_done():
    data = request.get_json()
    name = data.get('name', '')
    student_id = data.get('student_id', '')
    db = get_db()
    current = db.execute('SELECT done FROM subjects WHERE name=?', (name,)).fetchone()
    if not current:
        return jsonify({'error': '과목을 찾을 수 없습니다'}), 404

    if current['done'] != 0:
        db.execute('UPDATE subjects SET done=0 WHERE name=?', (name,))
        db.commit()
        return jsonify({'ok': True, 'done': 0, 'status': 'none'})

    study_sec = 0
    if student_id:
        row = db.execute(
            'SELECT COALESCE(SUM(duration_seconds),0) as total FROM sessions '
            'WHERE student_id=? AND subject=? AND date=?',
            (student_id, name, date.today().isoformat()),
        ).fetchone()
        study_sec = row['total']

    new_done = 1 if study_sec >= 600 else 2
    db.execute('UPDATE subjects SET done=? WHERE name=?', (new_done, name))
    db.commit()
    status = 'done' if new_done == 1 else 'skipped'
    return jsonify({'ok': True, 'done': new_done, 'status': status})


# ── 세션 API ──

@app.route('/api/sessions/save', methods=['POST'])
def save_session():
    data = request.get_json()
    student_id = data.get('student_id', '')
    if not student_id:
        return jsonify({'error': 'student_id가 필요합니다'}), 400

    today_str = date.today().isoformat()
    distractions = data.get('distractions', {})
    db = get_db()
    db.execute(
        'INSERT INTO sessions '
        '(student_id, subject, start_time, end_time, duration_seconds, pause_count, pause_seconds, '
        'distraction_seconds, distraction_phone, distraction_spacing, distraction_away, distraction_drowsy, date) '
        'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
        (student_id, data.get('subject', ''), data.get('start_time', ''),
         data.get('end_time', ''), data.get('duration_seconds', 0),
         data.get('pause_count', 0), data.get('pause_seconds', 0),
         data.get('distraction_seconds', 0),
         distractions.get('phone', 0), distractions.get('spacing', 0),
         distractions.get('away', 0), distractions.get('drowsy', 0),
         today_str),
    )
    db.commit()

    sessions = rows_to_list(db.execute(
        'SELECT subject, duration_seconds, pause_count, pause_seconds '
        'FROM sessions WHERE student_id=? AND date=?',
        (student_id, today_str),
    ).fetchall())
    record = {
        'subject': data.get('subject', ''),
        'duration_seconds': data.get('duration_seconds', 0),
        'pause_count': data.get('pause_count', 0),
    }
    return jsonify({'ok': True, 'comment': generate_comment(record, sessions)})


@app.route('/api/sessions/today', methods=['GET'])
def get_today_sessions():
    student_id = request.args.get('student_id', '')
    if not student_id:
        return jsonify([])
    db = get_db()
    rows = db.execute(
        'SELECT subject, start_time, end_time, duration_seconds, pause_count, pause_seconds, '
        'distraction_seconds, distraction_phone, distraction_spacing, distraction_away, distraction_drowsy '
        'FROM sessions WHERE student_id=? AND date=? ORDER BY start_time',
        (student_id, date.today().isoformat()),
    ).fetchall()
    return jsonify(rows_to_list(rows))


# ── 대시보드 API ──

@app.route('/api/dashboard', methods=['GET'])
def get_dashboard():
    days = int(request.args.get('days', 7))
    student_id = request.args.get('student_id', '')
    today_d = date.today()
    start_date = (today_d - timedelta(days=days - 1)).isoformat()
    db = get_db()

    subjects = [
        {'name': r['name'], 'goal_minutes': r['goal_minutes'],
         'color': r['color'], 'done': bool(r['done'])}
        for r in db.execute(
            'SELECT name, goal_minutes, color, done FROM subjects ORDER BY sort_order, id'
        ).fetchall()
    ]

    my_data = {}
    if student_id:
        for r in db.execute(
            'SELECT date, subject, '
            'SUM(duration_seconds) as study_sec, SUM(pause_seconds) as pause_sec, '
            'COUNT(*) as cnt, SUM(pause_count) as pcnt '
            'FROM sessions WHERE student_id=? AND date>=? GROUP BY date, subject',
            (student_id, start_date),
        ).fetchall():
            my_data.setdefault(r['date'], {})[r['subject']] = dict(r)

    daily = []
    for i in range(days):
        d = date.fromordinal(today_d.toordinal() - i)
        ds = d.isoformat()
        day = my_data.get(ds, {})
        total = sum(v['study_sec'] for v in day.values())
        total_pause = sum(v['pause_sec'] for v in day.values())
        by_subject = {}
        for subj_name, v in day.items():
            by_subject[subj_name] = {
                'study_seconds': v['study_sec'], 'pause_seconds': v['pause_sec'],
                'session_count': v['cnt'], 'pause_count': v['pcnt'],
            }
        daily.append({
            'date': ds,
            'total_study_seconds': total,
            'total_pause_seconds': total_pause,
            'total_elapsed_seconds': total + total_pause,
            'session_count': sum(v['cnt'] for v in day.values()),
            'by_subject': by_subject,
        })

    subject_summary = build_subject_summary(subjects, daily)

    td = daily[0]
    total_study = td['total_study_seconds']
    total_pause = td['total_pause_seconds']
    total_elapsed = td['total_elapsed_seconds']
    focus_rate = round(total_study / total_elapsed * 100) if total_elapsed > 0 else 0
    done_count = sum(1 for s in subject_summary if s['status'] == 'done')

    class_avg = calc_class_avg(db, start_date, subjects)

    return jsonify({
        'overview': {
            'today_study_seconds': total_study,
            'today_pause_seconds': total_pause,
            'today_elapsed_seconds': total_elapsed,
            'today_sessions': td['session_count'],
            'today_focus_rate': focus_rate,
            'subjects_done': done_count,
            'subjects_total': len(subjects),
            'week_total_seconds': sum(d['total_study_seconds'] for d in daily[:7]),
        },
        'subjects': subject_summary,
        'daily': list(reversed(daily)),
        'class_avg': class_avg,
    })


def build_subject_summary(subjects, daily):
    result = []
    for subj in subjects:
        name = subj['name']
        history = []
        for day in reversed(daily):
            ds = day['by_subject'].get(name, {})
            history.append({
                'date': day['date'],
                'study_seconds': ds.get('study_seconds', 0),
                'pause_seconds': ds.get('pause_seconds', 0),
                'session_count': ds.get('session_count', 0),
            })
        today_data = daily[0]['by_subject'].get(name, {})
        yesterday_data = daily[1]['by_subject'].get(name, {}) if len(daily) > 1 else {}
        today_min = today_data.get('study_seconds', 0) / 60
        yesterday_min = yesterday_data.get('study_seconds', 0) / 60
        goal = subj['goal_minutes']
        achievement_rate = round(today_min / goal * 100) if goal > 0 else 0
        change = round(today_min - yesterday_min)
        if yesterday_min > 0:
            change_pct = round((today_min - yesterday_min) / yesterday_min * 100)
        else:
            change_pct = 100 if today_min > 0 else 0
        week_total = sum(
            d['by_subject'].get(name, {}).get('study_seconds', 0) for d in daily[:7]
        )
        week_avg = round(week_total / min(len(daily), 7) / 60)
        result.append({
            'name': name, 'color': subj['color'], 'goal_minutes': goal,
            'today_study_minutes': round(today_min),
            'today_pause_minutes': round(today_data.get('pause_seconds', 0) / 60),
            'today_sessions': today_data.get('session_count', 0),
            'achievement_rate': min(achievement_rate, 100),
            'achievement_raw': achievement_rate,
            'change_minutes': change, 'change_percent': change_pct,
            'week_total_minutes': round(week_total / 60), 'week_avg_minutes': week_avg,
            'history': history,
            'status': ('done' if achievement_rate >= 100
                       else ('active' if today_min > 0 else 'idle')),
        })
    return result


def calc_class_avg(db, start_date, subjects):
    student_count = db.execute('SELECT COUNT(*) as c FROM students').fetchone()['c']
    result = {
        'class_size': student_count,
        'daily': {},
        'subject_daily': {s['name']: {} for s in subjects},
    }

    for r in db.execute('''
        SELECT date,
            ROUND(AVG(total_min)) as avg_study,
            ROUND(AVG(pause_min)) as avg_pause,
            ROUND(MAX(total_min)) as top_study,
            ROUND(MIN(total_min)) as bottom_study
        FROM (
            SELECT student_id, date,
                SUM(duration_seconds)/60.0 as total_min,
                SUM(pause_seconds)/60.0 as pause_min
            FROM sessions WHERE date >= ?
            GROUP BY student_id, date
        ) GROUP BY date
    ''', (start_date,)).fetchall():
        result['daily'][r['date']] = {
            'avg_study_minutes': int(r['avg_study'] or 0),
            'avg_pause_minutes': int(r['avg_pause'] or 0),
            'top_study_minutes': int(r['top_study'] or 0),
            'bottom_study_minutes': int(r['bottom_study'] or 0),
        }

    for r in db.execute('''
        SELECT subject, date,
            ROUND(AVG(subj_min)) as avg_study,
            ROUND(MAX(subj_min)) as top_study
        FROM (
            SELECT student_id, subject, date,
                SUM(duration_seconds)/60.0 as subj_min
            FROM sessions WHERE date >= ?
            GROUP BY student_id, subject, date
        ) GROUP BY subject, date
    ''', (start_date,)).fetchall():
        subj = r['subject']
        if subj in result['subject_daily']:
            result['subject_daily'][subj][r['date']] = {
                'avg_study_minutes': int(r['avg_study'] or 0),
                'top_study_minutes': int(r['top_study'] or 0),
            }

    return result


@app.route('/api/stats', methods=['GET'])
def get_stats():
    days = int(request.args.get('days', 7))
    student_id = request.args.get('student_id', '')
    today_d = date.today()
    if not student_id:
        return jsonify([])
    db = get_db()
    daily = []
    for i in range(days):
        d = date.fromordinal(today_d.toordinal() - i)
        ds = d.isoformat()
        rows = db.execute(
            'SELECT subject, SUM(duration_seconds) as dur, '
            'SUM(pause_seconds) as pause, COUNT(*) as cnt '
            'FROM sessions WHERE student_id=? AND date=? GROUP BY subject',
            (student_id, ds),
        ).fetchall()
        total = sum(r['dur'] for r in rows)
        total_pause = sum(r['pause'] for r in rows)
        daily.append({
            'date': ds, 'total_seconds': total,
            'by_subject': {r['subject']: r['dur'] for r in rows},
            'session_count': sum(r['cnt'] for r in rows),
            'total_pause_seconds': total_pause,
            'pause_by_subject': {r['subject']: r['pause'] for r in rows},
        })
    return jsonify(daily)


def generate_comment(session, all_today):
    duration = session.get('duration_seconds', 0)
    subject = session.get('subject', '')
    pause_count = session.get('pause_count', 0)
    total_today = sum(s.get('duration_seconds', 0) for s in all_today)
    lines = []
    if duration >= 3600:
        lines.append(f'대단해! {subject} 1시간 이상 집중했어!')
    elif duration >= 1800:
        lines.append(f'{subject} 30분 넘게 공부했어, 잘하고 있어!')
    elif duration >= 600:
        lines.append(f'{subject} 10분 공부 완료! 조금씩 늘려보자.')
    else:
        lines.append(f'{subject} 짧게 공부했네. 다음엔 좀 더 해보자!')
    if pause_count == 0:
        lines.append('한 번도 안 쉬고 집중했네, 멋져!')
    elif pause_count <= 2:
        lines.append(f'일시정지 {pause_count}번, 적당한 휴식이야.')
    else:
        lines.append(f'일시정지가 {pause_count}번이야. 집중이 좀 어려웠나?')
    if total_today >= 7200:
        lines.append(f'오늘 총 {total_today // 60}분 공부! 충분히 노력했어!')
    elif total_today >= 3600:
        lines.append(f'오늘 총 {total_today // 60}분. 좋은 페이스야!')
    return ' '.join(lines)


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5055))
    app.run(debug=True, host='0.0.0.0', port=port)
