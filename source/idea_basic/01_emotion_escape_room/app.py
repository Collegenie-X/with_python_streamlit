"""
아이디어 ① 감정 방탈출 게임 - 메인 페이지 예시
- st.set_page_config로 앱 기본 설정
- 히어로 섹션 + 사이드바 소개로 "서비스 첫 화면"처럼 구성
- st.session_state로 방(화면) 전환, radio/button으로 선택지 처리
"""
import streamlit as st

st.set_page_config(page_title="감정 방탈출", page_icon="🚪", layout="centered")

with st.sidebar:
    st.markdown("### 🚪 감정 방탈출 게임")
    st.caption("v0.1 · 만든 사람: 1팀")
    st.write(
        "지금 내 감정을 선택하면, 그 감정에 어울리는 방으로 입장하는 "
        "텍스트 방탈출 게임입니다."
    )
    st.divider()
    st.markdown("**진행 방법**")
    st.markdown("1. 감정 선택\n2. 문 선택\n3. 엔딩 확인")

if "room" not in st.session_state:
    st.session_state.room = "start"

st.title("🚪 감정 방탈출 게임")
st.caption("당신의 감정이 스토리를 바꾼다")
st.divider()

# ---- 시작 화면 (메인 페이지) ----
if st.session_state.room == "start":
    st.subheader("낯선 방에서 눈을 떴다.")
    st.write("주위를 둘러보니 문이 하나 있고, 벽에는 작은 거울이 걸려 있다. 지금 기분이 어떤가요?")

    mood = st.radio(
        "지금 기분을 선택하세요",
        ["😊 설렘", "😨 불안", "😡 짜증"],
        horizontal=True,
    )

    col1, col2 = st.columns([3, 1])
    with col1:
        st.info("선택한 감정에 따라 이후 스토리가 달라집니다.")
    with col2:
        if st.button("입장하기 ▶", use_container_width=True):
            st.session_state.mood = mood
            st.session_state.room = "room1"
            st.rerun()

# ---- 첫 번째 방 ----
elif st.session_state.room == "room1":
    st.subheader(f"선택한 감정: {st.session_state.mood}")
    st.write("문이 두 개 있다. 어느 문으로 갈까?")

    col1, col2 = st.columns(2)
    with col1:
        with st.container(border=True):
            st.write("🚪 **왼쪽 문**")
            st.caption("희미한 빛이 새어 나온다")
            if st.button("왼쪽 문 선택", use_container_width=True):
                st.session_state.room = "ending"
                st.session_state.result = "왼쪽 문을 선택해 탈출 성공! 🎉"
                st.rerun()
    with col2:
        with st.container(border=True):
            st.write("🚪 **오른쪽 문**")
            st.caption("서늘한 바람이 느껴진다")
            if st.button("오른쪽 문 선택", use_container_width=True):
                st.session_state.room = "ending"
                st.session_state.result = "오른쪽 문을 선택해 함정에 빠졌다! 💥"
                st.rerun()

    if st.button("← 처음으로"):
        st.session_state.room = "start"
        st.rerun()

# ---- 엔딩 ----
elif st.session_state.room == "ending":
    st.subheader("🎬 엔딩")
    if "성공" in st.session_state.result:
        st.success(st.session_state.result)
        st.balloons()
    else:
        st.error(st.session_state.result)

    if st.button("🔁 다시 시작"):
        st.session_state.room = "start"
        st.rerun()
