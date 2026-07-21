"""
아이디어 ⑦ 나만의 플레이리스트 무드 추천기 - 메인 페이지 예시
- 히어로 섹션 + 조건 선택 폼 + 추천 결과/히스토리
- selectbox 조합으로 조건 분기
"""
import streamlit as st

st.set_page_config(page_title="무드 플레이리스트 추천기", page_icon="🎵", layout="centered")

PLAYLISTS = {
    ("신남", "맑음"): "여름 드라이브 K-pop 🚗",
    ("신남", "비"): "신나는 실내 댄스곡 💃",
    ("우울함", "비"): "잔잔한 감성 발라드 🌧️",
    ("우울함", "맑음"): "위로가 되는 인디 음악 🌤️",
    ("평온함", "흐림"): "로파이 힙합 카페 ☕",
    ("집중 필요", "맑음"): "공부용 인스트루멘탈 📚",
}

if "history" not in st.session_state:
    st.session_state.history = []

with st.sidebar:
    st.markdown("### 🎵 무드 플레이리스트")
    st.caption("기분 + 날씨로 오늘의 플레이리스트를 추천해요")
    st.metric("지금까지 추천받은 횟수", len(st.session_state.history))

st.title("🎵 오늘 기분에 맞는 플레이리스트")
st.write("기분과 날씨를 선택하면 딱 맞는 플레이리스트를 추천해드려요.")
st.divider()

col1, col2 = st.columns(2)
with col1:
    mood = st.selectbox("오늘 기분은?", ["신남", "우울함", "평온함", "집중 필요"])
with col2:
    weather = st.selectbox("오늘 날씨는?", ["맑음", "비", "흐림"])

if st.button("추천받기 🎧", use_container_width=True):
    result = PLAYLISTS.get((mood, weather), "잔잔한 플레이리스트 모음 🎶")
    st.session_state.history.append({"기분": mood, "날씨": weather, "추천": result})
    st.success(f"추천 플레이리스트: **{result}**")
    st.balloons()

if st.session_state.history:
    st.divider()
    st.subheader("📜 추천 히스토리")
    for h in reversed(st.session_state.history[-5:]):
        st.write(f"- {h['기분']} · {h['날씨']} → **{h['추천']}**")
