const express = require('express')
const bodyParser = require('body-parser')
const store = require('./store')
const app = express()

app.use(express.static('public'))
app.use(bodyParser.json())

app.post('/record-score', (req, res) => {
    store
    .insertScore({
        initials: req.body.initials,
        score: req.body.score,
        difficulty: req.body.difficulty
    })
    .then(() => res.sendStatus(200))
})

app.get('/top-scores', (req, res) => {
    store
    .getTopScores()
    .then((resp) => {
        console.log(JSON.stringify(resp[0]))
        res.send(resp[0])
    })
})

app.listen(8080, () => {
    console.log('Server running on http://localhost:8080')
})