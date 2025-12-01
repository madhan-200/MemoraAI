import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key found: {bool(api_key)}")

try:
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash-exp",
        google_api_key=api_key,
        temperature=0.7
    )
    
    print("Sending request to Gemini...")
    response = llm.invoke([HumanMessage(content="Hello! Say 'I am working!' if you can hear me.")])
    print(f"Response: {response.content}")
    print("✓ Success!")
except Exception as e:
    print(f"✗ Error: {e}")
