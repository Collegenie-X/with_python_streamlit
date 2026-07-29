import json
import os
from datetime import datetime, date
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
STUDY_DATA_FILE = os.path.join(DATA_DIR, 'study_data.json')
COLORS_12 = [
    '#3b82f6', '#f97316', '#a855f7', '#22c55e', '#ef4444', '#06b6d4',
    '#eab308', '#ec4899', '#14b8a6', '#f43f5e', '#8b5cf6', '#84cc16',
]


def load_study_data():
    if not os.path.exists(STUDY_DATA_FILE):
        return {'subjects': [], 'class_avg': {}, 'sessions': {}}
    with open(STUDY_DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_study_data(data):
    with open(STUDY_DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def load_subjects():
    return load_study_data().get('subjects', [])


def save_subjects(subjects):
    data = load_study_data()
    data['subjects'] = subjects
    save_study_data(data)


def load_class_avg():
    return load_study_data().get('class_avg', {})


def load_today_sessions():
    today_key = date.today().isoformat()
    return load_study_data().get('sessions', {}).get(today_key, [])


def save_today_sessions(sessions):
    data = load_study_data()
    if 'sessions' not in data:
        data['sessions'] = {}
    data['sessions'][date.today().isoformat()] = sessions
    save_study_data(data)


def load_sessions_for_date(d):
    return load_study_data().get('sessions', {}).get(d, [])


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')



# ── 과목 API ──

@app.route('/api/subjects', methods=['GET'])
def get_subjects():
    return jsonify(load_subjects())


@app.route('/api/subjects/add', methods=['POST'])
def add_subject():
    data = request.get_json()
    name = data.get('name', '').strip()
    goal = data.get('goal_minutes', 30)
    if not name:
        return jsonify({'error': '과목 이름을 입력해주세요'}), 400

    subjects = load_subjects()
    default_color = COLORS_12[len(subjects) % len(COLORS_12)]
    color = data.get('color', default_color)
    if any(s['name'] == name for s in subjects):
        return jsonify({'error': '이미 존재하는 과목입니다'}), 400

    subjects.append({
        'name': name,
        'goal_minutes': goal,
        'color': color,
        'done': False,
    })
    save_subjects(subjects)
    return jsonify({'ok': True})


@app.route('/api/subjects/delete', methods=['POST'])
def delete_subject():
    data = request.get_json()
    name = data.get('name', '')
    subjects = load_subjects()
    subjects = [s for s in subjects if s['name'] != name]
    save_subjects(subjects)
    return jsonify({'ok': True})


@app.route('/api/subjects/edit', methods=['POST'])
def edit_subject():
    data = request.get_json()
    old_name = data.get('old_name', '')
    new_name = data.get('name', '').strip()
    goal = data.get('goal_minutes')
    color = data.get('color')

    subjects = load_subjects()
    for s in subjects:
        if s['name'] == old_name:
            if new_name and new_name != old_name:
                if any(x['name'] == new_name for x in subjects if x['name'] != old_name):
                    return jsonify({'error': '이미 존재하는 과목입니다'}), 400
                s['name'] = new_name
            if goal is not None:
                s['goal_minutes'] = goal
            if color is not None:
                s['color'] = color
            break
    save_subjects(subjects)
    return jsonify({'ok': True})


@app.route('/api/subjects/reorder', methods=['POST'])
def reorder_subjects():
    data = request.get_json()
    order = data.get('order', [])
    subjects = load_subjects()
    subject_map = {s['name']: s for s in subjects}
    reordered = [subject_map[name] for name in order if name in subject_map]
    remaining = [s for s in subjects if s['name'] not in order]
    save_subjects(reordered + remaining)
    return jsonify({'ok': True})


@app.route('/api/subjects/toggle_done', methods=['POST'])
def toggle_done():
    data = request.get_json()
    name = data.get('name', '')
    subjects = load_subjects()
    for s in subjects:
        if s['name'] == name:
            s['done'] = not s.get('done', False)
            break
    save_subjects(subjects)
    return jsonify({'ok': True})


# ── 세션(공부 기록) API ──

@app.route('/api/sessions/save', methods=['POST'])
def save_session():
    data = request.get_json()
    session_record = {
        'subject': data.get('subject', ''),
        'start_time': data.get('start_time', ''),
        'end_time': data.get('end_time', ''),
        'duration_seconds': data.get('duration_seconds', 0),
        'pause_count': data.get('pause_count', 0),
        'pause_seconds': data.get('pause_seconds', 0),
    }
    sessions = load_today_sessions()
    sessions.append(session_record)
    save_today_sessions(sessions)

    comment = generate_comment(session_record, sessions)
    return jsonify({'ok': True, 'comment': comment})


@app.route('/api/sessions/today', methods=['GET'])
def get_today_sessions():
    return jsonify(load_today_sessions())


@app.route('/api/stats', methods=['GET'])
def get_stats():
    days = int(request.args.get('days', 7))
    today = date.today()
    daily = []
    for i in range(days):
        d = date.fromordinal(today.toordinal() - i)
        sessions = load_sessions_for_date(d.isoformat())
        total = sum(s.get('duration_seconds', 0) for s in sessions)
        by_subject = {}
        for s in sessions:
            subj = s.get('subject', '기타')
            by_subject[subj] = by_subject.get(subj, 0) + s.get('duration_seconds', 0)
        total_pause = sum(s.get('pause_seconds', 0) for s in sessions)
        pause_by_subject = {}
        for s in sessions:
            subj = s.get('subject', '기타')
            pause_by_subject[subj] = pause_by_subject.get(subj, 0) + s.get('pause_seconds', 0)
        daily.append({
            'date': d.isoformat(),
            'total_seconds': total,
            'by_subject': by_subject,
            'session_count': len(sessions),
            'total_pause_seconds': total_pause,
            'pause_by_subject': pause_by_subject,
        })
    return jsonify(daily)


@app.route('/api/dashboard', methods=['GET'])
def get_dashboard():
    days = int(request.args.get('days', 7))
    today = date.today()
    subjects = load_subjects()

    daily = []
    for i in range(days):
        d = date.fromordinal(today.toordinal() - i)
        sessions = load_sessions_for_date(d.isoformat())
        total = sum(s.get('duration_seconds', 0) for s in sessions)
        total_pause = sum(s.get('pause_seconds', 0) for s in sessions)
        by_subject = {}
        for s in sessions:
            subj = s.get('subject', '기타')
            if subj not in by_subject:
                by_subject[subj] = {
                    'study_seconds': 0,
                    'pause_seconds': 0,
                    'session_count': 0,
                    'pause_count': 0,
                }
            by_subject[subj]['study_seconds'] += s.get('duration_seconds', 0)
            by_subject[subj]['pause_seconds'] += s.get('pause_seconds', 0)
            by_subject[subj]['session_count'] += 1
            by_subject[subj]['pause_count'] += s.get('pause_count', 0)
        daily.append({
            'date': d.isoformat(),
            'total_study_seconds': total,
            'total_pause_seconds': total_pause,
            'total_elapsed_seconds': total + total_pause,
            'session_count': len(sessions),
            'by_subject': by_subject,
        })

    subject_summary = []
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
        change_pct = round((today_min - yesterday_min) / yesterday_min * 100) if yesterday_min > 0 else (100 if today_min > 0 else 0)
        week_total = sum(d['by_subject'].get(name, {}).get('study_seconds', 0) for d in daily[:7])
        week_avg = round(week_total / min(len(daily), 7) / 60)

        subject_summary.append({
            'name': name,
            'color': subj['color'],
            'goal_minutes': goal,
            'today_study_minutes': round(today_min),
            'today_pause_minutes': round(today_data.get('pause_seconds', 0) / 60),
            'today_sessions': today_data.get('session_count', 0),
            'achievement_rate': min(achievement_rate, 100),
            'achievement_raw': achievement_rate,
            'change_minutes': change,
            'change_percent': change_pct,
            'week_total_minutes': round(week_total / 60),
            'week_avg_minutes': week_avg,
            'history': history,
            'status': 'done' if achievement_rate >= 100 else ('active' if today_min > 0 else 'idle'),
        })

    today_d = daily[0]
    total_study = today_d['total_study_seconds']
    total_pause = today_d['total_pause_seconds']
    total_elapsed = today_d['total_elapsed_seconds']
    focus_rate = round(total_study / total_elapsed * 100) if total_elapsed > 0 else 0
    done_count = sum(1 for s in subject_summary if s['status'] == 'done')

    class_avg = load_class_avg()

    return jsonify({
        'overview': {
            'today_study_seconds': total_study,
            'today_pause_seconds': total_pause,
            'today_elapsed_seconds': total_elapsed,
            'today_sessions': today_d['session_count'],
            'today_focus_rate': focus_rate,
            'subjects_done': done_count,
            'subjects_total': len(subjects),
            'week_total_seconds': sum(d['total_study_seconds'] for d in daily[:7]),
        },
        'subjects': subject_summary,
        'daily': list(reversed(daily)),
        'class_avg': class_avg,
    })


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
