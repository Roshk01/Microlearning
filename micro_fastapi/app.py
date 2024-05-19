from fastapi import FastAPI, Request, status
import time
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware  # Not available in 0.110.2
from fastapi.encoders import jsonable_encoder


# Import your functions (assuming they are in a separate file named 'functions.py')
from functions import preprocess_query, recommend_from_dataset, summarize_and_generate

app = FastAPI()

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response



# CORS Configuration (replace with your React app's origin)
origins = ["http://localhost:3000/chatRoom",
           "http://localhost:3000",
           "http://localhost"]  # Allowed origins (list format)
  # Allow cookies across origins (optional)

app.add_middleware(
    CORSMiddleware,
    allow_credentials = True,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Hugging Face summarization and text generation pipelines
summarizer = pipeline("summarization", model="facebook/bart-base")
text_generator = pipeline("text-generation", model="gpt2")

@app.post("/process_query")
async def process_query(query: str):
    """
    Process a user query, including preprocessing, recommendations, summarization, and text generation.
    """
    cleaned_query = preprocess_query(query)
    recommendations = recommend_from_dataset(cleaned_query)
    result = summarize_and_generate(query, recommendations)

    related_links_array = []
    for link in result["related_links"]:
        topic = link["topic"]
        links = link["link"].split(", ")
        related_links_array.append({"topic": topic, "links": links})

    response = {
        "query_summary": result["query_summary"],
        "creative_text": result["generated_text"],
        "related_links": related_links_array,
    }
    return response

# activate the enviroment and run the app.py file using uvicorn app:app --reload
