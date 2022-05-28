//-------------------- Add Message to the API --------------------//

var post_form = document.getElementById('post_form')

post_form.addEventListener('submit', function(e) {
    e.preventDefault()

    var messageid = Date.now()
    var name = document.getElementById('form_post_author')
    var msg = document.getElementById('form_post_msg').value
    const input = document.querySelector('.typedMessage');
    const text = input.value.trim(); //leere Nachrichten entdecken & ignorieren

    //API Fetch POST
    fetch('https://343505-26.web.fhgr.ch/api/jump-and-run/message/', {
        method: 'POST', 
        body: JSON.stringify({
            messageid:messageid,
            name:name.value,
            msg:msg,
    }),

    headers: { //Header beim Request hinzufügen
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
        return response.json(); //wenn alles okay ist, dann soll er die Daten ausgeben
    })

    .then(function(data) {console.log(data)})
    .catch(error => console.error('Error:', error)); 

    if(text !== ''){ //Nachricht nach abschicken löschen
        input.value = '';
        input.focus(); 
    }
});

//-------------------- Laden der vergangenen Messages --------------------//

let lastMsg = [] //Hier werden die IDs gepseichert für die Anzeige

function loadMsgs() {
    fetch('https://343505-26.web.fhgr.ch/api/jump-and-run/message/')
        .then(response => {
            if (response.status === 500) { //wenn ein Fehler 500 erscheint
                //Fehler
                loadMsgs();
                throw new Error("Hoppla. Etwas ist schiefgelaufen ... Error 500 - retry");
            }
            if (!response.ok) { //wenn generell ein Fehler erscheint, damit der User es mitbekommt
                alert('geht nicht');
                throw new Error("Hoppla. Etwas ist schiefgelaufen ...");
            }
            return response.json(); //wenn alles okay ist, dann soll er die Daten ausgeben
        })
        .then(result => {
            // Dies muss man machen, da nach der API-Definition die keys nicht mehr gleich waren (id & message id und author & name) Hier werden die namen vereinheitlicht
            var i;
            for(i = 0; i < result.length; i++){ //https://stackoverflow.com/questions/6809659/changing-the-key-name-in-an-array-of-objects))
                if (result[i].messageid === undefined) {
                result[i].messageid = result[i]['id']; //Key id wird zu message id umgenannt
                result[i].name = result[i]['author']; //Key author wird zu message name umgenannt
                delete result[i].id; //key id wird gelöscht
                delete result[i].author; //key autohro wird gelöscht
                }
            }
           //Comparer Function //Quelle: https://www.c-sharpcorner.com/UploadFile/fc34aa/sort-json-object-array-based-on-a-key-attribute-in-javascrip/
            function GetSortOrder(prop) {    // JSON Sortieren aufgrund der ID
                return function(a, b) {    
                    if (a[prop] > b[prop]) {    
                        return 1;    
                    } else if (a[prop] < b[prop]) {    
                        return -1;    
                    }    
                    return 0;    
                }    
            }  

            result.reverse(result.sort(GetSortOrder("messageid"))); //Array wird sortiert           

            for (var item in result) {    //Nachrichten im Feed anzeigen
                lastMsg.push(result[item].messageid) //ID der Messages in den Array speichern
                const idMsg = document.getElementById('post_msg')
                const newP = document.createElement('p');
                const newText = document.createTextNode(result[item].name + ': ' +  result[item].msg); //Nachrichten hinzufügen
                idMsg.appendChild(newP); 
                newP.appendChild(newText);
            };

         });
    }

    loadMsgs();

//-------------------- Neue Nachrichten anzeigen --------------------//

    function loadMsg() {
        fetch('https://343505-26.web.fhgr.ch/api/jump-and-run/message/')
            .then(response => {
                if (response.status === 500) { //wenn ein Fehler 500 erscheint
                    //Fehler
                    loadMsg();
                    throw new Error("Hoppla. Etwas ist schiefgelaufen ... Error 500 - retry");
                }
                if (!response.ok) { //wenn generell ein Fehler erscheint, damit der User es mitbekommt
                    alert('geht nicht');
                    throw new Error("Hoppla. Etwas ist schiefgelaufen ...");
                }
                return response.json(); //wenn alles okay ist, dann soll er die Daten ausgeben                
            })
            
            .then(result => {   
                for (var item in result) {    //Nachrichten im Feed anzeigen
                    if (result[item].messageid > lastMsg[0]) {
                        console.log(result[item].messageid + ' is bigger than ' + lastMsg[0]); //schauen, ob es die Nachricht bereits gibt
                        lastMsg.unshift(result[item].messageid); // unshift fügt es zu beginn an beim Array, Push am ende
                        console.log(lastMsg);
                    
                        const idMsg = document.getElementById('new_msg')
                        const newP = document.createElement('p');
                        const newText = document.createTextNode(result[item].name + ': ' +  result[item].msg);//Nachrichten hinzufügen (unten)
                        idMsg.appendChild(newP);
                        newP.appendChild(newText);
                    };
                };
            });
    }

//Quelle (angelehnt han): https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Statements/async_function
var load = function() {   //schauen ob es neue Nachrichten in der API gibt
    return new Promise(resolve => {
      setTimeout(function() {
        resolve(10);
        loadMsg();
      }, 1000);
    });
  };

  var start = async function() { 
    console.log('==Works==');  
    const fast = await load(); //funktion load laden
    await start();
  }
  start();

//-------------------- Button Messenger öffnen / schliessen --------------------//

//Quelle: https://www.codegrepper.com/code-examples/html/how+to+open+and+close+div+on+click+in+javascript
function toggleText(){
    var msgBtn = document.getElementById("messenger-button");
    if (msgBtn.style.display === "flex") {
        msgBtn.style.display = "none";
    } else {
        msgBtn.style.display = "flex"; 
    }

  }