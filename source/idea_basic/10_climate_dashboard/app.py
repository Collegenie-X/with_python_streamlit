"""
아이디어 ⑩ 환경·기후 데이터 대시보드 - 메인 페이지 예시
- 사이드바를 대시보드 필터 패널로 구성
- 상단 지표 카드 + 차트 + 원본 데이터로 이어지는 대시보드형 메인 화면
"""
import streamlit as st
import pandas as pd
import numpy as np

st.set_page_config(page_title="환경 기록 대시보드", page_icon="🌍", layout="wide")

with st.sidebar:
    st.markdown("### 🌍 환경 기록 대시보드")
    st.caption("우리 반이 기록한 환경 데이터")
    days = st.slider("최근 며칠간 데이터를 볼까요?", 7, 60, 30)
    metric_choice = st.radio("주요 지표", ["평균 기온(°C)", "분리배출량(kg)"])

np.random.seed(0)
dates = pd.date_range(end=pd.Timestamp.today(), periods=days)
data = pd.DataFrame({
    "날짜": dates,
    "평균 기온(°C)": 20 + np.random.randn(days).cumsum() * 0.3,
    "분리배출량(kg)": np.random.randint(1, 10, size=days),
})

st.title("🌍 우리 반 환경 기록 대시보드")
st.caption(f"최근 {days}일간의 기록")

col1, col2, col3 = st.columns(3)
col1.metric("평균 기온", f"{data['평균 기온(°C)'].mean():.1f}°C")
col2.metric("총 분리배출량", f"{data['분리배출량(kg)'].sum()}kg")
col3.metric("기록 일수", f"{days}일")

st.divider()

st.subheader(f"{metric_choice} 추이")
st.line_chart(data.set_index("날짜")[metric_choice])

col_left, col_right = st.columns(2)
with col_left:
    st.subheader("기온 변화")
    st.line_chart(data.set_index("날짜")["평균 기온(°C)"])
with col_right:
    st.subheader("일별 분리배출량")
    st.bar_chart(data.set_index("날짜")["분리배출량(kg)"])

with st.expander("원본 데이터 보기"):
    st.dataframe(data, use_container_width=True)
