// Quelle High Score der Inspiration: https://github.com/jamesqquick/Build-A-Quiz-App-With-HTML-CSS-and-JavaScript/tree/master/8.%20Save%20High%20Scores%20in%20Local%20Storage

/* Def. der Konstanten. Username wid vermutlich obsolet - sollte ja übermittelt werden.  */
//const username1 = document.getElementById('post_name'); /* TODO Sabrina evt anpassen wenn API angepasst */
const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = parseInt(localStorage.getItem('mostRecentScore'));  /* beachte game.js wo mostRecentStore 2x gesetzt wird: win & lose */
const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || []; /* wir schauen was in localstorage ist und geben das zurück, ODER wenn da nichts ist, soll ein leerer Array zurückkommen */
var score = []; //hier werden die HighScores reingeschrieben
var name = JSON.parse(localStorage.getItem("name")); //name von Local Storage nehmen
var spielerid = localStorage.getItem("spielerid"); //name von Local Storage nehmen
const text = username.value.trim(); //leere Nachrichten entdecken & ignorieren

const MAX_HIGH_SCORES = 5; /* meine letzten X Highscores anzeigen */

finalScore.innerText = mostRecentScore; //zeigt den mostRecentScore beim Text an ("du hast bei deinem letzten Spiel xy Punkte gemacht.")

/*---funktioniert gerade nicht. muss ich noch anschauen. 
Sollte sein: Button ist disabled, wenn kein Username in Feld getippt wurde

username.addEventListener('keyup', () => {
   /*  saveScoreBtn.disabled = !username.value;  
});
*/

//-------------------- Neuen High Score speichern API --------------------//

saveHighScore = (e) => {
    e.preventDefault();     // verhindert, dass es woanders hingepostet wird. Muss das evt weg bei API Post?
    fetch('https://343505-26.web.fhgr.ch/api/jump-and-run/publicscore/', {
        method: 'POST', 
        body: JSON.stringify({
          spielerid:spielerid,
          name:name,
          score:mostRecentScore,
    }),

    headers: { //Header beim Request hinzufügen
      "Content-type": "application/json; charset=UTF-8"
    }
  })

  .then(response => {
    if (response.status === 500) { //wenn ein Fehler 500 erscheint
        //Fehler
        
        saveHighScore(e);
        throw new Error("Hoppla. Etwas ist schiefgelaufen ... Error 500 - retry");
    }
    if (!response.ok) { //wenn generell ein Fehler erscheint, damit der User es mitbekommt
        alert('geht nicht');
        throw new Error("Hoppla. Etwas ist schiefgelaufen ...");
    }
    return response.json();
  })
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error)); //Error abfangen
  window.location.reload(); //automatischer Reload, damit der High Score angezeigt wird
};

//-------------------- High Score laden --------------------//

function loadHighScore() {
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
        if (name == result[item].name) { //check, ob der Spieler in der Local Storage der gleiche ist wie bei der API, wenn ja, dann soll es die scores ausgeben
          var scoreAPI = { //Variable um die neue api ins array zu speichern
            score: result[item].score,
            name: result[item].name,
          }
          
          score.push(scoreAPI); //speichert neues Ergebnis (scoreAPI) in Variable (score)
          score.sort((a, b) => b.score - a.score); //sortiert die Ergebnisse
          score.splice(5);  //Nachdem sortiert wurde, wird alles was nicht in den Top 5 ist, weggeschnitten
        }
      };
      for (var i in score) { //Zeit Spieler in HTML an
        textForHTML = '<p>   '+score[i].name + ' - ' +  score[i].score + '  </p>';
        highScoresList.innerHTML += textForHTML;
      }
  });
};
    
loadHighScore();

