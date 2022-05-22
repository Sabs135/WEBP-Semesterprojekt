


// START ADD MESSAGE WITH API
var post_form = document.getElementById('post_form')


post_form.addEventListener('submit', function(e) {
    e.preventDefault()

    var id = Date.now()
    var author = document.getElementById('form_post_author').value
    var msg = document.getElementById('form_post_msg').value
    const input = document.querySelector('.typedMessage');
    const text = input.value.trim(); //leere Nachrichten entdecken & ignorieren

    //API Fetch POST
    fetch('https://343505-26.web.fhgr.ch/api/jump-and-run/message/', {
        method: 'POST', 
        body: JSON.stringify({
            id:id,
            author:author,
            msg:msg,
    }),

    headers: { //Header beim Request hinzufügen
        "Content-type": "application/json; charset=UTF-8"
    }
    })

    .then(function(response){ 
    return response.json()})
    .then(function(data)
    {console.log(data)
    id=document.getElementById("post_id")
    author=document.getElementById("post_author");
    msg=document.getElementById("post_msg");
    id.innerHTML = data.id
    author.innerHTML = data.author;
    msg.innerHTML = data.msg;
    }).catch(error => console.error('Error:', error)); 

    

    if(text !== ''){ //Nachricht nach abschicken löschen
        input.value = '';
        input.focus(); 
    }
    });

// END ADD MESSAGE


// START SHOW MESSAGE

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

            result.reverse(result.sort(GetSortOrder("id"))); //Array wird sortiert

            for (var item in result) {    //Nachrichten im Feed anzeigen
                lastMsg.push(result[item].id) //ID der Messages in den Array speichern
                const idMsg = document.getElementById('post_msg')
                const newP = document.createElement('p');
                const newText = document.createTextNode(result[item].author + ': ' +  result[item].msg); //Nachrichten hinzufügen
                idMsg.appendChild(newP); 
                newP.appendChild(newText);
            };

        });
    }

    loadMsgs();


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
                    if (result[item].id > lastMsg[0]) {
                        console.log(result[item].id + ' is bigger than ' + lastMsg[0]); //schauen, ob es die Nachricht bereits gibt
                        lastMsg.unshift(result[item].id); // unshift fügt es zu beginn an beim Array, Push am ende
                        console.log(lastMsg);
                    
                        const idMsg = document.getElementById('new_msg')
                        const newP = document.createElement('p');
                        const newText = document.createTextNode(result[item].author + ': ' +  result[item].msg);//Nachrichten hinzufügen (unten)
                        idMsg.appendChild(newP);
                        newP.appendChild(newText);
                    };
                };
            });
    }

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
// END SHOW MESSAGE

//Open & Close Messenger - Button
function toggleText(){
    var x = document.getElementById("Myid");
    if (x.style.display === "none") {
      x.style.display = "flex";
    } else if (x.style.display === "flex") {
      x.style.display = "none";
    } else {
        x.style.display = "none"; 
    }

  }