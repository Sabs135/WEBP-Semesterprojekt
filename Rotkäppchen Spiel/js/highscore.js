// Quelle der Inspiration: https://github.com/jamesqquick/Build-A-Quiz-App-With-HTML-CSS-and-JavaScript/tree/master/8.%20Save%20High%20Scores%20in%20Local%20Storage

/* Def. der Konstanten. Username wid vermutlich obsolet - sollte ja übermittelt werden.  */
const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');  /* beachte game.js wo mostRecentStore 2x gesetzt wird: win & lose */
const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || []; /* wir schauen was in localstorage ist und geben das zurück, ODER wenn da nichts ist, soll ein leerer Array zurückkommen */

const MAX_HIGH_SCORES = 5; /* meine letzten X Highscores anzeigen */

finalScore.innerText = mostRecentScore; 

username.addEventListener('keyup', () => {
    /* Button ist disabled, wenn kein Username in Feld getippt wurde */
    saveScoreBtn.disabled = !username.value;  
});

saveHighScore = (e) => {
    e.preventDefault();     /* verhindert, dass es woanders hingepostet wird. Muss das evt weg bei API Post? */

    const score = {
        score: mostRecentScore,
        name: username.value,
    };
    highScores.push(score);  /* neuer Array hinzufügen */
   /*  console.log(highScores);   -->  braucht es nicht, aber so sah ich meine Versuche in Konsole */
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(5);  /* Nachdem sortiert wurde, wird alles was nicht in den Top 5 ist, weggeschnitten */

    localStorage.setItem('highScores', JSON.stringify(highScores));  /* Highscores updaten mit den Highscores */
};

/* Darstellung der Highscores "Name von Spieler:in" und "Score von Spieler:in", getrennt mit Bindestrich */
highScoresList.innerHTML = highScores
  .map(score => {
    return `<li class="high-score">${score.name} - ${score.score}</li>`;
  })
  .join("");