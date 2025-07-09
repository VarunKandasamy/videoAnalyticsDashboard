#!/bin/bash

BASE_URL="http://127.0.0.1:5000"
USERNAME="testuser"
PASSWORD="testpass"
TODAY=$(date +%F)
BAD_DATE="not-a-date"
NON_EXISTENT_DATE="1999-01-01"
INVALID_ID="99999999"
TEST_FILE="video_sample.mp4"
EMPTY_FILE="empty_video.mp4"

# Setup
echo "FAKE VIDEO CONTENT" >"$TEST_FILE"
touch "$EMPTY_FILE"

echo "🔐 Logging in..."
TOKEN=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\", \"password\":\"$PASSWORD\"}" | jq -r .token)

if [[ "$TOKEN" == "null" || -z "$TOKEN" ]]; then
  echo "❌ Login failed. Make sure $USERNAME is registered."
  exit 1
fi
echo "✅ Token acquired: $TOKEN"

# -------------------------------
# ✅ UPLOAD ROUTES
# -------------------------------

echo -e "\n📁 TEST 1: Upload with valid file"
UPLOAD_RESPONSE=$(curl -s -X POST "$BASE_URL/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@$TEST_FILE")

echo "$UPLOAD_RESPONSE" | jq .
VIDEO_ID=$(echo "$UPLOAD_RESPONSE" | jq -r .video_id)

if [[ "$VIDEO_ID" == "null" || -z "$VIDEO_ID" ]]; then
  echo "❌ Upload failed. Aborting tests."
  exit 1
fi

echo -e "\n📁 TEST 2: Upload with missing file (should fail)"
curl -s -X POST "$BASE_URL/upload" \
  -H "Authorization: Bearer $TOKEN" | jq .

#echo -e "\n📁 TEST 3: Upload with empty filename (should fail)"
#curl -s -X POST "$BASE_URL/upload" \
#  -H "Authorization: Bearer $TOKEN" \
#  -F "file=@" | jq .

echo -e "\n📁 TEST 3: Upload empty file (should fail)"
curl -s -X POST "$BASE_URL/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@empty_video.mp4" | jq .

echo -e "\n📁 TEST 3.5: Upload with invalid -F syntax (simulate empty filename)"
curl -s -X POST "$BASE_URL/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@" 2>&1

echo -e "\n📁 TEST 4: Upload with no token (should fail)"
curl -s -X POST "$BASE_URL/upload" \
  -F "file=@$TEST_FILE" | jq .

echo -e "\n📁 TEST 5: Upload with invalid token (should fail)"
curl -s -X POST "$BASE_URL/upload" \
  -H "Authorization: Bearer invalid.token.here" \
  -F "file=@$TEST_FILE" | jq .

# -------------------------------
# ✅ GET VIDEOS ROUTE
# -------------------------------

echo -e "\n📅 TEST 6: Get videos with valid date"
curl -s -X GET "$BASE_URL/videos?date=$TODAY" \
  -H "Authorization: Bearer $TOKEN" | jq .

echo -e "\n📅 TEST 7: Get videos with missing date (should fail)"
curl -s -X GET "$BASE_URL/videos" \
  -H "Authorization: Bearer $TOKEN" | jq .

echo -e "\n📅 TEST 8: Get videos with bad date format (should fail)"
curl -s -X GET "$BASE_URL/videos?date=$BAD_DATE" \
  -H "Authorization: Bearer $TOKEN" | jq .

echo -e "\n📅 TEST 9: Get videos with no token (should fail)"
curl -s -X GET "$BASE_URL/videos?date=$TODAY" | jq .

echo -e "\n📅 TEST 10: Get videos with invalid token (should fail)"
curl -s -X GET "$BASE_URL/videos?date=$TODAY" \
  -H "Authorization: Bearer invalid.token.here" | jq .

# -------------------------------
# ✅ DOWNLOAD ROUTE
# -------------------------------

echo -e "\n📥 TEST 11: Download video with valid ID"
curl -s -X GET "$BASE_URL/download/$VIDEO_ID" \
  -H "Authorization: Bearer $TOKEN" \
  --output "downloaded_blob_$VIDEO_ID.mp4"
ls -lh "downloaded_blob_$VIDEO_ID.mp4"

echo -e "\n📥 TEST 12: Download with invalid ID (should fail)"
curl -s -X GET "$BASE_URL/download/$INVALID_ID" \
  -H "Authorization: Bearer $TOKEN" | jq .

echo -e "\n📥 TEST 13: Download with no token (should fail)"
curl -s -X GET "$BASE_URL/download/$VIDEO_ID" | jq .

echo -e "\n📥 TEST 14: Download with invalid token (should fail)"
curl -s -X GET "$BASE_URL/download/$VIDEO_ID" \
  -H "Authorization: Bearer invalid.token.here" | jq .

# -------------------------------
# ✅ DELETE ROUTE
# -------------------------------

echo -e "\n🗑 TEST 15: Delete video with valid ID"
curl -s -X DELETE "$BASE_URL/delete/$VIDEO_ID" \
  -H "Authorization: Bearer $TOKEN" | jq .

echo -e "\n🗑 TEST 16: Delete same video again (should fail)"
curl -s -X DELETE "$BASE_URL/delete/$VIDEO_ID" \
  -H "Authorization: Bearer $TOKEN" | jq .

echo -e "\n🗑 TEST 17: Delete with invalid ID (should fail)"
curl -s -X DELETE "$BASE_URL/delete/$INVALID_ID" \
  -H "Authorization: Bearer $TOKEN" | jq .

echo -e "\n🗑 TEST 18: Delete with no token (should fail)"
curl -s -X DELETE "$BASE_URL/delete/$VIDEO_ID" | jq .

echo -e "\n🗑 TEST 19: Delete with invalid token (should fail)"
curl -s -X DELETE "$BASE_URL/delete/$VIDEO_ID" \
  -H "Authorization: Bearer invalid.token.here" | jq .

# -------------------------------
# ✅ CLEANUP
# -------------------------------

rm -f "$TEST_FILE" "$EMPTY_FILE" "downloaded_blob_$VIDEO_ID.mp4"

echo -e "\n✅ ALL VIDEO ROUTE TESTS (BLOB) COMPLETE."
