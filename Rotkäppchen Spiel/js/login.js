//-------- START "Zum Spiel"-Button Logik ---------/

// Button erscheint erst, wenn User ge-added 
   // Quelle der Inspiration: https://www.quora.com/In-JavaScript-how-can-I-click-a-button-that-only-appears-after-another-button-is-clicked
   
   /* Default in CSS=hidden. Hier wird Button onclick sichtbar gemacht */ 
   document.querySelector('#btn1').addEventListener('click', showBtn); // Löst die Funktion ShowBtn aus
    
   function showBtn(e) { 
      document.querySelector('#btn2').style.visibility = 'visible';  // setzt Btn auf sichtbar
   }

//-------- ENDE "Zum Spiel"-Button Logik ---------/

//-------- START USER hinzufügen ---------/

const userDetails = JSON.parse(localStorage.getItem("userDetails")) || [];
var form = document.getElementById('form')


form.addEventListener('submit', function(e) {
    e.preventDefault()
    
    var name = document.getElementById('form_post_name').value
    var id = Date.now()
    localStorage.setItem('name', JSON.stringify(name));  /* Brauche ich für Anzeige auf spiel.html und highscore.html */
    localStorage.setItem('spielerid', JSON.stringify(id)); //Spieler ID in local Sotrage speichern (für den Highscore, damit da die Spielerid mitgegeben werden kann)

    //Anzeige in Konsole bzw. für RetrievedObject später
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
                text = '<p>Du konntest dich erfolgreich einloggen <b>' + result[index].name + '</b>!</p> <p> Deine Spieler-ID ist: <b>' + result[index].spielerid + '</b></p>'
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
                    text = '<p>Herzlich Willkommen! <b>' + data.name + '</b> wurde neu registriert.</p> <p> Deine Spieler-ID ist: <b>' + data.spielerid + '</b></p>'
                    show_user.innerHTML = text
                    })
                .catch(error => console.error('Error:', error)); //Error abfangen
            }
        });
});

//-------- ENDE USER hinzufügen ---------/