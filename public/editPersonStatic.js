/********************************************************************
 * bindEditSubmit
 * waits for the submit button to be clicked. When that happens
 * it will send the form data to the server as a JSON string
 * to add person 
 ********************************************************************/
function bindEditSubmit(){
    /* create event listener for formSubmit button*/
    document.getElementById('editSubmit').addEventListener('click', function(event){
        /* prepare AJAX request to server as a JSON string */
        var req = new XMLHttpRequest();
        var payload = {name:null, isFemale:null, age:null, crush:null, likes:null, tricks:null, originalName:null};
        // get single value items add them to the payload
        // then set to null if any value is an empty string
        payload.name = document.getElementById('name').value;
        payload.isFemale = document.getElementById('sex').value;
        payload.age = document.getElementById('age').value;
        payload.food = document.getElementById('food').value;
        payload.drink = document.getElementById('drink').value;
        payload.crush = document.getElementById('crush').value;
        payload.originalName = document.getElementById('originalName').value;
        for (var i in payload){
            if (payload[i] === "")
                payload[i] = null;
        }
        // get multi value items from the checkboxes and add them to the payload
        payload.likes = [];
        payload.tricks = [];
        var likeCheckBoxes = document.getElementsByClassName("like");
        var trickCheckBoxes = document.getElementsByClassName("trick");
        for (var i in likeCheckBoxes)
        {
            if(likeCheckBoxes[i].checked)
            { 
                payload.likes.push(likeCheckBoxes[i].value);
                
            }
        }
        for (var i in trickCheckBoxes)
        {
            if(trickCheckBoxes[i].checked)
            {
                payload.tricks.push(trickCheckBoxes[i].value);
            }
        }
        // open request 
        req.open('POST', document.getElementById("submitForm").action, true);
        req.setRequestHeader('Content-Type', 'application/json');
        // listen for server response, if successful reload page
        req.addEventListener('load', function(){
            if (req.status >= 200 && req.status < 400)
            {
                window.location.assign(req.responseText);
            }
            else    
            {
                console.log("Error in network request. Status: " + req.statusText);
                document.getElementById('editError').innerHTML = "Either an error occured, a person name not provided, or the person name is already in the database."
            }
        });
 
        /* send request and prevent default form actions*/
        req.send(JSON.stringify(payload));
        event.preventDefault();
    }); 
}


document.addEventListener('DOMContentLoaded', bindEditSubmit);
