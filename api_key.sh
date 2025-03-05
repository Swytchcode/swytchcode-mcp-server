#!/bin/bash

# Define credentials
EMAIL="USERNAME"
PASSWORD="PASSWORD"
DEVICE="shell"

# Login and get JWT token
RESPONSE=$(curl --silent --location 'https://api.swytchcode.com/v1/login' \
--header 'Content-Type: application/json' \
--data-raw "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\", \"device\": \"$DEVICE\"}")

# Extract JWT token
JWT_TOKEN=$(echo $RESPONSE | jq -r '.data.session')

# Check if JWT token was retrieved
if [ "$JWT_TOKEN" == "null" ] || [ -z "$JWT_TOKEN" ]; then
    echo "Failed to retrieve JWT token."
    exit 1
fi

# Use JWT token to generate API key
API_RESPONSE=$(curl --silent --location 'https://api.swytchcode.com/v1/generate-api-key' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer $JWT_TOKEN")

# Extract API key
API_KEY=$(echo $API_RESPONSE | jq -r '.data.api_key')

# Check if API key was retrieved
if [ "$API_KEY" == "null" ] || [ -z "$API_KEY" ]; then
    echo "Failed to retrieve API key."
    exit 1
fi

# Output only the API key
echo "$API_KEY"