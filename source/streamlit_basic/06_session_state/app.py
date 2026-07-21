import streamlit as st

if "count" not in st.session_state:
    st.session_state.count = 0


def increment():
    st.session_state.count += 1


st.button("증가", on_click=increment)
st.write(f"현재 카운트: {st.session_state.count}")
