import streamlit as st

with st.sidebar:
    st.header("설정")
    threshold = st.slider("임계값", 0, 100, 50)

col1, col2 = st.columns(2)
with col1:
    st.write("왼쪽 컬럼")
with col2:
    st.write("오른쪽 컬럼")

tab1, tab2 = st.tabs(["탭1", "탭2"])
with tab1:
    st.write("탭1 내용")
with tab2:
    st.write("탭2 내용")

with st.expander("자세히 보기"):
    st.write(f"현재 임계값: {threshold}")
