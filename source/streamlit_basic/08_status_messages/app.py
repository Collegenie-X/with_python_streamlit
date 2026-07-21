import time
import streamlit as st

st.success("성공했습니다!")
st.error("오류가 발생했습니다.")
st.warning("주의하세요.")
st.info("참고 정보입니다.")

with st.spinner("처리 중..."):
    time.sleep(2)

if st.button("풍선 터뜨리기"):
    st.balloons()
