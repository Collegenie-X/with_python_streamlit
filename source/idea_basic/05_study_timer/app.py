"""
아이디어 ⑤ 공부 타이머 & 집중 기록기 - 메인 페이지 예시
- 오늘의 요약 지표를 상단에 배치 (대시보드형 메인 화면)
- 버튼으로 시작/종료 상태를 전환하고 기록을 누적
"""
import time
import streamlit as st
import pandas as pd

st.set_page_config(page_title="공부 타이머", page_icon="⏱️", layout="wide")

if "records" not in st.session_state:
    st.session_state.records = []
if "running" not in st.session_state:
    st.session_state.running = False

with st.sidebar:
    st.markdown("### ⏱️ 공부 타이머")
    st.caption("오늘 얼마나 집중했나요?")
    st.write("과목과 목표 시간을 입력하고 시작/종료 버튼으로 공부 세션을 기록하세요.")

st.title("⏱️ 공부 타이머 & 집중 기록기")

records = st.session_state.records
total_minutes = sum(r["목표(분)"] for r in records)

col1, col2, col3 = st.columns(3)
col1.metric("오늘 세션 수", len(records))
col2.metric("누적 공부 시간", f"{total_minutes}분")
col3.metric("진행 상태", "🟢 진행 중" if st.session_state.running else "⚪️ 대기 중")

st.divider()

col_left, col_right = st.columns([1, 2])

with col_left:
    st.subheader("▶ 세션 시작")
    subject = st.text_input("과목 이름", value="수학")
    minutes = st.number_input("목표 시간(분)", min_value=1, max_value=120, value=25)

    start_col, stop_col = st.columns(2)
    with start_col:
        start = st.button("시작", disabled=st.session_state.running, use_container_width=True)
    with stop_col:
        stop = st.button("종료", disabled=not st.session_state.running, use_container_width=True)

    if start:
        st.session_state.running = True
        st.session_state.start_time = time.time()
        st.session_state.current_subject = subject
        st.session_state.current_minutes = minutes
        st.rerun()

    if stop and st.session_state.running:
        st.session_state.running = False
        st.session_state.records.append(
            {"과목": st.session_state.current_subject, "목표(분)": st.session_state.current_minutes}
        )
        st.success("기록이 저장되었습니다!")
        st.rerun()

    if st.session_state.running:
        st.info(f"'{st.session_state.current_subject}' 공부 진행 중입니다...")

with col_right:
    st.subheader("📊 오늘의 기록")
    if records:
        df = pd.DataFrame(records)
        st.bar_chart(df.groupby("과목")["목표(분)"].sum())
        st.dataframe(df, use_container_width=True)
    else:
        st.info("아직 기록이 없습니다. 세션을 시작해보세요!")
