import json
import os
from datetime import datetime, date
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
SUBJECTS_FILE = os.path.join(DATA_DIR, 'subjects.json')
SESSIONS_DIR = os.path.join(DATA_DIR, 'sessions')

os.makedirs(SESSIONS_DIR, exist_ok=True)


def load_subjects():
    if not os.path.exists(SUBJECTS_FILE):
        return []
    with open(SUBJECTS_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_subjects(subjects):
    with open(SUBJECTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(subjects, f, ensure_ascii=False, indent=2)


def today_file():
    return os.path.join(SESSIONS_DIR, f'{date.today().isoformat()}.json')


def load_today_sessions():
    path = today_file()
    if not os.path.exists(path):
        return []
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_today_sessions(sessions):
    with open(today_file(), 'w', encoding='utf-8') as f:
        json.dump(sessions, f, ensure_ascii=False, indent=2)


def load_sessions_for_date(d):
    path = os.path.join(SESSIONS_DIR, f'{d}.json')
    if not os.path.exists(path):
        return []
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


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
    color = data.get('color', '#9C27B0')
    if not name:
        return jsonify({'error': '과목 이름을 입력해주세요'}), 400

    subjects = load_subjects()
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
        daily.append({
            'date': d.isoformat(),
            'total_seconds': total,
            'by_subject': by_subject,
            'session_count': len(sessions),
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
    app.run(debug=True, port=port)
