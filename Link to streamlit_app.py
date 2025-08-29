# humminGhome_frontend.py
import streamlit as st
import requests

BACKEND_URL = "http://localhost:5000"  # Replace with your deployed backend URL

st.set_page_config(page_title="HumminGhome", page_icon="🛠️", layout="centered")
st.title("HumminGhome - Home Appliance Service Requests")

menu = ["Home", "Request Service", "View Requests", "About"]
choice = st.sidebar.selectbox("Menu", menu)

if choice == "Home":
    st.subheader("Welcome to HumminGhome 🏠🛠️")
    st.write("Easily request home appliance repair and services.")

elif choice == "Request Service":
    st.subheader("Create a New Service Request")
    name = st.text_input("Your Name")
    contact = st.text_input("Contact Number")
    appliance = st.selectbox("Appliance", ["Refrigerator", "Washing Machine", "Microwave", "AC", "Other"])
    issue = st.text_area("Describe the Issue")

    if st.button("Submit Request"):
        try:
            res = requests.post(f"{BACKEND_URL}/requests", json={
                "name": name,
                "contact": contact,
                "appliance": appliance,
                "issue": issue
            })
            if res.status_code == 201:
                st.success("✅ Service request submitted successfully!")
            else:
                st.error("Failed to submit request.")
        except Exception as e:
            st.error(f"Error: {e}")

elif choice == "View Requests":
    st.subheader("All Service Requests")
    try:
        res = requests.get(f"{BACKEND_URL}/requests")
        if res.status_code == 200:
            requests_data = res.json()
            if requests_data:
                for req in requests_data:
                    st.markdown(f"""
                    **Name:** {req.get('name','')}  
                    **Contact:** {req.get('contact','')}  
                    **Appliance:** {req.get('appliance','')}  
                    **Issue:** {req.get('issue','')}  
                    """)
            else:
                st.info("No requests found.")
        else:
            st.error("Could not fetch requests.")
    except Exception as e:
        st.error(f"Error: {e}")

elif choice == "About":
    st.subheader("About HumminGhome")
    st.write("HumminGhome is your free, easy-to-use home appliance service request platform.")
