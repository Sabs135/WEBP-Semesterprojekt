
//USER HINZUFÜGEN
const userDetails = JSON.parse(localStorage.getItem("userDetails")) || [];
var form = document.getElementById('form')

form.addEventListener('submit', function(e) {
    e.preventDefault()

    /*verstehe nicht wieso, aber ich muss beide Zeilen hier lassen, sonst gab es einen Fehler */
    /*sollte bereinigt werden */
    /*ABER: bitte nachfolgende 6 Zeilen Code NICHT einfach so löschen... */
    var name = document.getElementById('form_post_name').value
    var id = Date.now()
    localStorage.setItem('name', JSON.stringify(name));  /* Brauche ich für Anzeige auf spiel.html und highscore.html */
    localStorage.setItem('spielerid', JSON.stringify(id)); //Spieler ID in local Sotrage speichern (für den Highscore, damit da die Spielerid mitgegeben werden kann)
    /* könnte ich auch anstatt JSON.stringify(name) einfach name.value schreiben?? */


    //braucht es das? 
    const userDetails = {
        name: name = document.getElementById('form_post_name').value,
        id: id = Date.now()
    };

    localStorage.setItem('userDetails', JSON.stringify(userDetails));  /* userDetails in Local Storage */

    //API Fetch POST
    fetch('https://343505-26.web.fhgr.ch/api/jump-and-run/spieler/', {
        method: 'POST', 
        body: JSON.stringify({
            name:name,
            spielerid:id,
    }),
    // Adding headers to the request
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    })

    .then(response => {
        if (response.status === 500) { //wenn ein Fehler 500 erscheint
            //Fehler
            addEventListener();
            throw new Error("Hoppla. Etwas ist schiefgelaufen ... Error 500 - retry");
        }
        if (!response.ok) { //wenn generell ein Fehler erscheint, damit der User es mitbekommt
            alert('geht nicht');
            throw new Error("Hoppla. Etwas ist schiefgelaufen ...");
        }
        return response.json();
      })
      .then(function(data)
        {console.log(data)
        name=document.getElementById("post_name")
        id=document.getElementById("post_id")
        name.innerHTML = data.name
        id.innerHTML = data.spielerid
        })
      .catch(error => console.error('Error:', error)); //Error abfangen
});