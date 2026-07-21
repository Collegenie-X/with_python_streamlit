"""
아이디어 ⑧ 용돈 가계부 & 소비 분석 - 메인 페이지 예시
- 상단 요약 지표(총 지출, 이번 등록 건수) + 입력/분석 2단 레이아웃
"""
import streamlit as st
import pandas as pd

st.set_page_config(page_title="용돈 가계부", page_icon="💰", layout="wide")

if "expenses" not in st.session_state:
    st.session_state.expenses = []

with st.sidebar:
    st.markdown("### 💰 용돈 가계부")
    st.caption("이번 달 용돈, 어디에 썼을까?")
    budget = st.number_input("이번 달 용돈(원)", min_value=0, step=1000, value=50000)

expenses = st.session_state.expenses
total = sum(e["금액"] for e in expenses)

st.title("💰 용돈 가계부")

col1, col2, col3 = st.columns(3)
col1.metric("이번 달 용돈", f"{budget:,}원")
col2.metric("총 지출", f"{total:,}원")
col3.metric("남은 용돈", f"{budget - total:,}원", delta=f"{-total:,}원")

st.divider()

col_left, col_right = st.columns([1, 2])

with col_left:
    st.subheader("✍️ 지출 등록")
    with st.form("expense_form", clear_on_submit=True):
        category = st.selectbox("분류", ["간식", "교통", "문구", "취미", "기타"])
        amount = st.number_input("금액(원)", min_value=0, step=500)
        submitted = st.form_submit_button("추가하기", use_container_width=True)

        if submitted and amount > 0:
            st.session_state.expenses.append({"분류": category, "금액": amount})
            st.rerun()

with col_right:
    st.subheader("📊 소비 분석")
    if expenses:
        df = pd.DataFrame(expenses)
        st.bar_chart(df.groupby("분류")["금액"].sum())
        with st.expander("전체 지출 내역 보기"):
            st.dataframe(df, use_container_width=True)
    else:
        st.info("아직 지출 내역이 없습니다. 왼쪽에서 첫 지출을 등록해보세요!")
