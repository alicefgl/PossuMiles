const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

let scores = [];

// Endpoint to get scores
app.get('/scores', (req, res) => {
    res.json(scores);
});

// Endpoint to post a new score
app.post('/scores', (req, res) => {
    const newScore = req.body;
    scores.push(newScore);
    fs.writeFile('scores.json', JSON.stringify(scores), err => {
        if (err) {
            res.status(500).send('Error saving score');
        } else {
            res.status(200).send('Score saved');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
