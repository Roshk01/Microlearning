import streamlit as st
import pickle
from functions import recommend_from_dataset,summarize_and_generate
resource = pickle.load(open("resource.pkl",'rb'))


st.title("Micro-Learning Dashboard")
st.subheader('Your Ultimate Study Partner', divider= "rainbow")
st.subheader('_AI is the_ :blue[Solution] :sunglasses:')


option = st.selectbox(
   "",
   resource['topic'],
   index=None,
   placeholder="Select contact Course...",
)

user_query = st.text_input("Or Manually Type Here...")

def display_output(text_summary, userinput):
    # Display the query summary and generated text
    st.write("Your Query:", userinput)
    st.write("Micro AI: ")
    st.write(text_summary['generated_text'])
    
    # Display the related links with their topics
    st.write("Related Links:")
    for link in text_summary["related_links"]:
        topic = link.get('topic', 'No topic available')
        link_value = link.get('link', 'No link available')
        if isinstance(link_value, str):
            st.write(topic + ":")
            for sub_link in link_value.split(", "):
                st.write("- " + sub_link)
        else:
            st.write(topic + ": Link not available")

# Define the behavior when the user clicks the Submit button
if st.button("Submit"):
    if user_query:
        recommendations = recommend_from_dataset(user_query)
        text_summary = summarize_and_generate(user_query, recommendations)
        display_output(text_summary,user_query)
    elif option:
        recommendations = recommend_from_dataset(option)
        text_summary = summarize_and_generate(option, recommendations)
        display_output(text_summary,option)
    else:
        st.write("Please select a course or enter a query.")