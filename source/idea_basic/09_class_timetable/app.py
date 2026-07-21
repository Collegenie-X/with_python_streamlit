"""
아이디어 ⑨ 우리 반 시간표 & 준비물 알리미 - 메인 페이지 예시
- 사이드바에 "오늘" 바로가기 + 요일 선택
- 준비물 체크리스트(checkbox)까지 추가한 완성형 화면
"""
import datetime
import streamlit as st

st.set_page_config(page_title="우리 반 시간표", page_icon="📅", layout="centered")

TIMETABLE = {
    "월요일": [("국어", "국어 교과서"), ("수학", "수학 익힘책"), ("체육", "체육복")],
    "화요일": [("영어", "영어 워크북"), ("과학", "과학 실험복"), ("음악", "리코더")],
    "수요일": [("역사", "역사 노트"), ("미술", "스케치북")],
    "목요일": [("국어", "국어 교과서"), ("사회", "사회 노트"), ("체육", "체육복")],
    "금요일": [("수학", "수학 익힘책"), ("영어", "영어 워크북"), ("창체", "여벌 옷")],
}

KOR_WEEKDAYS = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"]
today_name = KOR_WEEKDAYS[datetime.date.today().weekday()]

with st.sidebar:
    st.markdown("### 📅 우리 반 시간표")
    st.caption("오늘 준비물을 잊지 마세요!")
    if today_name in TIMETABLE and st.button(f"오늘({today_name})로 이동"):
        st.session_state.selected_day = today_name

if "selected_day" not in st.session_state:
    st.session_state.selected_day = today_name if today_name in TIMETABLE else "월요일"

st.title("📅 우리 반 시간표 & 준비물")

day = st.selectbox(
    "요일을 선택하세요",
    list(TIMETABLE.keys()),
    index=list(TIMETABLE.keys()).index(st.session_state.selected_day),
)
st.session_state.selected_day = day

st.divider()
st.subheader(f"📌 {day} 시간표")

for i, (subject, item) in enumerate(TIMETABLE[day], start=1):
    with st.container(border=True):
        col1, col2, col3 = st.columns([1, 3, 1])
        with col1:
            st.write(f"{i}교시")
        with col2:
            st.write(f"**{subject}** — 준비물: {item}")
        with col3:
            st.checkbox("챙김", key=f"{day}_{i}")
