# 📚 Study Timer — AI 공부 타이머

> Python + AI 바이브 코딩으로 만든 공부 시간 관리 웹앱

## 프로젝트 소개

Study Timer는 학생들이 과목별 공부 시간을 측정하고, 일별·주별 학습 통계를 대시보드로 확인할 수 있는 웹앱입니다. Flask(Python 웹 프레임워크)와 SQLite(경량 데이터베이스)를 사용하여 별도의 서버 설치 없이 내 컴퓨터에서 바로 실행할 수 있습니다.

---

## 📁 파일 구조

```
study-timer/
├── app.py                  ← 🚀 메인 서버 (이 파일을 실행합니다)
├── app_dashboard.py         ← 대시보드 전용 서버 (독립 실행용)
├── generate_dummy.py        ← 테스트용 더미 데이터 생성 스크립트
├── requirements.txt         ← 필요한 Python 패키지 목록
├── study-timer-dashboard.html ← 대시보드 단독 HTML 파일
│
├── templates/               ← HTML 화면 파일들 (Flask가 자동으로 읽음)
│   ├── index.html           ← 메인 타이머 화면
│   ├── dashboard.html       ← 학습 통계 대시보드
│   ├── db_viewer.html       ← DB 데이터 직접 조회 화면
│   ├── monitor.html         ← 학습 모니터링 화면
│   └── study-timer-dashboard.html
│
├── static/                  ← CSS/JS 파일들 (디자인과 동작)
│   ├── css/dashboard.css    ← 대시보드 스타일
│   └── js/dashboard.js      ← 대시보드 동작 로직
│
└── data/                    ← 데이터 저장 폴더 (자동 생성)
    ├── study.db             ← SQLite 데이터베이스 파일
    └── sessions/            ← 날짜별 세션 JSON 파일들
```

### 핵심 파일 설명

| 파일 | 역할 | 비유 |
|------|------|------|
| `app.py` | 서버 전체를 담당하는 메인 파일. API와 화면을 모두 제공 | 🏪 가게 전체를 운영하는 사장님 |
| `templates/*.html` | 사용자가 보는 화면(UI)을 담당 | 🖥️ 가게의 간판과 메뉴판 |
| `static/css/*.css` | 화면의 색상, 글꼴, 배치 등 디자인 | 🎨 가게 인테리어 |
| `static/js/*.js` | 버튼 클릭, 데이터 요청 등 동적 기능 | ⚙️ 가게의 자동문, 주문 시스템 |
| `data/study.db` | 공부 기록이 저장되는 데이터베이스 | 📦 가게 창고 (재고 보관) |
| `requirements.txt` | 이 프로젝트에 필요한 외부 패키지 목록 | 📋 재료 주문서 |
| `generate_dummy.py` | 테스트할 때 가짜 데이터를 만들어주는 도구 | 🧪 시식용 샘플 만들기 |

### 주요 페이지

| 주소 | 화면 | 설명 |
|------|------|------|
| `http://localhost:5055` | 메인 타이머 | 과목 선택 → 타이머 시작/정지/리셋 |
| `http://localhost:5055/dashboard` | 대시보드 | 일별·주별 공부 통계, 과목별 차트 |
| `http://localhost:5055/db` | DB 뷰어 | 저장된 데이터를 직접 조회·검색 |

---

## 🚀 실행 방법 (초보자용 가이드)

### STEP 1. Python 설치

Python은 이 프로젝트를 실행하는 프로그래밍 언어입니다. 컴퓨터에 Python이 없으면 코드를 실행할 수 없습니다.

