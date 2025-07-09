#!/bin/bash

BASE_URL="http://127.0.0.1:5000"
USERNAME="testuser"
PASSWORD="testpass"
BAD_PASSWORD="wrongpass"
NONEXISTENT_USER="ghostuser"

echo "🧼 Cleaning up..."
echo "You may need to manually drop the user in DB if already created."

echo -e "\n📥 Registering new user..."
curl -s -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\", \"password\":\"$PASSWORD\"}" |
  jq .

echo -e "\n📥 Trying to register the same user again (should fail)..."
curl -s -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\", \"password\":\"$PASSWORD\"}" |
  jq .

echo -e "\n🔐 Logging in with wrong password (should fail)..."
curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\", \"password\":\"$BAD_PASSWORD\"}" |
  jq .

echo -e "\n👻 Logging in with non-existent user (should fail)..."
curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$NONEXISTENT_USER\", \"password\":\"anypass\"}" |
  jq .

echo -e "\n✅ Logging in with correct credentials..."
TOKEN=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\", \"password\":\"$PASSWORD\"}" |
  jq -r .token)

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Login failed, token not received"
else
  echo -e "\n🎟️  Received token:"
  echo "$TOKEN"
fi

# (Optional) Use the token to access a protected route like /recordings or /me
# echo -e "\n🔒 Accessing protected route /me (replace with actual route)..."
# curl -s -X GET "$BASE_URL/me" \
#   -H "Authorization: Bearer $TOKEN" \
#   | jq .

echo -e "\n🏁 Done!"
