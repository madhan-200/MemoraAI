import requests
import json

def test_enhance():
    url = "http://localhost:8000/enhance"
    payload = {"prompt": "weather"}
    
    try:
        print(f"Testing {url} with payload: {payload}")
        response = requests.post(url, json=payload)
        
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("Response:", json.dumps(response.json(), indent=2))
            print("✅ Enhance endpoint working!")
        else:
            print("Error Response:", response.text)
            print("❌ Enhance endpoint failed!")
            
    except Exception as e:
        print(f"❌ Connection failed: {e}")

if __name__ == "__main__":
    test_enhance()
