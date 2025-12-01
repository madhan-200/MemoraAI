import requests
import time

BASE_URL = "http://localhost:8000"
USER_ID = "test_user_toggle"

def chat(message, memory_enabled=True):
    url = f"{BASE_URL}/chat"
    data = {
        "message": message,
        "user_id": USER_ID,
        "memory_enabled": memory_enabled
    }
    response = requests.post(url, json=data)
    return response.json()

def get_status():
    url = f"{BASE_URL}/status"
    response = requests.get(url, params={"user_id": USER_ID})
    return response.json()

print("--- Testing Memory Toggle ---")

# 1. Store a fact with memory ENABLED
print("\n1. Storing fact (Memory ENABLED)...")
chat("My secret code is 12345.", memory_enabled=True)
time.sleep(1)

# 2. Try to recall with memory DISABLED
print("2. Asking for fact (Memory DISABLED)...")
response_disabled = chat("What is my secret code?", memory_enabled=False)
print(f"Response: {response_disabled.get('response')}")
used_memories_disabled = response_disabled.get("memories_used", [])
print(f"Memories used: {len(used_memories_disabled)}")

if len(used_memories_disabled) == 0:
    print("SUCCESS: No memories used when disabled.")
else:
    print("FAILURE: Memories were used even though disabled!")

# 3. Try to recall with memory ENABLED (Control check)
print("\n3. Asking for fact (Memory ENABLED)...")
response_enabled = chat("What is my secret code?", memory_enabled=True)
print(f"Response: {response_enabled.get('response')}")
used_memories_enabled = response_enabled.get("memories_used", [])
print(f"Memories used: {len(used_memories_enabled)}")

if len(used_memories_enabled) > 0:
    print("SUCCESS: Memories used when enabled.")
else:
    print("FAILURE: Memories NOT used when enabled.")
