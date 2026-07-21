import time
import streamlit as st
import pandas as pd
import numpy as np


@st.cache_data
def load_data():
    time.sleep(2)  # 무거운 연산이라고 가정
    return pd.DataFrame(np.random.randn(1000, 3), columns=["a", "b", "c"])


st.write("최초 실행은 2초가 걸리지만, 이후에는 캐시된 결과를 즉시 반환합니다.")
df = load_data()
st.dataframe(df.head())
