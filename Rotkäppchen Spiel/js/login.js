
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
        fetch('https://343505-26.web.fhgr.ch/api/jump-and-run/spieler/') //verbindung zur API spieler
        .then(response => {
            if (response.status === 500) { //wenn ein Fehler 500 erscheint
                //Fehler
                form.AddEventListener();
                throw new Error("Hoppla. Etwas ist schiefgelaufen ... Error 500 - retry");
            }
            if (!response.ok) { //wenn generell ein Fehler erscheint, damit der User es mitbekommt
                alert('geht nicht');
                throw new Error("Hoppla. Etwas ist schiefgelaufen ...");
            }
            return response.json(); //wenn alles okay ist, dann soll er die Daten ausgeben  
        })
            
        .then(result => { 
            function findName(n) { //such name
            return n.name === name;
            } 

            if (result.find(findName) != undefined) { //schaut ob eigetragener Name in der API zu finden ist --> wenn ja geht es hier weiter
                index = result.indexOf(result.find(findName));
                show_user=document.getElementById("show_user")
                text = '<p>Du konntest dich erfolgreich einloggen <b>' + result[index].name + '</b>!</p> <p> Deine Spieler-ID ist: ' + result[index].spielerid + '</p>'
                show_user.innerHTML = text; //anzeige des Textes auf der Seite
            } 

            if (result.find(findName) === undefined) { //schaut ob eigetragener Name in der API nicht zu finden ist --> wenn er nicht zu finden ist, wird er registriert
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
                        form.AddEventListener();
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
                    show_user=document.getElementById("show_user")
                    text = '<p>Herzlich Willkommen! <b>' + data.name + '</b> wurde neu registriert.</p> <p> Deine Spieler-ID ist: ' + data.spielerid + '</p>'
                    show_user.innerHTML = text
                    })
                .catch(error => console.error('Error:', error)); //Error abfangen
            }
        });
});