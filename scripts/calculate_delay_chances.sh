#!/bin/bash

input="/workspaces/flight-delay-hackathon/data/flights_clean.csv"
output="/workspaces/flight-delay-hackathon/data/delay_chances.csv"

# Write header
echo "day_of_week,arrival_airport,total_flights,delayed_flights,delay_chance" > "$output"

# Skip header, process data
tail -n +2 "$input" | \
awk -F',' '
{
    key = $4 "," $10
    total[key]++
    if ($18 == "1") delayed[key]++
}
END {
    for (k in total) {
        d = (delayed[k] ? delayed[k] : 0)
        chance = (total[k] > 0) ? d / total[k] : 0
        print k "," total[k] "," d "," chance
    }
}' >> "$output"

echo "Delay chances saved to $output"