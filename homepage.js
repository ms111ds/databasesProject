// set up export functionality and required packages
module.exports = function(){
    var express = require('express');
    var router = express.Router();


    /*********************************************************************
     * getpeople
     * Description: Queries database for all available people and passes
     * this information into the content parameter. The parameters passed
     * in are used for the following.
     * res - the calling route's response variable. Used to pass any errors
     *       from the query
     * mysql - the sql pool from the calling route. Used to access the DB
     * content - the content variable from the calling route. Will contain
     *           the results of the query if successful
     * complete - a function defined in the calling route that will render
     *            the page. Used to ensure sql query completes before
     *            rendering page.
    ********************************************************************/ 
    function getPeople(res, mysql, content, complete){
        // sql query
        var peopleQuery = "SELECT Name FROM SpringBreakers";
        mysql.pool.query(peopleQuery, function(error, results, fields){
            // function from https://github.com/knightsamar/CS340-Sample-Web-App
            // date retrieved October 29,2018
            // error handler
            if (error){
                res.write(JSON.stringify(error), function(){res.end()});
            }
            // assign query results to content 
            content.personList = results;
            // make sure this function completes before returning
            complete();
        }); 
    }



    /********************************************************************
     * get handler (homepage)
     * Description: handles request to see the home page by obtaining
     * the necessary information from the database and rendering the page.
     *******************************************************************/
    router.get('/', function(req, res, next)  {
        // set status to 200 and create variables
        res.status(200);
        var website = req.app.get('website');
        var mysql = req.app.get('mysql');
        var counter = 0;
        var content = {};
        // update the content varable with the proper website links
        content.homePage = website; 
        content.peoplePage = website + '/people';
        content.foodPage = website + '/food';
        content.drinksPage = website + '/drinks';
        content.likesPage = website + '/likes';
        content.tricksPage = website +'/partyTrick';
        content.selectPage = website +'/select';
        // query the database for the names of the spring breakers
        getPeople(res, mysql, content, complete);
        // define function that ensures the query above is completed
        // before rendering the web page
        // function from https://github.com/knightsamar/CS340-Sample-Web-App
        // date retrieved October 29,2018
        function complete(){
           counter++;
           if (counter === 1)
            {
              res.render('homePage', content);
            }
        }   
    });

    /********************************************************************
     * display spring breaker handler (select handler)
     * Description: handles request to display the selected spring breaker.
     *******************************************************************/
    router.post('/select', function(req, res, next)  {
        // define variables for website url, mysql, and the content to return
        // to the web site
        var website = req.app.get('website');
        var mysql = req.app.get('mysql');
        var content = {};
        // define and compose variables for select person sql query
        var peoplePt1 = "SELECT sb.Name, sb.Age, sb2.Name As AttractedTo, sb.IsFemale, ";
        var peoplePt2 = "f.FoodName, d.DrinkName FROM SpringBreakers sb ";
        var peoplePt3 = "LEFT JOIN SpringBreakers sb2 ON sb.AttractedTo = sb2.PersonID ";
        var peoplePt4 = "LEFT JOIN Food f ON sb.FavouriteFood = f.FoodID ";
        var peoplePt5 = "LEFT JOIN Drinks d ON sb.FavouriteDrink = d.DrinkID ";
        var peoplePt6 = "WHERE sb.Name = ?;"; 
        var pplQuery = peoplePt1 + peoplePt2 + peoplePt3 + peoplePt4 + peoplePt5 + peoplePt6;
        // define and compose variables for select likes sql query
        var likePt1 = "SELECT sb.PersonID, l.LikeDesc FROM SpringBreakers sb ";
        var likePt2 = "INNER JOIN SpringBreakerLikes sbl ON sb.PersonID = sbl.PersonID ";
        var likePt3 = "INNER JOIN Likes l ON sbl.LikeID = l.LikeID WHERE sb.Name = ?;";
        var likeQuery = likePt1 + likePt2 + likePt3;
        // define and compose variables for select party trick sql query
        var trickPt1 = "SELECT sb.PersonID, pt.TrickDesc FROM SpringBreakers sb ";
        var trickPt2 = "INNER JOIN SpringBreakerPartyTrick sbpt ON sb.PersonID = sbpt.PersonID ";
        var trickPt3 = "INNER JOIN PartyTrick pt ON sbpt.TrickID = pt.TrickID ";
        var trickPt4 = "WHERE sb.Name = ?;";
        var trickQuery = trickPt1 + trickPt2 + trickPt3 + trickPt4;
        
        // query the database to select the data for a spring breaker from the Spring
        // breakers table. Has 3 parts.
        // 1) Get the information from the SpringBreakers table
        // 2) Get the likes information
        // 3) Get the party trick information
        // query the SpringBreakers table
        mysql.pool.query(pplQuery, [req.body.name], function(error, results, fields){
            // error handler
            // function from https://github.com/knightsamar/CS340-Sample-Web-App
            // date retrieved October 29,2018
            if(error){
                console.log(JSON.stringify(error));
                res.statusMessage = JSON.stringify(error);
                res.status(500).send(error);
            }
            else
            {
                content = results[0];
                if (content.IsFemale === 1)
                    content.IsFemale = "female";
                else
                    content.IsFemale = "male";
                // query the likes 
                mysql.pool.query(likeQuery, [req.body.name], function(error, results, fields){
                    // error handler
                    // function from https://github.com/knightsamar/CS340-Sample-Web-App
                    // date retrieved October 29,2018
                    if(error){
                        console.log(JSON.stringify(error));
                        res.statusMessage = JSON.stringify(error);
                        res.status(500).send(error);
                    }
                    else
                    {
                        var likeString = "";
                        var k;
                        for (var i in results)
                        {
                            k = parseInt(i) + 1;
                            if (i < results.length - 1)
                                likeString += k + ") " + results[i].LikeDesc + " <br> ";
                            else
                                likeString += k + ") " + results[i].LikeDesc;
                        }
                        content.Likes = likeString;
                        // query the party tricks 
                        mysql.pool.query(trickQuery, [req.body.name], function(error, results, fields){
                            // error handler
                            // function from https://github.com/knightsamar/CS340-Sample-Web-App
                            // date retrieved October 29,2018
                            if(error){
                                console.log(JSON.stringify(error));
                                res.statusMessage = JSON.stringify(error);
                                res.status(500).send(error);
                            }
                            else
                            {
                                var trickString = "";
                                var k;
                                for (var i in results)
                                {
                                    k = parseInt(i) + 1;
                                    if (i < results.length - 1)
                                        trickString += k + ") " + results[i].TrickDesc + " <br> ";
                                    else
                                        trickString += k + ") " + results[i].TrickDesc;
                                }
                                content.Tricks = trickString;
                                res.status(200).send(JSON.stringify(content));
                            }
                        });
                    }
                });
            }
                
        });
    });



    return router;
}();
