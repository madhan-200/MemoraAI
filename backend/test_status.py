import requests
import json

# Test the status endpoint
url = "http://localhost:8000/status"

try:
    response = requests.get(url, params={"user_id": "default_user"})
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
