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

col1, col2 = st.columns(2)
with col1:
    st.metric("데이터 개수", n)
with col2:
    st.metric("최종 값", round(data["y"].iloc[-1], 2))

if st.button("풍선 터뜨리기"):
    st.balloons()
