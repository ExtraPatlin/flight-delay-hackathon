#!/bin/bash

input="/workspaces/flight-delay-hackathon/data/flights.csv"
output="/workspaces/flight-delay-hackathon/data/flights_clean.csv"

# Write header
head -n 1 "$input" > "$output"

# Replace empty fields with zero in the rest of the file
tail -n +2 "$input" | awk -F',' '{
    for(i=1;i<=NF;i++) {
        if($i=="") $i=0
    }
    OFS=","; print $0
}' >> "$output"

echo "Cleansed data saved to $output"