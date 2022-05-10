// START USER HINZUFÜGEN WITH API
var post_form = document.getElementById('post_form')

    post_form.addEventListener('submit', function(e) {
        e.preventDefault()

        //var id = document.getElementById('form_post_id').value
        var id = Date.now()
        var author = document.getElementById('form_post_author').value
        var msg = document.getElementById('form_post_msg').value
        //var id = Date.now()
        
// ID options:
        //Math.random().toString(16).slice(2) 
        //Date.now() 
        //document.getElementById('form_id').value

    //API Fetch POST
    fetch('https://343505-26.web.fhgr.ch/api/jump-and-run/message/', {
        method: 'POST', 
        body: JSON.stringify({
            id:id,
            author:author,
            msg:msg,
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
    id=document.getElementById("post_id")
    author=document.getElementById("post_author")
    msg=document.getElementById("post_msg")
    id.innerHTML = data.id
    author.innerHTML = data.author
    msg.innerHTML = data.msg
    }).catch(error => console.error('Error:', error)); 
    });

// END USER HINZUFÜGEN



// START USER HERAUSLESEN


//FUNKTIONIERT ABER OHNE SORTIERUNG
/*fetch('https://343505-26.web.fhgr.ch/api/jump-and-run/message/')
.then(response => response.json())
.then(result => {
    console.log(result);
    for (let i = 0; i < result.length; i++) {
        console.log(result[i].id + result[i].author + result[i].msg);
        textForHTML = '   '+result[i].author + ': ' +  result[i].msg + '  \r\n';
        document.getElementById('post_msg').innerText += textForHTML;
}
})*/

fetch('https://343505-26.web.fhgr.ch/api/jump-and-run/message/')
.then(response => response.json())
.then(result => {
    console.log(result);

    //Comparer Function //Quelle: https://www.c-sharpcorner.com/UploadFile/fc34aa/sort-json-object-array-based-on-a-key-attribute-in-javascrip/
    function GetSortOrder(prop) {    
        return function(a, b) {    
            if (a[prop] > b[prop]) {    
                return 1;    
            } else if (a[prop] < b[prop]) {    
                return -1;    
            }    
            return 0;    
        }    
    }    

    //Array wird sortiert
    result.sort(GetSortOrder("id"));

    console.log(result);
    for (var item in result) {    
        console.log(result[item].id)
        console.log(result[item].id + result[item].author + result[item].msg);
        textForHTML = '   '+result[item].author + ': ' +  result[item].msg + '  \r\n';
        document.getElementById('post_msg').innerText += textForHTML;
    }

})

// END USER HERAUSLESEN


//Create an array where the message along with it's ID will be stored.
let message = [];

// This fuction will enables us to add the message to the DOM
function addMessage(text){
    //Object where message will be stored
    const chat = {
        text,
        id_msg: Date.now()
    }

    message.push(chat);
    
    //Render message to the screen
    const list = document.querySelector('.messages');
    list.insertAdjacentHTML('beforeend', 
        `<p class="message-item" data-key="${chat.id_msg}">
            <span>${chat.text}</span>
        </p>`

    );
    

    // Delete the message from the screen after 2 seconds ---> können wir dann glaub löschen
/*
    let token = setTimeout(() => {
        Array.from(list.children).forEach((child) => 
       list.removeChild(child))
       clearTimeout(token);
      },2000);
*/

}

//Create event listener to detect when a message has been submitted
const form = document.querySelector('.message-form');
form.addEventListener('submit', event => {
    event.preventDefault();

    //input to save the message itself
    const input = document.querySelector('.typedMessage');

    //This helps us to detect empty messages and ignore them
    const text = input.value.trim();

    if(text !== ''){
        addMessage(text);
        input.value = '';
        input.focus();
        
    }
})