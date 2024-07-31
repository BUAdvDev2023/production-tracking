import requests
import json

BASE_URL = 'https://localhost:5273/api/v1'
API_KEY = 'your_api_key_here'

headers = {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json'
}

def test_get_shoe_models():
    response = requests.get(f'{BASE_URL}/shoe_models', headers=headers, verify=False)
    if response.status_code == 200:
        print("Successfully retrieved shoe models:")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Failed to retrieve shoe models. Status code: {response.status_code}")
        print(response.text)

def test_get_shoes():
    response = requests.get(f'{BASE_URL}/shoes', headers=headers, verify=False)
    if response.status_code == 200:
        print("Successfully retrieved shoes:")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Failed to retrieve shoes. Status code: {response.status_code}")
        print(response.text)

def test_api_key_authentication():
    # Test with correct API key
    response = requests.get(f'{BASE_URL}/shoe_models', headers=headers, verify=False)
    print(f"With correct API key - Status code: {response.status_code}")

    # Test with incorrect API key
    invalid_headers = headers.copy()
    invalid_headers['X-API-Key'] = 'invalid_key'
    response = requests.get(f'{BASE_URL}/shoe_models', headers=invalid_headers, verify=False)
    print(f"With incorrect API key - Status code: {response.status_code}")

if __name__ == '__main__':
    print("Testing Get Shoe Models:")
    test_get_shoe_models()
    print("\nTesting Get Shoes:")
    test_get_shoes()
    print("\nTesting API Key Authentication:")
    test_api_key_authentication()