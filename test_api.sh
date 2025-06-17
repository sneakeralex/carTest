#!/bin/bash

# Test script for Car Management System API

echo "🚀 Starting Car Management System API Tests"
echo "============================================="

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Test 1: Health Check
echo ""
echo "📋 Test 1: Health Check"
echo "------------------------"
curl -s http://localhost:8080/api/health | jq '.' || echo "Health check failed"

# Test 2: Database Health Check
echo ""
echo "📋 Test 2: Database Health Check"
echo "--------------------------------"
curl -s http://localhost:8080/api/health/db | jq '.' || echo "Database health check failed"

# Test 3: Test Database Connection
echo ""
echo "📋 Test 3: Test Database Connection"
echo "-----------------------------------"
curl -s http://localhost:8080/api/test/db | jq '.' || echo "Database test failed"

# Test 4: Get All Users
echo ""
echo "📋 Test 4: Get All Users"
echo "------------------------"
curl -s http://localhost:8080/api/test/users | jq '.' || echo "Get users failed"

# Test 5: Get Specific User
echo ""
echo "📋 Test 5: Get Specific User (USR002)"
echo "-------------------------------------"
curl -s http://localhost:8080/api/test/users/USR002 | jq '.' || echo "Get specific user failed"

# Test 6: Test Login
echo ""
echo "📋 Test 6: Test Login"
echo "---------------------"
curl -s -X POST http://localhost:8080/api/test/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}' | jq '.' || echo "Login test failed"

echo ""
echo "✅ API Tests Completed!"
echo "======================="
