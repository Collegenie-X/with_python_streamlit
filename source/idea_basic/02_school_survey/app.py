"""
아이디어 ② 우리 학교 설문 리서치 툴 - 메인 페이지 예시
- 히어로 섹션에 서비스 소개 + 현재 응답 수 노출
- 탭으로 "응답하기 / 결과보기" 페이지 구분
"""
import streamlit as st
import pandas as pd

st.set_page_config(page_title="급식 만족도 설문", page_icon="🏫", layout="wide")

if "responses" not in st.session_state:
    st.session_state.responses = []

with st.sidebar:
    st.markdown("### 🏫 우리 학교 리서치 툴")
    st.caption("진짜 궁금한 걸 직접 조사해요")
    st.metric("누적 응답 수", len(st.session_state.responses))
    st.divider()
    st.write("설문에 참여한 뒤, '결과 보기' 탭에서 실시간 통계를 확인해보세요.")

st.title("🏫 우리 학교 급식 만족도 설문")
st.caption("우리 반이 만든 진짜 학교 리서치 프로젝트")
st.divider()

tab1, tab2 = st.tabs(["📝 설문 응답하기", "📊 결과 보기"])

with tab1:
    st.subheader("설문에 참여해주세요")
    st.write("아래 3가지 질문에 답하면 우리 학교 급식 만족도 데이터가 쌓입니다.")

    with st.form("survey_form", clear_on_submit=True):
        grade = st.selectbox("학년", ["1학년", "2학년", "3학년"])
        score = st.slider("급식 만족도 (1~5점)", 1, 5, 3)
        comment = st.text_input("한 줄 의견 (선택)")
        submitted = st.form_submit_button("제출하기", use_container_width=True)

        if submitted:
            st.session_state.responses.append(
                {"학년": grade, "만족도": score, "의견": comment}
            )
            st.success("응답이 저장되었습니다! '결과 보기' 탭에서 확인해보세요 🙌")

with tab2:
    st.subheader("실시간 결과")
    if st.session_state.responses:
        df = pd.DataFrame(st.session_state.responses)

        col1, col2, col3 = st.columns(3)
        col1.metric("전체 응답 수", len(df))
        col2.metric("평균 만족도", f"{df['만족도'].mean():.1f}점")
        col3.metric("최고 만족 학년", df.groupby("학년")["만족도"].mean().idxmax())

        st.subheader("학년별 평균 만족도")
        st.bar_chart(df.groupby("학년")["만족도"].mean())

        with st.expander("전체 응답 데이터 보기"):
            st.dataframe(df, use_container_width=True)
    else:
        st.info("아직 응답이 없습니다. '설문 응답하기' 탭에서 첫 응답을 남겨보세요!")
