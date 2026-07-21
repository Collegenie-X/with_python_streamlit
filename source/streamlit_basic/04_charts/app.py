import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

chart_data = pd.DataFrame(
    np.random.randn(20, 3),
    columns=["a", "b", "c"]
)

st.subheader("line_chart")
st.line_chart(chart_data)

st.subheader("bar_chart")
st.bar_chart(chart_data)

st.subheader("area_chart")
st.area_chart(chart_data)

st.subheader("matplotlib 예시")
fig, ax = plt.subplots()
ax.hist(np.random.randn(1000), bins=30)
st.pyplot(fig)
