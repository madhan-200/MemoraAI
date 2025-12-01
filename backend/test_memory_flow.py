import requests
import json
import time

BASE_URL = "http://localhost:8000"
USER_ID = "test_user_memory_check"

def print_step(step, message):
    print(f"\n[{step}] {message}")
    print("-" * 50)

def chat(message):
    url = f"{BASE_URL}/chat"
    data = {
        "message": message,
        "user_id": USER_ID,
        "memory_enabled": True
    }
    response = requests.post(url, json=data)
    return response.json()

def get_status():
    url = f"{BASE_URL}/status"
    response = requests.get(url, params={"user_id": USER_ID})
    return response.json()

def recall(query):
    url = f"{BASE_URL}/recall"
    data = {
        "query": query,
        "user_id": USER_ID,
        "limit": 5
    }
    response = requests.post(url, json=data)
    return response.json()

try:
    # Step 1: Check initial status
    print_step("1", "Checking initial memory count")
    initial_status = get_status()
    initial_count = initial_status.get("memory_count", 0)
    print(f"Initial memory count: {initial_count}")

    # Step 2: Store a memory
    fact = "My favorite color is purple and I love coding in Python."
    print_step("2", f"Sending message with memory-worthy content: '{fact}'")
    response = chat(fact)
    print(f"AI Response: {response.get('response')}")
    
    # Wait a bit for processing if needed (though it should be synchronous in this simple app)
    time.sleep(1)

    # Step 3: Check status again
    print_step("3", "Checking memory count after message")
    new_status = get_status()
    new_count = new_status.get("memory_count", 0)
    print(f"New memory count: {new_count}")
    
    if new_count > initial_count:
        print("SUCCESS: Memory count increased!")
    else:
        print("WARNING: Memory count did not increase.")

    # Step 4: Recall the memory
    query = "What is my favorite color?"
    print_step("4", f"Asking to recall: '{query}'")
    # We can use the chat endpoint to see if it uses the memory, or the recall endpoint directly
    
    # Direct recall check
    recall_result = recall(query)
    memories = recall_result.get("memories", [])
    print(f"Direct Recall Results: {len(memories)} memories found")
    for mem in memories:
        print(f"- {mem.get('content')}")

    # Chat check
    chat_response = chat(query)
    print(f"\nAI Chat Response to Query: {chat_response.get('response')}")
    used_memories = chat_response.get("memories_used", [])
    print(f"Memories used by AI: {len(used_memories)}")

    if any("purple" in m.get("content", "").lower() for m in memories):
        print("\nTEST PASSED: 'purple' was found in memories.")
    else:
        print("\nTEST FAILED: 'purple' was NOT found in memories.")

except Exception as e:
    print(f"\nERROR: Test failed with exception: {e}")
