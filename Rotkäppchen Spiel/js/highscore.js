// Quelle der Inspiration: https://github.com/jamesqquick/Build-A-Quiz-App-With-HTML-CSS-and-JavaScript/tree/master/8.%20Save%20High%20Scores%20in%20Local%20Storage

/* Def. der Konstanten. Username wid vermutlich obsolet - sollte ja übermittelt werden.  */
const username1 = document.getElementById('post_name'); /* TODO Sabrina evt anpassen wenn API angepasst */
const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = parseInt(localStorage.getItem('mostRecentScore'));  /* beachte game.js wo mostRecentStore 2x gesetzt wird: win & lose */
const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || []; /* wir schauen was in localstorage ist und geben das zurück, ODER wenn da nichts ist, soll ein leerer Array zurückkommen */
//-----------------
const level = 2 //einfach mal definiert, muss vermutlich level löschen im Swagger
const spieldurchlauf = 3 //einfach mal definiert, muss vermutlich spieldurchlauf löschen  im Swagger
//-----------------

const MAX_HIGH_SCORES = 5; /* meine letzten X Highscores anzeigen */

finalScore.innerText = mostRecentScore; 

/*---funktioniert gerade nicht. muss ich noch anschauen. 
Sollte sein: Button ist disabled, wenn kein Username in Feld getippt wurde

username.addEventListener('keyup', () => {
   /*  saveScoreBtn.disabled = !username.value;  
});
*/


saveHighScore = (e) => {
    e.preventDefault();     /* verhindert, dass es woanders hingepostet wird. Muss das evt weg bei API Post? */

    var spieler = document.getElementById('username').value;
    localStorage.setItem("spieler", spieler);

    fetch('https://343505-26.web.fhgr.ch/api/jump-and-run/publicscore/', {
        method: 'POST', 
        body: JSON.stringify({
            spieler:spieler,
            score:mostRecentScore,
            level:level,
            spieldurchlauf:spieldurchlauf
    }),

    headers: { //Header beim Request hinzufügen
      "Content-type": "application/json; charset=UTF-8"
  }
  })

  .then(response => {
    if (response.status === 500) { //wenn ein Fehler 500 erscheint
        //Fehler
        addEventListener();
        saveHighScore()
        throw new Error("Hoppla. Etwas ist schiefgelaufen ... Error 500 - retry");
    }
    if (!response.ok) { //wenn generell ein Fehler erscheint, damit der User es mitbekommt
        alert('geht nicht');
        throw new Error("Hoppla. Etwas ist schiefgelaufen ...");
    }
    //console.log(data);
    return response.json();
})
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error)); //Error abfangen

};  
  
var score = [];

function loadHighScore() {

    const spielerLocalStorage = localStorage.getItem("spieler");  

    fetch('https://343505-26.web.fhgr.ch/api/jump-and-run/publicscore/')
        .then(response => {
            if (response.status === 500) { //wenn ein Fehler 500 erscheint
                //Fehler
                loadHighScore();
                throw new Error("Hoppla. Etwas ist schiefgelaufen ... Error 500 - retry");
            }
            if (!response.ok) { //wenn generell ein Fehler erscheint, damit der User es mitbekommt
                alert('geht nicht');
                throw new Error("Hoppla. Etwas ist schiefgelaufen ...");
            }
            return response.json(); //wenn alles okay ist, dann soll er die Daten ausgeben                
            
        })
        
        .then(result => {   
            for (var item in result) {    //Highscores anzeigen
              if (spielerLocalStorage == result[item].spieler) { //check, ob der Spieler in der Local Storage der gleiche ist wie bei der API, wenn ja, dann soll es die scores ausgeben
                var scoreAPI = { //Variable um die neue api ins array zu speichern
                  score: result[item].score,
                  spieler: result[item].spieler,
                }
               
                score.push(scoreAPI); //speichert neues Ergebnis (scoreAPI) in Variable (score)
                score.sort((a, b) => b.score - a.score); //sortiert die Ergebnisse
                score.splice(5);  //Nachdem sortiert wurde, wird alles was nicht in den Top 5 ist, weggeschnitten
              }
            };
            for (var i in score) { //Zeit Spieler in HTML an
              textForHTML = '<p>   '+score[i].spieler + ' - ' +  score[i].score + '  </p>';
              document.getElementById('highScoresList').innerHTML += textForHTML;
            }
        });
    };
    
  loadHighScore();