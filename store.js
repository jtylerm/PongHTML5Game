const knex = require('knex')(require('./knexfile'))

module.exports = {
    insertScore ({ initials, score, difficulty }) {
        console.log(`Add score ${initials} ${score} ${difficulty}`)
        return knex.raw('INSERT INTO Leaderboard (initials, score, difficulty) ' +
                    'VALUES (?, ?, ?)', [initials, score, difficulty]
                );
    },

    getTopScores() {
        return knex.raw('SELECT * FROM Leaderboard ' +
                'ORDER BY score DESC ' +
                'LIMIT 10'
            );
    }
}


