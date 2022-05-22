// START USER HINZUFÜGEN

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

        const userDetails = {
            name: name = document.getElementById('form_post_name').value,
            id: id = Date.now()
        };

        console.log(userDetails); 
    
        localStorage.setItem('userDetails', JSON.stringify(userDetails));  /* userDetails in Local Storage */
    
        // ID options:
            //Math.random().toString(16).slice(2) 
            //Date.now() 
            //document.getElementById('form_id').value

        //API Fetch POST
        fetch('https://343505-26.web.fhgr.ch/api/jump-and-run/spieler/', {
            method: 'POST', 
            body: JSON.stringify({
                name:name,
                id:id,
        }),
        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
    }
    })

    .then(function(response){ 
        return response.json()})
    .then(function(data)
        {console.log(data)
        name=document.getElementById("post_name")
        id=document.getElementById("post_id")
        name.innerHTML = data.name
        id.innerHTML = data.id
        }).catch(error => console.error('Error:', error)); 
    });

// END USER HINZUFÜGEN