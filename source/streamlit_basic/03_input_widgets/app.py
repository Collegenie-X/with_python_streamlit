import streamlit as st

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
    st.write(f"동의 여부: {agree}, 색깔: {option}, 과일: {options}")

if uploaded_file is not None:
    st.write(f"업로드한 파일 이름: {uploaded_file.name}")
