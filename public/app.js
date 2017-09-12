var topScores = null;

const RecordScore = document.querySelector('#recordScoreForm');
RecordScore.addEventListener('submit', (e) => {
    e.preventDefault();
    const initials = RecordScore.querySelector('#initials').value;
    console.log(`initials: ${initials}`);
    const score = playerScore;
    console.log(`score: ${score}`);
    const difficulty = 'E';
    post('/record-score', { initials, score, difficulty }).then((response) => {
        getTopScores();
        recordScoreContainer.style.display = "none";
        gameState = GAME_STATE_CONTINUE;
    });
});

document.getElementById('cancelBtn').addEventListener('click', () => {
    recordScoreContainer.style.display = "none";
    gameState = GAME_STATE_CONTINUE;
});

function post (path, data) {
    return window.fetch(path, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}

function get(path) {
    return window.fetch(path, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}

function getTopScores() {
    get('/top-scores').then(function(response) {
        response.json().then(function(data) {
            topScores = data;
            console.log(data);
        })
    });
}

getTopScores();