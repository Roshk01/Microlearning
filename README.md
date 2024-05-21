
**Project Name: Micro-learning AI Powered Plateform**

**Description:**

This project builds an AI-powered microlearning platform leveraging FastAPI (Python backend), Node.js (frontend), and Hugging Face Transformers for NLP functionalities. It provides students and professionals with a personalized learning experience through concise, engaging content, and intelligent recommendations.

**Prerequisites:**

- Python 3.x ([https://www.python.org/downloads/](https://www.python.org/downloads/))
- Node.js and npm (or yarn) ([https://nodejs.org/](https://nodejs.org/))
- Git version control ([https://git-scm.com/](https://git-scm.com/))

**Installation:**

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Roshk01/Microlearning.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd micro_fastapi
   ```

3. **Create a virtual environment (recommended):**

   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/macOS
   .venv\Scripts\activate  # Windows
   ```

4. **Install backend dependencies:**

   ```bash
   pip install fastapi uvicorn[standard] transformers[all]  # Additional dependencies for Hugging Face models
   ```

5. **Install frontend dependencies (assuming a React frontend):**

   ```bash
   cd ui-master  # Navigate to your frontend directory
   npm install  # or yarn install
   ```

**Running the Project:**

**1. Backend (API):**

   - **Start the development server:**

     ```bash
     uvicorn app:app --reload  # Adjust "app:app" if your app module is named differently
     ```

   - **Access the API:**

     Open http://localhost:8000/docs in your web browser to explore the API documentation (OpenAPI/Swagger).

**2. Frontend:**

   - **Start the development server:**

     ```bash
     cd ui-master  # Navigate back to your frontend directory
     npm run dev  # or yarn dev
     ```

   - **Access the frontend:**

     Open http://localhost:3000 in your web browser to experience the user interface.

**Fetching Processes:**

The specific fetching processes will depend on your backend API design and frontend implementation. Here's a general outline:

**Backend:**

- Define routes for API endpoints (e.g., `/recommended-content`, `/get-content-summary`)
- Implement logic to retrieve and process data using FastAPI and transformers
- Return JSON responses with relevant content and potentially AI-generated summaries

**Frontend:**

- Integrate with the backend API using appropriate HTTP client libraries (e.g., Axios in React)
- Make API calls to fetch data based on user interactions and display relevant content
- Optionally, display summaries generated at the backend or implement client-side summarization using transformers

**Deployment:**

(Instructions will vary depending on your chosen deployment platform)

1. Build your backend application (if applicable).
2. Build your frontend application.
3. Push both codebases to your GitHub repository.
4. Configure your deployment platform (e.g., Heroku, AWS) to serve your backend and frontend applications.

