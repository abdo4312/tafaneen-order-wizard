#!/usr/bin/env python3
"""
Backend API Testing Script
Tests all backend endpoints to ensure they are working properly
"""

import requests
import json
import sys
import os
from datetime import datetime

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return None

def test_backend_endpoints():
    """Test all backend API endpoints"""
    
    # Get the backend URL
    backend_url = get_backend_url()
    if not backend_url:
        print("❌ CRITICAL: Could not get backend URL from frontend/.env")
        return False
    
    api_url = f"{backend_url}/api"
    print(f"🔍 Testing backend at: {api_url}")
    
    all_tests_passed = True
    
    # Test 1: Root endpoint GET /api/
    print("\n1. Testing Root Endpoint GET /api/")
    try:
        response = requests.get(f"{api_url}/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "Hello World":
                print("✅ Root endpoint working correctly")
            else:
                print(f"❌ Root endpoint returned unexpected data: {data}")
                all_tests_passed = False
        else:
            print(f"❌ Root endpoint failed with status {response.status_code}")
            all_tests_passed = False
    except requests.exceptions.RequestException as e:
        print(f"❌ CRITICAL: Root endpoint connection failed: {e}")
        all_tests_passed = False
    
    # Test 2: POST /api/status
    print("\n2. Testing POST /api/status")
    try:
        test_data = {
            "client_name": "test_client_backend_verification"
        }
        response = requests.post(f"{api_url}/status", 
                               json=test_data, 
                               headers={"Content-Type": "application/json"},
                               timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "id" in data and "client_name" in data and "timestamp" in data:
                if data["client_name"] == test_data["client_name"]:
                    print("✅ POST /api/status working correctly")
                    created_id = data["id"]
                else:
                    print(f"❌ POST /api/status returned wrong client_name: {data}")
                    all_tests_passed = False
            else:
                print(f"❌ POST /api/status missing required fields: {data}")
                all_tests_passed = False
        else:
            print(f"❌ POST /api/status failed with status {response.status_code}: {response.text}")
            all_tests_passed = False
    except requests.exceptions.RequestException as e:
        print(f"❌ CRITICAL: POST /api/status connection failed: {e}")
        all_tests_passed = False
    
    # Test 3: GET /api/status
    print("\n3. Testing GET /api/status")
    try:
        response = requests.get(f"{api_url}/status", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print(f"✅ GET /api/status working correctly (returned {len(data)} records)")
                # Verify our test record is in the list
                found_test_record = False
                for record in data:
                    if record.get("client_name") == "test_client_backend_verification":
                        found_test_record = True
                        break
                if found_test_record:
                    print("✅ Test record found in status list - MongoDB persistence working")
                else:
                    print("⚠️  Test record not found in status list - possible MongoDB issue")
            else:
                print(f"❌ GET /api/status returned non-list data: {type(data)}")
                all_tests_passed = False
        else:
            print(f"❌ GET /api/status failed with status {response.status_code}: {response.text}")
            all_tests_passed = False
    except requests.exceptions.RequestException as e:
        print(f"❌ CRITICAL: GET /api/status connection failed: {e}")
        all_tests_passed = False
    
    # Test 4: CORS Configuration
    print("\n4. Testing CORS Configuration")
    try:
        # Test with OPTIONS request to check CORS headers
        response = requests.options(f"{api_url}/", timeout=10)
        cors_headers = {
            'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
            'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
            'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
        }
        
        if cors_headers['Access-Control-Allow-Origin'] == '*':
            print("✅ CORS properly configured - allows all origins")
        else:
            print(f"⚠️  CORS configuration: {cors_headers}")
            
    except requests.exceptions.RequestException as e:
        print(f"⚠️  Could not test CORS configuration: {e}")
    
    # Test 5: Backend Service Status
    print("\n5. Testing Backend Service Status")
    try:
        # Check if backend is responding at all
        response = requests.get(f"{api_url}/", timeout=5)
        if response.status_code == 200:
            print("✅ Backend service is running and responding")
        else:
            print(f"❌ Backend service responding with error status: {response.status_code}")
            all_tests_passed = False
    except requests.exceptions.RequestException as e:
        print(f"❌ CRITICAL: Backend service not responding: {e}")
        all_tests_passed = False
    
    return all_tests_passed

def main():
    print("🚀 Starting Backend API Tests")
    print("=" * 50)
    
    success = test_backend_endpoints()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 ALL BACKEND TESTS PASSED")
        return 0
    else:
        print("💥 SOME BACKEND TESTS FAILED")
        return 1

if __name__ == "__main__":
    sys.exit(main())