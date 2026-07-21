"""
아이디어 ⑥ AI 과목 튜터 챗봇 - 메인 페이지 예시
- 사이드바에서 과목 선택 (메인 페이지처럼 설정을 분리)
- st.chat_input / st.chat_message로 채팅 UI 구성
- 실제 AI 연동 전, 규칙 기반 응답으로 프론트 흐름 먼저 체험
"""
import streamlit as st

st.set_page_config(page_title="과목 튜터 챗봇", page_icon="🤖", layout="centered")

SUBJECTS = {
    "수학": "안녕! 궁금한 수학 문제를 물어봐 😊",
    "영어": "Hi! 궁금한 영어 문법이나 단어를 물어봐 😊",
    "과학": "안녕! 궁금한 과학 개념을 물어봐 😊",
}

with st.sidebar:
    st.markdown("### 🤖 과목 튜터 챗봇")
    subject = st.selectbox("어떤 과목을 도와줄까요?", list(SUBJECTS.keys()))
    if st.button("대화 초기화"):
        st.session_state.pop("messages", None)
        st.rerun()
    st.caption("※ 지금은 규칙 기반 응답입니다. 실제 AI API를 연결하면 진짜 튜터가 됩니다.")

if "messages" not in st.session_state or st.session_state.get("subject") != subject:
    st.session_state.subject = subject
    st.session_state.messages = [{"role": "assistant", "content": SUBJECTS[subject]}]

st.title(f"🤖 {subject} 튜터 챗봇")
st.caption("궁금한 걸 편하게 물어보세요")
st.divider()

for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.write(msg["content"])

user_input = st.chat_input("질문을 입력하세요")

if user_input:
    st.session_state.messages.append({"role": "user", "content": user_input})
    with st.chat_message("user"):
        st.write(user_input)

    # TODO: 여기에 실제 AI API 호출 코드를 연결하면 됩니다.
    reply = f"'{user_input}'에 대해 같이 풀어볼까요? 먼저 어떤 부분이 어려운지 알려줘!"
    st.session_state.messages.append({"role": "assistant", "content": reply})
    with st.chat_message("assistant"):
        st.write(reply)
