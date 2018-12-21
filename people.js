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
        var queryPt1 = "SELECT sb.PersonID, sb.Name, sb.IsFemale, sb.Age, ";
        var queryPt2 = "d.DrinkName, f.FoodName, sb2.Name AS AttractedTo ";
        var queryPt3 = "FROM SpringBreakers sb ";
        var queryPt4 = "LEFT JOIN SpringBreakers sb2 ON sb.AttractedTo = sb2.PersonID ";
        var queryPt5 = "LEFT JOIN Food f ON sb.FavouriteFood = f.FoodID ";
        var queryPt6 = "LEFT JOIN Drinks d ON sb.FavouriteDrink = d.DrinkID;";
        var queryAll = queryPt1 + queryPt2 + queryPt3 + queryPt4 + queryPt5 + queryPt6;
        mysql.pool.query(queryAll, function(error, results, fields){
            // function from https://github.com/knightsamar/CS340-Sample-Web-App
            // date retrieved October 29,2018
            // error handler
            if (error){
                res.write(JSON.stringify(error));
                res.end();
            }
            // assign query results to content and change IsFemale to text
            content.personList = results;
            for (var i in content.personList){
                if (content.personList[i].IsFemale === 1)
                    content.personList[i].IsFemale = "female";
                else
                    content.personList[i].IsFemale = "male";
            }
            // make sure this function completes before returning
            complete();
        }); 
    }


    /*********************************************************************
     * getFood
     * Description: Queries database for all available food and passes
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
    function getFood(res, mysql, content, complete){
        // sql query
        mysql.pool.query("SELECT FoodID, FoodName FROM Food", function(error, results, fields){
            // error handler
            // function from https://github.com/knightsamar/CS340-Sample-Web-App
            // date retrieved October 29,2018
            if (error){
                res.write(JSON.stringify(error), function() {res.end()});
                //res.end();
            }
            // attach results to content
            content.foodList = results;
            // make sure this function completes before returning
            complete();
        }); 
    }


    /*********************************************************************
     * getDrinks
     * Description: Queries database for all available drinks and passes
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
    function getDrinks(res, mysql, content, complete){
        // sql query
        mysql.pool.query("SELECT DrinkID, DrinkName FROM Drinks", function(error, results, fields){
            // error handler
            // function from https://github.com/knightsamar/CS340-Sample-Web-App
            // date retrieved October 29,2018
            if (error){
                res.write(JSON.stringify(error), function() {res.end()});
            }
            // attach results to content
            content.drinkList = results;
            // make sure this function completes before returning
            complete();
        }); 
    }


    /*********************************************************************
     * getLikes
     * Description: Queries database for all available likes and passes
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
    function getLikes(res, mysql, content, complete){
        // sql query
        mysql.pool.query("SELECT LikeID, LikeDesc FROM Likes", function(error, results, fields){
            // error handler
            // function from https://github.com/knightsamar/CS340-Sample-Web-App
            // date retrieved October 29,2018
            if (error){
                res.write(JSON.stringify(error), function() {res.end()});
            }
            // attach results to content
            content.likeList = results;
            // make sure this function completes before returning
            complete();
        }); 
    }


    /*********************************************************************
     * getTricks
     * Description: Queries database for all available party tricks and passes
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
    function getTricks(res, mysql, content, complete){
        // sql query
        mysql.pool.query("SELECT TrickID, TrickDesc FROM PartyTrick", function(error, results, fields){
            // error handler
            // function from https://github.com/knightsamar/CS340-Sample-Web-App
            // date retrieved October 29,2018
            if (error){
                res.write(JSON.stringify(error), function() {res.end()});
            }
            // attach results to content
            content.trickList = results;
            // make sure this function completes before returning
            complete();
        }); 
    }


    /********************************************************************
     * get handler (spring breakers page)
     * Description: handles request to see the sring breakers page by obtaining
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
        content.peopleEdit = website +'/peopleEdit';
        content.newPerson = website + '/people/add';
        content.deletePerson = website + '/people/delete';
        // query the database for all spring breakers, food, drinks
        // likes, and party tricks
        getPeople(res, mysql, content, complete);
        getFood(res, mysql, content, complete);
        getDrinks(res, mysql, content, complete);
        getLikes(res, mysql, content, complete);
        getTricks(res, mysql, content, complete);
        // define function that ensures the query above is completed
        // before rendering the web page
        // function from https://github.com/knightsamar/CS340-Sample-Web-App
        // date retrieved October 29,2018
        function complete(){
           counter++;
           if (counter === 5)
              res.render('people', content);
        }   
    });

    /********************************************************************
     * add spring breaker handler
     * Description: handles request to add a new spring breaker.
     *******************************************************************/
    router.post('/add', function(req, res, next)  {
        // define variables for website url and mysql
        var website = req.app.get('website');
        var mysql = req.app.get('mysql');
        // define and compose variables for insert person sql query
        var queryPt1 = "INSERT INTO SpringBreakers (Name, IsFemale, Age, FavouriteDrink, ";
        var queryPt2 = "FavouriteFood, AttractedTo) VALUES (?, ?, ?, ";
        var queryPt3 = "(SELECT DrinkID FROM Drinks WHERE DrinkName = ?), ";
        var queryPt4 = "(SELECT FoodID FROM Food WHERE FoodName = ?), ";
        var queryPt5 = "(SELECT PersonID FROM ";
        var queryPt6 = "(SELECT PersonID FROM SpringBreakers "
        var queryPt7 = "WHERE Name = ?) As personTemp));"
        var sqlcode = queryPt1 + queryPt2 + queryPt3 + queryPt4 + queryPt5 + queryPt6 + queryPt7;
        var insertPerson = [req.body.name, req.body.isFemale, req.body.age, req.body.drink, req.body.food, req.body.crush];
        // define and compose variables for insert likes sql query
        var likeQuery = "";
        var likePt1 = "INSERT INTO SpringBreakerLikes (PersonID, LikeID) values ";
        var likePt2 = "((SELECT PersonID FROM SpringBreakers WHERE Name = ?), ";
        var likePt3 = "(SELECT LikeID FROM Likes WHERE LikeDesc = ?))";
        var likeValue = likePt2 + likePt3;
        var likeAllValues = "";
        var insertLike = [];
        for (var i in req.body.likes)
        {
            likeAllValues += likeValue;
            if (i < req.body.likes.length - 1)
                likeAllValues += ", ";
            else
                likeAllValues += ";";
        }
        likeQuery += likePt1 + likeAllValues;
        for (var i in req.body.likes)
        {
            insertLike.push(req.body.name);
            insertLike.push(req.body.likes[i]);
        }
        // define and compose variables for insert party trick sql query
        var trickQuery = "";
        var trickPt1 = "INSERT INTO SpringBreakerPartyTrick (PersonID, TrickID) values ";
        var trickPt2 = "((SELECT PersonID FROM SpringBreakers WHERE Name = ?), ";
        var trickPt3 = "(SELECT TrickID FROM PartyTrick WHERE TrickDesc = ?))";
        var trickValue = trickPt2 + trickPt3;
        var trickAllValues = "";
        var insertTrick = [];
        for (var i in req.body.tricks)
        {
            trickAllValues += trickValue;
            if (i < req.body.tricks.length - 1)
                trickAllValues += ", ";
            else
                trickAllValues += ";";
        }
        trickQuery += trickPt1 + trickAllValues;
        for (var i in req.body.tricks)
        {
            insertTrick.push(req.body.name);
            insertTrick.push(req.body.tricks[i]);
        }

        
        // query the database to insert new person, If successful reload the page,
        // otherwise send error message. Goes through 3 steps
        // 1) Inserts new person
        // 2) Connects the person to the likes table by insterting the connections
        //    in the SpringBreakersLikes table
        // 3) Connects the person to the tricks table by insterting the connections
        //    in the SpringBreakersPartyTricks table
        // query 1: insert person
        mysql.pool.query(sqlcode, insertPerson, function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error));
                res.statusMessage = JSON.stringify(error);
                res.status(500).send(error);
            }
            else
            {
                // query 2: insert likes for new person
                if(req.body.likes.length === 0)
                    likeQuery = "Select ''";
                mysql.pool.query(likeQuery, insertLike, function(error, results, fields){
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
                        // query 3: insert party tricks for new person
                        if(req.body.tricks.length === 0)
                            trickQuery = "Select ''";
                        mysql.pool.query(trickQuery, insertTrick, function(error, results, fields){
                            // error handler
                            // function from https://github.com/knightsamar/CS340-Sample-Web-App
                            // date retrieved October 29,2018
                            if(error){
                                console.log(JSON.stringify(error));
                                res.statusMessage = JSON.stringify(error);
                                res.status(500).send(error);
                            }
                            else
                                res.redirect('/likes');
                        });
                    }
                });
            }
                
        });
    });


    /********************************************************************
     * delete like handler
     * Description: handles request to delete a like in the database.
     *******************************************************************/
    router.post('/delete', function(req, res, next)
    {
        // define variables and build query strings
        var website = req.app.get('website');
        var mysql = req.app.get('mysql');
        var likeDelete1 = "DELETE FROM SpringBreakerLikes WHERE PersonID = ";
        var likeDelete2 = "(SELECT PersonID FROM SpringBreakers WHERE Name=?);";
        var trickDelete1 = "DELETE FROM SpringBreakerPartyTrick WHERE PersonID = ";
        var trickDelete2 = "(SELECT PersonID FROM SpringBreakers WHERE Name = ?);";
        var nullCrush1 = "UPDATE SpringBreakers SET AttractedTo = NULL ";
        var nullCrush2 = "WHERE AttractedTo = (SELECT PersonID FROM ";
        var nullCrush3 = "(SELECT PersonID FROM SpringBreakers WHERE Name=?) AS delPer);"; 
        var personDelete = "DELETE FROM SpringBreakers WHERE Name = ?;";
        var likeDeleteAll = likeDelete1 + likeDelete2;
        var trickDeleteAll = trickDelete1 + trickDelete2;
        var nullCrushAll = nullCrush1 + nullCrush2 + nullCrush3;
        var todelete = [req.body.name];
        // query the database to delete a person. This involves
        // 1) deleting the likes relationships
        // 2) deleting the party tricks relationships
        // 3) setting any AttractedTo field to NULL for any people who have a crush on the person
        // 4) deleting the person
        // If successful reload the page, otherwise send error message.
        // Query 1: delete "like" relationships belonging to the person 
        mysql.pool.query(likeDeleteAll, todelete, function(error, results, fields){
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
                // query 2: delete "party trick" relationships belonging to the person
                mysql.pool.query(trickDeleteAll, todelete, function(error, results, fields){
                    // error handler
                    // function from https://github.com/knightsamar/CS340-Sample-Web-App
                    // date retrieved October 29,2018
                    if(error)
                    {
                        console.log(JSON.stringify(error));
                        res.statusMessage = JSON.stringify(error);
                        res.status(500).send(error);
                    }
                    else
                    {
                        // query 3: update the AttractedTo field of people who have a crush on the
                        // deleted person to null.
                        mysql.pool.query(nullCrushAll, todelete, function(error, results, fields){
                            // error handler
                            // function from https://github.com/knightsamar/CS340-Sample-Web-App
                            // date retrieved October 29,2018
                            if(error)
                            {
                                console.log(JSON.stringify(error));
                                res.statusMessage = JSON.stringify(error);
                                res.status(500).send(error);
                            }
                            else
                            {
                                // query 4: delete the person
                                mysql.pool.query(personDelete, todelete, function(error, results, fields){
                                    // error handler
                                    // function from https://github.com/knightsamar/CS340-Sample-Web-App
                                    // date retrieved October 29,2018
                                    if(error)
                                    {
                                        console.log(JSON.stringify(error));
                                        res.statusMessage = JSON.stringify(error);
                                        res.status(500).send(error);
                                    }
                                    else
                                    {
                                        res.redirect('/likes');
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    return router;
}();