1. [python.org](https://www.python.org/downloads/) 에 접속합니다.
2. **Download Python 3.x.x** 버튼을 클릭하여 다운로드합니다.
3. 설치 시 **반드시** ✅ `Add Python to PATH` 체크박스를 체크한 뒤 Install을 누릅니다.
4. 설치가 완료되면 터미널(또는 명령 프롬프트)을 열고 아래 명령어로 확인합니다:

```bash
python --version
```

> `Python 3.x.x` 처럼 버전이 표시되면 성공입니다.
> Mac에서는 `python3 --version`으로 확인할 수 있습니다.

### STEP 2. VS Code 설치

VS Code는 코드를 보고 편집할 수 있는 편집기입니다. 메모장보다 훨씬 편리합니다.

1. [code.visualstudio.com](https://code.visualstudio.com/) 에 접속합니다.
2. **Download** 버튼을 눌러 설치합니다.
3. 설치 후 VS Code를 열고, 왼쪽 확장(Extensions) 탭에서 **Python** 확장을 검색하여 설치합니다.

### STEP 3. 프로젝트 폴더로 이동

터미널(Mac) 또는 명령 프롬프트(Windows)를 열고, `cd` 명령어로 study-timer 폴더로 이동합니다.

> 💡 `cd`는 **C**hange **D**irectory의 약자로, "이 폴더로 이동해줘"라는 뜻입니다.

```bash
cd Documents/GitHub/with_python_streamlit/study-timer
```

> 📌 **VS Code에서 더 쉽게 하는 방법**: VS Code에서 `파일 → 폴더 열기`로 study-timer 폴더를 열면, 내장 터미널(`` Ctrl+` `` 또는 `터미널 → 새 터미널`)이 자동으로 해당 폴더에서 시작됩니다.

### STEP 4. 필요한 패키지 설치 (pip)

> 💡 `pip`는 Python의 **패키지 관리자**입니다. 앱스토어에서 앱을 설치하듯이, pip으로 Python 라이브러리를 설치합니다.

```bash
python -m pip install -r requirements.txt
```

```bash
python -m pip install flask
```

**이 명령어의 의미:**
| 부분 | 뜻 |
|------|-----|
| `python -m pip` | Python에 내장된 pip를 실행해줘 |
| `install` | 설치해줘 |
| `-r requirements.txt` | requirements.txt 파일에 적힌 목록을 읽어서 (`-r` = read) |

> 이 프로젝트는 `flask`만 필요합니다. Flask는 Python으로 웹 서버를 만드는 프레임워크입니다.

> ⚠️ Mac 사용자는 `python3 -m pip install -r requirements.txt`로 실행하세요.

### STEP 5. 서버 실행

```bash
python app.py
```

**이 명령어의 의미:**
| 부분 | 뜻 |
|------|-----|
| `python` | Python으로 |
| `app.py` | app.py 파일을 실행해줘 |

> ⚠️ Mac 사용자는 `python3 app.py`로 실행하세요.

실행하면 터미널에 아래와 같은 메시지가 나타납니다:

```
 * Running on http://0.0.0.0:5055
 * Debugger is active!
```

### STEP 6. 브라우저에서 확인

웹 브라우저(Chrome 등)를 열고 주소창에 입력합니다:

```
http://localhost:5055
```

> 💡 `localhost`는 "내 컴퓨터"를 뜻하고, `5055`는 서버가 열린 포트(문) 번호입니다.
> 즉, "내 컴퓨터의 5055번 문으로 접속해줘"라는 의미입니다.

🎉 **공부 타이머 화면이 나타나면 성공입니다!**

### 서버 종료

터미널에서 `Ctrl + C`를 누르면 서버가 종료됩니다.

---

## 📊 추가 기능: 테스트 데이터 생성

처음 실행하면 데이터가 비어 있습니다. 대시보드를 테스트해 보고 싶다면:

```bash
python generate_dummy.py
```

이 스크립트를 실행하면 가상의 학생과 공부 기록이 자동으로 생성되어 대시보드에서 차트와 통계를 확인할 수 있습니다.

> ⚠️ 기존 데이터가 삭제되고 새로 생성됩니다. 실제 데이터가 있다면 주의하세요.

---

## 🔧 문제가 생겼을 때

| 증상 | 해결 방법 |
|------|-----------|
| `python: command not found` | Python 설치 시 `Add to PATH`를 체크하지 않은 경우. Python을 재설치하고 체크해주세요. Mac은 `python3`으로 시도하세요. |
| `ModuleNotFoundError: No module named 'flask'` | Step 4의 pip install을 실행하지 않은 경우. `python -m pip install -r requirements.txt`를 실행하세요. |
| `Address already in use` | 이미 서버가 실행 중입니다. 터미널에서 `Ctrl+C`로 종료 후 다시 실행하세요. |
| 브라우저에 아무것도 안 나옴 | 주소가 `http://localhost:5055`인지 확인하세요. `https`가 아닌 `http`입니다. |

---
