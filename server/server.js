const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = 3000;

function loadCSV(filePath) {
  return new Promise((resolve) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => results.push(row))
      .on('end', () => resolve(results));
  });
}

let airports = [];
let delayChances = [];
let maxTotalFlights = 1;

Promise.all([
  loadCSV(path.join(__dirname, '../data/airports.csv')).then(data => airports = data),
  loadCSV(path.join(__dirname, '../data/delay_chances.csv')).then(data => {
    delayChances = data;
    // Find the max total_flights for confidence calculation
    maxTotalFlights = Math.max(...delayChances.map(d => Number(d.total_flights)));
  })
]).then(() => {
  // Endpoint: Sorted list of airports
  app.get('/airports', (req, res) => {
    const sorted = airports
      .map(a => ({ airport_id: a.airport_id, airport_name: a.airport_name }))
      .sort((a, b) => a.airport_name.localeCompare(b.airport_name));
    res.json(sorted);
  });

  // Endpoint: Delay chance and confidence
  app.get('/delay-chance', (req, res) => {
    const { day_of_week, arrival_airport } = req.query;
    const result = delayChances.find(
      d => d.day_of_week === day_of_week && d.arrival_airport === arrival_airport
    );
    if (result) {
      const delay_chance = Number(result.delay_chance);
      const total_flights = Number(result.total_flights);
      const confidence = maxTotalFlights > 0 ? Math.round((total_flights / maxTotalFlights) * 100) : 0;
      res.json({
        delay_chance,
        confidence_percent: confidence
      });
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`API server running at http://0.0.0.0:${PORT}`);
  });
});