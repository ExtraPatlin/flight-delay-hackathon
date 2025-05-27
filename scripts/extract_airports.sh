#!/bin/bash

input="/workspaces/flight-delay-hackathon/data/flights_clean.csv"
output="/workspaces/flight-delay-hackathon/data/airports.csv"

# Write header
echo "airport_id,airport_name" > "$output"

# Extract unique airport ID and name pairs, skipping header
tail -n +2 "$input" | awk -F',' '{print $10 "," $11}' | sort | uniq >> "$output"

echo "Airport list saved to $output"