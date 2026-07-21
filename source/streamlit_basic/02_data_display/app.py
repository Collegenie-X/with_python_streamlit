import streamlit as st
import pandas as pd

df = pd.DataFrame({
    "이름": ["철수", "영희", "민수"],
    "점수": [90, 85, 77]
})

st.subheader("dataframe (인터랙티브 테이블)")
st.dataframe(df)

st.subheader("table (정적 테이블)")
st.table(df)

st.subheader("json")
st.json({"a": 1, "b": 2})
