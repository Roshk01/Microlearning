from transformers import pipeline
from transformers import TrainingArguments, Trainer, AutoModelForSeq2SeqLM
from transformers import BartTokenizer, BartModel

tokenizer = BartTokenizer.from_pretrained('facebook/bart-base')
model = BartModel.from_pretrained('facebook/bart-base')

inputs = tokenizer("Hello, my dog is cute", return_tensors="pt")
outputs = model(**inputs)

last_hidden_states = outputs.last_hidden_state


# In[2]:

import pandas as pd
import pickle
import streamlit as st
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
import nltk
from nltk.stem.porter import PorterStemmer
from nltk.stem import WordNetLemmatizer
import re
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer


# In[47]:


data3 = pd.read_csv('micro_streamlit/final2.csv')


# In[5]:


data3.info()


# In[6]:


data3.head()


# In[9]:


data3['topic'] = data3.topic.astype("string")
data3['discription'] = data3.discription.astype("string")
data3['keyword'] = data3.keyword.astype("string")
data3['level'] = data3.level.astype("string")
data3.info()


# # Data Cleaning Process


# In[10]:


data3['tag'] = data3['discription'] + " " + data3['keyword'] +" " + data3['level']


# In[11]:


def remove_symbols(text):
  # Create a regular expression pattern to match unwanted symbols
    pattern = r'[^\w\s]'  # Matches characters that are not alphanumeric or whitespace
  # Substitute matched symbols with an empty string
    return re.sub(pattern, '', text.lower()) 


# In[12]:


data3['tag'] = data3['tag'].fillna('')
data3['tag'] = data3['tag'].apply(remove_symbols)
data3['level'] = data3['level'].apply(lambda x: x.replace(" ",""))
data3['keyword'] = data3['keyword'].fillna('')
data3.head()



# # Convert tag columns into vector 

# In[14]:


cv = CountVectorizer( max_features = 5000, stop_words = 'english')
vector = cv.fit_transform(data3['tag']).toarray()


# In[18]:


ps = PorterStemmer()


# In[30]:


def preprocess_query(query):
    
    # Lowercase the query
    cleaned_query = query.lower()

    # Remove punctuation (adjust as needed)
    import string
    punctuation = string.punctuation
    cleaned_query = ''.join([char for char in cleaned_query if char not in punctuation])

    # Remove stop words (optional, replace with your stop word list)
    stop_words = ["the", "a", "is", "in", "of"]
    cleaned_query = ' '.join([word for word in cleaned_query.split() if word not in stop_words])

    # Stemming
    ps = PorterStemmer()
    cleaned_query = ' '.join([ps.stem(word) for word in cleaned_query.split()])

    # Lemmatization
    wnl = WordNetLemmatizer()
    cleaned_query = ' '.join([wnl.lemmatize(word) for word in cleaned_query.split()])

    return cleaned_query



# In[31]:


# # Find Similarity score for finding most related topic from dataset

# In[24]:


similar = cosine_similarity(vector)


# In[27]:


# sorted(list(enumerate(similar[1])),reverse = True, key = lambda x: x[1])[0:5]


# In[29]:


summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
text_generator = pipeline("text-generation", model="gpt2", tokenizer="gpt2")


# In[34]:


documents = []
for index, row in data3.iterrows():
    topic_description = preprocess_query(row["topic"]) 
    keywords = preprocess_query(row["keyword"])  
    combined_text = f"{topic_description} {keywords}"  # Combine for TF-IDF
    documents.append(combined_text)


# In[35]:


# Create TF-IDF vectorizer
vectorizer = TfidfVectorizer()

# Fit the vectorizer on the documents
document_vectors = vectorizer.fit_transform(documents)

def recommend_from_dataset(query):
    
    cleaned_query = preprocess_query(query)
    query_vector = vectorizer.transform([cleaned_query])

    # Calculate cosine similarity between query and documents
    cosine_similarities = cosine_similarity(query_vector, document_vectors)
    similarity_scores = cosine_similarities.flatten()

    # Sort documents based on similarity scores
    sorted_results = sorted(zip(similarity_scores, data3.index, range(len(documents))), reverse=True)

    # Return top N recommendations with scores, topic names, and links (if available)
    top_n_results = sorted_results[:5]  
    recommendations = []
    for result in top_n_results:
        score = result[0]
        document_id = result[1]
        topic_name = data3.loc[document_id, "topic"]  
        link = data3.loc[document_id, "Links"] if "Links" in data3.columns else "No link available" 
        if score >= 0.3:
            recommendations.append({"topic_name": topic_name, "link": link})
    return recommendations


# In[36]:


# def fine_tune_model(model_name, train_dataset, validation_dataset, epochs=3):
#     # Load model and tokenizer
#     model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
#     tokenizer = AutoTokenizer.from_pretrained(model_name)

#     # Define training arguments (adjust parameters as needed)
#     training_args = TrainingArguments(
#         output_dir="./results",  # Adjust output directory
#         per_device_train_batch_size=8,
#         per_device_eval_batch_size=8,
#         num_train_epochs=epochs,
#         save_steps=10_000,
#     )

#     # Create a Trainer instance for fine-tuning
#     trainer = Trainer(
#         model=model,
#         args=training_args,
#         train_dataset=train_dataset,
#         eval_dataset=validation_dataset,
#         tokenizer=tokenizer,
#     )

#     # Train the model
#     trainer.train()

#     return model


# In[39]:


# train_dataset = ...  # Prepare your training dataset
# validation_dataset = ...  # Prepare your validation dataset

# # Fine-tune the model (replace model name if needed)
# fine_tuned_model = fine_tune_model("facebook/bart-base", train_dataset, validation_dataset)

# # Update summarization pipeline with the fine-tuned model
# summarizer1 = pipeline("text-generation", model=fine_tuned_model, tokenizer=fine_tuned_model.tokenizer)


# In[45]:


def summarize_and_generate(user_query, recommendations):
    
    # Summarize the user query
    query_summary = summarizer(user_query, max_length=200, truncation=True)[0]["summary_text"]

    # Generate creative text related to the query
    generated_text = text_generator(f"Exploring the concept of {user_query}", max_length=200, num_return_sequences=3)[0]["generated_text"]

    # Extract related links with scores
    related_links = []
    for recommendation in recommendations:
        related_links.append({"topic": recommendation["topic_name"], "link": recommendation["link"]})

    return {
        "query_summary": query_summary.strip(),
        "generated_text": generated_text.strip(),
        "related_links": related_links
      }



# In[46]:

# user_query = "java "
# recommendations = recommend_from_dataset(user_query)

# # Get the summary, generated text, and related links
# results = summarize_and_generate(user_query, recommendations)

# print(f"Query Summary: {results['query_summary']}")
# print(f"Creative Text: {results['generated_text']}")
# print("Related Links:")
# for link in results["related_links"]:
#   print(f"- {link['topic']}: {link['link']}")

# In[ ]:

