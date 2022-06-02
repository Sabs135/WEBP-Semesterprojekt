// Quelle High Score der Inspiration: https://github.com/jamesqquick/Build-A-Quiz-App-With-HTML-CSS-and-JavaScript/tree/master/8.%20Save%20High%20Scores%20in%20Local%20Storage

//----------------------------Start Definition Konstanten -----------------------------------//

const username = document.getElementById('username');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = parseInt(localStorage.getItem('mostRecentScore'));  /* beachte game.js wo mostRecentStore 2x gesetzt wird: win & lose */
const highScoresList = document.getElementById("highScoresList");
var score = []; //hier werden die HighScores reingeschrieben
var name_local = JSON.parse(localStorage.getItem("name")); //name von Local Storage nehmen
var spielerid = localStorage.getItem("spielerid"); //spielerid von Local Storage nehmen
const MAX_HIGH_SCORES = 5; /* meine letzten X Highscores anzeigen */

//----------------------------Ende Definition Konstanten -----------------------------------//


username.innerHTML = 'Eingeloggt als: <b>' + name_local + '</b>'; //übernimmt Name vom Local Storage

finalScore.innerText = mostRecentScore; //zeigt den mostRecentScore beim Text an ("du hast bei deinem letzten Spiel xy Punkte gemacht.")

//Anzeige in Konsole bzw. für RetrievedObject
var retrievedObject = localStorage.getItem('userDetails');
console.log('retrievedObject: ', JSON.parse(retrievedObject));

//Seiten-Reload für den Button
reload = (e) => {
  location.reload()
}

//-------------------- Neuen High Score speichern API --------------------//

saveHighScore = (e) => {
    e.preventDefault(); 
    fetch('https://343505-26.web.fhgr.ch/api/jump-and-run/publicscore/', {
        method: 'POST', 
        body: JSON.stringify({
          spielerid:spielerid,
          name:name_local,
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
        if (name_local == result[item].name) { //check, ob der Spieler in der Local Storage der gleiche ist wie bei der API, wenn ja, dann soll es die scores ausgeben
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

