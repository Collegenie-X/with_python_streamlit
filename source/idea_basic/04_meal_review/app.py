"""
아이디어 ④ 급식 별점 & 리뷰판 - 메인 페이지 예시
- 상단 요약 지표(오늘 등록된 리뷰 수, 평균 별점)
- 입력 폼 + 카드형 리뷰 목록으로 "게시판" 형태 구성
"""
import streamlit as st

st.set_page_config(page_title="급식 별점 리뷰판", page_icon="🍱", layout="wide")

if "reviews" not in st.session_state:
    st.session_state.reviews = []

with st.sidebar:
    st.markdown("### 🍱 급식 리뷰판")
    st.caption("오늘 급식, 몇 점인가요?")
    st.write("메뉴별로 별점과 한줄 리뷰를 남기고 친구들과 함께 확인해보세요.")

st.title("🍱 오늘의 급식 별점")
st.caption("우리 반이 매기는 솔직한 급식 리뷰")

reviews = st.session_state.reviews
avg = sum(r["별점"] for r in reviews) / len(reviews) if reviews else 0

col1, col2 = st.columns(2)
col1.metric("등록된 리뷰 수", len(reviews))
col2.metric("평균 별점", f"{avg:.1f} / 5")

st.divider()

col_left, col_right = st.columns([1, 2])

with col_left:
    st.subheader("✍️ 리뷰 작성")
    with st.form("review_form", clear_on_submit=True):
        menu = st.text_input("메뉴 이름")
        rating = st.slider("별점", 1, 5, 5)
        review = st.text_area("한줄 리뷰")
        submitted = st.form_submit_button("등록하기", use_container_width=True)

        if submitted and menu:
            st.session_state.reviews.append(
                {"메뉴": menu, "별점": rating, "리뷰": review}
            )
            st.success("리뷰가 등록되었습니다!")
            st.rerun()

with col_right:
    st.subheader("📋 리뷰 목록")
    if reviews:
        for r in reversed(reviews):
            with st.container(border=True):
                st.write(f"**{r['메뉴']}**  {'⭐' * r['별점']}")
                st.caption(r["리뷰"] or "(리뷰 내용 없음)")
    else:
        st.info("아직 등록된 리뷰가 없습니다. 첫 리뷰를 남겨보세요!")
