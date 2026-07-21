# Streamlit 사용법과 기본 함수

Streamlit은 파이썬 코드만으로 웹 앱(대시보드, 데이터 시각화 도구 등)을 빠르게 만들 수 있는 프레임워크입니다.

## 1. 설치 및 실행

```bash
pip install streamlit
```

앱 실행:

```bash
streamlit run app.py
```

`app.py`를 저장할 때마다 브라우저가 자동으로 새로고침됩니다.

---

## 2. 텍스트 출력

```python
import streamlit as st

st.title("나의 첫 Streamlit 앱")
st.header("헤더입니다")
st.subheader("서브헤더입니다")
st.text("일반 텍스트입니다")
st.write("write는 거의 모든 것을 출력할 수 있습니다: 텍스트, 숫자, 데이터프레임 등")
st.markdown("**마크다운**도 지원합니다 :sunglasses:")
```

---

## 3. 데이터 표시

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    "이름": ["철수", "영희", "민수"],
    "점수": [90, 85, 77]
})

st.dataframe(df)        # 인터랙티브 테이블
st.table(df)             # 정적 테이블
st.json({"a": 1, "b": 2})
```

---

## 4. 사용자 입력 위젯

```python
name = st.text_input("이름을 입력하세요")
age = st.number_input("나이를 입력하세요", min_value=0, max_value=120)
agree = st.checkbox("동의합니다")
option = st.selectbox("좋아하는 색깔", ["빨강", "초록", "파랑"])
options = st.multiselect("좋아하는 과일", ["사과", "바나나", "포도"])
score = st.slider("점수", 0, 100, 50)
clicked = st.button("제출")
uploaded_file = st.file_uploader("파일을 업로드하세요")

if clicked:
    st.write(f"{name}님, 안녕하세요! 나이: {age}, 점수: {score}")
```

---

## 5. 차트/그래프

```python
chart_data = pd.DataFrame(
    np.random.randn(20, 3),
    columns=["a", "b", "c"]
)

st.line_chart(chart_data)
st.bar_chart(chart_data)
st.area_chart(chart_data)

# matplotlib 예시
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.hist(np.random.randn(1000), bins=30)
st.pyplot(fig)
```

---

## 6. 레이아웃 구성

```python
# 사이드바
with st.sidebar:
    st.header("설정")
    threshold = st.slider("임계값", 0, 100, 50)

# 컬럼 분할
col1, col2 = st.columns(2)
with col1:
    st.write("왼쪽 컬럼")
with col2:
    st.write("오른쪽 컬럼")

# 탭
tab1, tab2 = st.tabs(["탭1", "탭2"])
with tab1:
    st.write("탭1 내용")
with tab2:
    st.write("탭2 내용")

# 확장 가능한 섹션
with st.expander("자세히 보기"):
    st.write("여기에 숨겨진 내용이 표시됩니다")
```

---

## 7. 상태 유지 (Session State)

Streamlit은 상호작용마다 스크립트를 처음부터 다시 실행하므로, 값을 유지하려면 `st.session_state`를 사용합니다.

```python
if "count" not in st.session_state:
    st.session_state.count = 0

def increment():
    st.session_state.count += 1

st.button("증가", on_click=increment)
st.write(f"현재 카운트: {st.session_state.count}")
```

---

## 8. 캐싱으로 성능 최적화

```python
@st.cache_data
def load_data():
    return pd.read_csv("big_data.csv")

df = load_data()
```

- `@st.cache_data`: 데이터(반환값이 직렬화 가능한 경우) 캐싱
- `@st.cache_resource`: 모델, DB 연결 등 재사용 가능한 리소스 캐싱

---

## 9. 상태 메시지

```python
st.success("성공했습니다!")
st.error("오류가 발생했습니다.")
st.warning("주의하세요.")
st.info("참고 정보입니다.")

with st.spinner("처리 중..."):
    import time
    time.sleep(2)
st.balloons()  # 축하 애니메이션
```

---

## 10. 간단한 예제 전체 코드

```python
import streamlit as st
import pandas as pd
import numpy as np

st.title("간단한 데이터 대시보드")

with st.sidebar:
    n = st.slider("데이터 개수", 10, 200, 50)

data = pd.DataFrame({
    "x": np.arange(n),
    "y": np.random.randn(n).cumsum()
})

st.subheader("데이터 미리보기")
st.dataframe(data.head())

st.subheader("차트")
st.line_chart(data.set_index("x"))

if st.button("풍선 터뜨리기"):
    st.balloons()
```

---

## 참고
- 공식 문서: https://docs.streamlit.io
- Cheat Sheet: https://docs.streamlit.io/library/cheatsheet
