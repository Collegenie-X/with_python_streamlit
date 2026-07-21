"""
아이디어 ③ 취향 추천 테스트 (MBTI 스타일) - 메인 페이지 예시
- 시작 화면(랜딩) → 질문 진행 화면 → 결과 화면 3단계 구성
- st.progress로 진행률, 점수 합산으로 결과 유형 분기
"""
import streamlit as st

st.set_page_config(page_title="플레이리스트 추천 테스트", page_icon="🎧", layout="centered")

with st.sidebar:
    st.markdown("### 🎧 취향 추천 테스트")
    st.caption("나에게 맞는 플레이리스트를 찾아드려요")
    st.write("질문 3개에 답하면 당신의 취향에 맞는 플레이리스트를 추천합니다.")

QUESTIONS = [
    ("주말에 뭐 하는 걸 더 좋아하나요?", ["집에서 쉬기", "친구들과 놀기"]),
    ("좋아하는 노래 분위기는?", ["잔잔한 노래", "신나는 노래"]),
    ("공부할 때 음악을 듣나요?", ["집중 안 돼서 안 들음", "오히려 집중 잘 됨"]),
]

if "stage" not in st.session_state:
    st.session_state.stage = "start"       # start -> quiz -> result
    st.session_state.q_index = 0
    st.session_state.score = 0

st.title("🎧 나에게 맞는 플레이리스트 찾기")
st.divider()

# ---- 시작(랜딩) 화면 ----
if st.session_state.stage == "start":
    st.subheader("당신의 취향에 딱 맞는 플레이리스트를 찾아드릴게요")
    st.write("간단한 질문 3개면 충분해요. 솔직하게 답해주세요!")
    if st.button("테스트 시작하기 ▶", use_container_width=True):
        st.session_state.stage = "quiz"
        st.rerun()

# ---- 퀴즈 진행 화면 ----
elif st.session_state.stage == "quiz":
    idx = st.session_state.q_index
    st.progress(idx / len(QUESTIONS), text=f"{idx}/{len(QUESTIONS)} 문항")

    question, options = QUESTIONS[idx]
    st.subheader(f"Q{idx + 1}. {question}")
    choice = st.radio("선택하세요", options, key=f"q{idx}")

    if st.button("다음 →", use_container_width=True):
        if options.index(choice) == 1:
            st.session_state.score += 1
        st.session_state.q_index += 1
        if st.session_state.q_index >= len(QUESTIONS):
            st.session_state.stage = "result"
        st.rerun()

# ---- 결과 화면 ----
elif st.session_state.stage == "result":
    st.progress(1.0, text="완료!")
    st.subheader("🎉 테스트 결과")

    if st.session_state.score >= 2:
        st.success("당신의 추천 플레이리스트: **신나는 K-pop 모음** 🎶")
    else:
        st.success("당신의 추천 플레이리스트: **잔잔한 로파이 모음** ☕")
    st.balloons()

    if st.button("🔁 다시 하기", use_container_width=True):
        st.session_state.stage = "start"
        st.session_state.q_index = 0
        st.session_state.score = 0
        st.rerun()
