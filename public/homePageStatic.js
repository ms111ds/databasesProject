/********************************************************************
 * bindSubmit
 * waits for the submit button to be clicked. When that happens
 * it will send the form data to the server as a JSON string
 * to display a person 
 ********************************************************************/
function bindSubmit(){
    /* create event listener for formSubmit button*/
    document.getElementById('selectSubmit').addEventListener('click', function(event){
        /* prepare AJAX request to server as a JSON string */
        var req = new XMLHttpRequest();
        var payload = {name:null};
        // get single value items add them to the payload
        // then set to null if any value is an empty string
        payload.name = document.getElementById('name').value;
        console.log(payload.name);
        for (var i in payload){
            if (payload[i] === "")
                payload[i] = null;
        }
        // open request 
        req.open('POST', document.getElementById('selectForm').action, true);
        req.setRequestHeader('Content-Type', 'application/json');
        // listen for server response, if successful reload page
        req.addEventListener('load', function(){
            if (req.status >= 200 && req.status < 400)
            {
                response = JSON.parse(req.responseText);
                console.log(response);
                document.getElementById('selectName').innerHTML = response.Name;
                document.getElementById('selectAge').innerHTML = response.Age;
                document.getElementById('selectSex').innerHTML = response.IsFemale;
                document.getElementById('selectFood').innerHTML = response.FoodName;
                document.getElementById('selectDrinks').innerHTML = response.DrinkName;
                document.getElementById('selectCrush').innerHTML = response.AttractedTo;
                document.getElementById('selectLikes').innerHTML = response.Likes;
                document.getElementById('selectTricks').innerHTML = response.Tricks;
            }
            else    
            {
                console.log("Error in network request. Status: " + req.statusText);
                document.getElementById('errorMsg').innerHTML = "An error has occurred in the request."
            }
        });
 
        /* send request and prevent default form actions*/
        req.send(JSON.stringify(payload));
        event.preventDefault();
    }); 
}

document.addEventListener('DOMContentLoaded', bindSubmit);
