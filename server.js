const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors'); // Import the cors package

const app = express();

// Enable CORS for all origins or specific origin(s)
app.use(cors());

app.use(bodyParser.json()); // Parse JSON request bodies

// Database connection and routes (unchanged)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password', // Replace with your password
    database: 'impressIt',
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Your POST and GET routes
app.post('/api/dev', (req, res) => {
    const { currentFeeling, message, currentUrl } = req.body;

    const query = 'INSERT INTO dev (reaction, message, url) VALUES (?, ?, ?)';
    db.query(query, [currentFeeling, message, currentUrl], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error.');
        }
        res.status(201).send({ id: result.insertId });
    });
});

app.get('/api/dev', (req, res) => {
    db.query('SELECT * FROM dev', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error.');
        }
        res.status(200).send(results);
    });
});

function getDb() {
  fetch(dbEndpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': "*"
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Fetched data:', data);
      alert(JSON.stringify(data, null, 2));
    })
    .catch((error) => console.error('Error:', error));
}


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
