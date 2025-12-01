import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# Configure API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# List available models
with open("models_list.txt", "w", encoding="utf-8") as f:
    f.write("Available Gemini models:\n")
    f.write("-" * 50 + "\n")
    for model in genai.list_models():
        if 'generateContent' in model.supported_generation_methods:
            f.write(f"Model: {model.name}\n")
            f.write(f"  Display Name: {model.display_name}\n")
            f.write(f"  Description: {model.description}\n")
            f.write("\n")
