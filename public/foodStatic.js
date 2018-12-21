/********************************************************************
 * bindAddSubmit
 * waits for the submit button to be clicked. When that happens
 * it will send the form data to the server as a JSON string
 * to add a food
 ********************************************************************/
function bindAddSubmit(){
    /* create event listener for formSubmit button*/
    document.getElementById('addSubmit').addEventListener('click', function(event){
        /* prepare AJAX request to server as a JSON string */
        var req = new XMLHttpRequest();
        var payload = {foodName:null, foodType:null};
        payload.foodName = document.getElementById('foodName').value;
        payload.isUnhealthy = document.getElementById('foodType').value;
        for (var i in payload){
            if (payload[i] === "")
                payload[i] = null;
        }
        req.open('POST', document.getElementById('addForm').action, true);
        req.setRequestHeader('Content-Type', 'application/json');
        // listen for server response, if successful reload page
        req.addEventListener('load', function(){
        if (req.status >= 200 && req.status < 400)
        {
            window.location.reload(true);
        }
        else    
        {
            console.log("Error in network request. Status: " + req.statusText);
            document.getElementById('addError').innerHTML = "Either an error occured or the food name is already in the database"
        }
        });

        /* send request and prevent default form actions*/
        req.send(JSON.stringify(payload));
        event.preventDefault();
    }); 
}

/********************************************************************
 * bindDeleteSubmit
 * waits for the submit button to be clicked. When that happens
 * it will send the form data to the server as a JSON string
 * to delete a food.
 ********************************************************************/
function bindDeleteSubmit(){
    /* create event listener for formSubmit button*/
    document.getElementById('deleteSubmit').addEventListener('click', function(event){
        /* prepare AJAX request to server as a JSON string */
        var req = new XMLHttpRequest();
        var payload = {type:"add", foodName:null};
        payload.foodName = document.getElementById('deleteList').value;
        req.open('POST', document.getElementById('deleteForm').action, true);
        req.setRequestHeader('Content-Type', 'application/json');
        // listen for server response. If sucessful reload page
        req.addEventListener('load', function(){
        if (req.status >= 200 && req.status < 400)
        {
            window.location.reload(true);
        }
        else    
            console.log("Error in network request. Status: " + req.statusText);
        });

        /* send request and prevent default form actions*/
        req.send(JSON.stringify(payload));
        event.preventDefault();
    }); 
}

document.addEventListener('DOMContentLoaded', bindAddSubmit);
document.addEventListener('DOMContentLoaded', bindDeleteSubmit);
