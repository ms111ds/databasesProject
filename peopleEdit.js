// set up export functionality and required packages
module.exports = function(){
    var express = require('express');
    var router = express.Router();


    /*********************************************************************
     * getPersonInfo
     * Description: Queries database for info on a provided name and passes
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
     * personName - name of the person to query
    ********************************************************************/ 
    function getPersonInfo(res, mysql, content, complete, personName){
        // sql query
        var queryAll = "SELECT Name, Age, IsFemale FROM SpringBreakers WHERE Name = ?;";
        mysql.pool.query(queryAll, [personName],function(error, results, fields){
            // function from https://github.com/knightsamar/CS340-Sample-Web-App
            // date retrieved October 29,2018
            // error handler
            if (error){
                res.write(JSON.stringify(error), function() {res.end()});
            }
            // assign query results to content 
            if (results === undefined || results.length ===0)
                content.exit = 1;
            else
            {
                content.Name = results[0].Name;
                if (results[0].IsFemale === 1)
                {
                    content.femaleSelect = "selected";
                    content.maleSelect = "";
                } 
                else
                {
                    content.femaleSelect = "";
                    content.maleSelect = "selected";
                } 
                content.Age = results[0].Age;
            }
            // make sure this function completes before returning
            complete();
        }); 
    }



    /*********************************************************************
     * getFood
     * Description: Queries database for all available food and passes
     * this information into the content parameter. The parameters passed
     * in are used for the following. (Also selects current favourite food)
     * res - the calling route's response variable. Used to pass any errors
     *       from the query
     * mysql - the sql pool from the calling route. Used to access the DB
     * content - the content variable from the calling route. Will contain
     *           the results of the query if successful
     * complete - a function defined in the calling route that will render
     *            the page. Used to ensure sql query completes before
     *            rendering page.
     * personName - the name of the person being selected
    ********************************************************************/
    function getFood(res, mysql, content, complete, personName){
        // sql query
        var queryPt1 = "SELECT f.FoodID, f.FoodName, sbf.FavouriteFood AS SelectedFood ";
        var queryPt2 = "FROM Food f LEFT JOIN (SELECT FavouriteFood FROM SpringBreakers "; 
        var queryPt3 = "WHERE Name = ?) sbf ON f.FoodID = sbf.FavouriteFood;";
        var queryAll = queryPt1 + queryPt2 + queryPt3;
        mysql.pool.query(queryAll, [personName], function(error, results, fields){
            // error handler
            // function from https://github.com/knightsamar/CS340-Sample-Web-App
            // date retrieved October 29,2018
            if (error){
                res.write(JSON.stringify(error), function() {res.end()});
            }
            // attach results to content and make current favourite food selected
            content.foodList = results;
            for (i in content.foodList)
            {
                if (content.foodList[i].SelectedFood != null)
                    content.foodList[i].SelectedFood = "selected";
            }
            // make sure this function completes before returning
            complete();
        }); 
    }


    /*********************************************************************
     * getDrinks
     * Description: Queries database for all available drinks and passes
     * this information into the content parameter. The parameters passed
     * in are used for the following.( Also gets current favourite drink.)
     * res - the calling route's response variable. Used to pass any errors
     *       from the query
     * mysql - the sql pool from the calling route. Used to access the DB
     * content - the content variable from the calling route. Will contain
     *           the results of the query if successful
     * complete - a function defined in the calling route that will render
     *            the page. Used to ensure sql query completes before
     *            rendering page.
     * personName - the name of the person who is being editted
    ********************************************************************/
    function getDrinks(res, mysql, content, complete, personName){
        // sql query
        var queryPt1 = "SELECT d.DrinkID, d.DrinkName, sbd.FavouriteDrink AS SelectedDrink ";
        var queryPt2 = "FROM Drinks d LEFT JOIN	(SELECT FavouriteDrink FROM SpringBreakers ";
        var queryPt3 = "WHERE Name = ?) sbd ON d.DrinkID = sbd.FavouriteDrink;";
        var queryAll = queryPt1 + queryPt2 + queryPt3;
        mysql.pool.query(queryAll, [personName], function(error, results, fields){
            // error handler
            // function from https://github.com/knightsamar/CS340-Sample-Web-App
            // date retrieved October 29,2018
            if (error){
                res.write(JSON.stringify(error), function() {res.end()});
            }
            // attach results to content and mark the current favourite drink
            content.drinkList = results;
            for (i in content.drinkList)
            {
                if (content.drinkList[i].SelectedDrink != null)
                    content.drinkList[i].SelectedDrink = "selected";
            }
            // make sure this function completes before returning
            complete();
        }); 
    }


    /*********************************************************************
     * getLikes
     * Description: Queries database for all available likes and passes
     * this information into the content parameter. The parameters passed
     * in are used for the following. (Also get current likes for the
     * person being editted)
     * res - the calling route's response variable. Used to pass any errors
     *       from the query
     * mysql - the sql pool from the calling route. Used to access the DB
     * content - the content variable from the calling route. Will contain
     *           the results of the query if successful
     * complete - a function defined in the calling route that will render
     *            the page. Used to ensure sql query completes before
     *            rendering page.
     * personName - the name of the person who is being editted
    ********************************************************************/ 
    function getLikes(res, mysql, content, complete, personName){
        // sql query
        var queryPt1 = "SELECT l.LikeDesc, s.PersonID AS SelectedLike FROM Likes l ";
        var queryPt2 = "LEFT JOIN (SELECT sb.PersonID, sbl.LikeID FROM SpringBreakers sb ";
        var queryPt3 = "INNER JOIN SpringBreakerLikes sbl ON sb.PersonID = sbl.PersonID ";
        var queryPt4 = "WHERE sb.Name = ?) s ON l.likeID = s.LikeID;";
        var queryAll = queryPt1 + queryPt2 + queryPt3 + queryPt4;
        mysql.pool.query(queryAll, [personName], function(error, results, fields){
            // error handler
            // function from https://github.com/knightsamar/CS340-Sample-Web-App
            // date retrieved October 29,2018
            if (error){
                res.write(JSON.stringify(error), function() {res.end()});
            }
            // attach results to content
            content.likeList = results;
            for (i in content.likeList)
            {
                if (content.likeList[i].SelectedLike != null)
                    content.likeList[i].SelectedLike = "checked";
            }
            // make sure this function completes before returning
            complete();
        }); 
    }


    /*********************************************************************
     * getTricks
     * Description: Queries database for all available party tricks and passes
     * this information into the content parameter. The parameters passed
     * in are used for the following. (Also gets current party tricks for the
     * person being editted)
     * res - the calling route's response variable. Used to pass any errors
     *       from the query
     * mysql - the sql pool from the calling route. Used to access the DB
     * content - the content variable from the calling route. Will contain
     *           the results of the query if successful
     * complete - a function defined in the calling route that will render
     *            the page. Used to ensure sql query completes before
     *            rendering page.
     * personName - the name of the person who is being editted
    ********************************************************************/ 
    function getTricks(res, mysql, content, complete, personName){
        // sql query
        var queryPt1 = "SELECT pt.TrickDesc, s.PersonID AS SelectedTrick FROM PartyTrick pt ";
        var queryPt2 = "LEFT JOIN (SELECT sb.PersonID, sbpt.TrickID FROM SpringBreakers sb ";
        var queryPt3 = "INNER JOIN SpringBreakerPartyTrick sbpt ON sb.PersonID = sbpt.PersonID ";
        var queryPt4 = "WHERE sb.Name = ?) s ON pt.TrickID = s.TrickID;";
        var queryAll = queryPt1 + queryPt2 + queryPt3 + queryPt4;
        mysql.pool.query(queryAll, [personName], function(error, results, fields){
            // error handler
            // function from https://github.com/knightsamar/CS340-Sample-Web-App
            // date retrieved October 29,2018
            if (error){
                res.write(JSON.stringify(error), function() {res.end()});
            }
            // attach results to content
            content.trickList = results;
            for (i in content.trickList)
            {
                if (content.trickList[i].SelectedTrick != null)
                    content.trickList[i].SelectedTrick = "checked";
            }
            // make sure this function completes before returning
            complete();
        }); 
    }


    /*********************************************************************
     * getCrushes
     * Description: Queries database for all available people and passes
     * this information into the content parameter. The parameters passed
     * in are used for the following. (Also gets current crush for the
     * person being editted)
     * res - the calling route's response variable. Used to pass any errors
     *       from the query
     * mysql - the sql pool from the calling route. Used to access the DB
     * content - the content variable from the calling route. Will contain
     *           the results of the query if successful
     * complete - a function defined in the calling route that will render
     *            the page. Used to ensure sql query completes before
     *            rendering page.
     * personName - the name of the person who is being editted
    ********************************************************************/ 
    function getCrushes(res, mysql, content, complete, personName){
        // sql query
        var queryPt1 = "SELECT sb1.Name AS PersonName, sb2.AttractedTo As SelectedCrush ";
        var queryPt2 = "FROM SpringBreakers sb1 LEFT JOIN (SELECT AttractedTo FROM SpringBreakers ";
        var queryPt3 = "WHERE Name =?) sb2 ON sb1.PersonID = sb2.AttractedTo;";
        var queryAll = queryPt1 + queryPt2 + queryPt3;
        mysql.pool.query(queryAll, [personName], function(error, results, fields){
            // error handler
            // function from https://github.com/knightsamar/CS340-Sample-Web-App
            // date retrieved October 29,2018
            if (error){
                res.write(JSON.stringify(error), function() {res.end()});
            }
            // attach results to content
            content.personList = results;
            for (i in content.personList)
            {
                if (content.personList[i].SelectedCrush != null)
                    content.personList[i].SelectedCrush = "selected";
            }
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
        content.exit = 0;
        var personName = req.query.person;
        // update the content varable with the proper website links
        content.homePage = website; 
        content.peoplePage = website + '/people';
        content.foodPage = website + '/food';
        content.drinksPage = website + '/drinks';
        content.likesPage = website + '/likes';
        content.tricksPage = website +'/partyTrick';
        content.editSubmit = website +'/peopleEdit/submitUpdate';
        // query the database for all spring breakers, food, drinks
        // likes, and party tricks
        getPersonInfo(res, mysql, content, complete, personName);
        getFood(res, mysql, content, complete, personName);
        getDrinks(res, mysql, content, complete, personName);
        getLikes(res, mysql, content, complete, personName);
        getTricks(res, mysql, content, complete, personName);
        getCrushes(res, mysql, content, complete, personName);
        // define function that ensures the query above is completed
        // before rendering the web page
        // function from https://github.com/knightsamar/CS340-Sample-Web-App
        // date retrieved October 29,2018
        function complete(){
           counter++;
           if (counter === 6)
           {
              if (content.exit === 1)
                 res.redirect(content.homePage);
              else
                 res.render('peopleEdit', content);
           }
        }   
    });

    /********************************************************************
     * submit update handler
     * Description: handles request to add a new spring breaker.
     *******************************************************************/
    router.post('/submitUpdate', function(req, res, next)  {
        // define variables for website url and mysql
        var website = req.app.get('website');
        var mysql = req.app.get('mysql');
        var myUrl = website + '/people';

        // query the database to update a person, If successful go back to the peron
        // page, otherwise send error message. Goes through 6 steps
        // 1) Gets the ID of the original person
        // 2) Deletes the person's likes in the SpringBreakerLikes table
        // 3) Deletes the person's party tricks in the SpringBreakerPartyTricks table
        // 4) Updates the SpringBreakers table with the new information 
        // 5) Adds new likes in the SpringBreakersLikes table
        // 6) Adds new party tricks in the SpringBreakersPartyTricks table

        // query 1: get ID of the original person 
        var originalId;
        var personQuery = "SELECT PersonID FROM SpringBreakers WHERE Name = ?"; 
        mysql.pool.query(personQuery, [req.body.originalName], function(error, results, fields)
        {
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
                originalId = results[0].PersonID;
                // query 2: delete the likes for a person 
                var likeDelete = "DELETE FROM SpringBreakerLikes WHERE PersonID = ?";
                mysql.pool.query(likeDelete, [originalId], function(error, results, fields)
                {
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
                        // querty 3: delete the party tricks for a person
                        var trickDelete = "DELETE FROM SpringBreakerPartyTrick WHERE PersonID = ?";
                        mysql.pool.query(trickDelete, [originalId], function(error, results, fields)
                        {
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
                                // querty 4: update the spring breakers table
                                var sbQueryPt1 = "UPDATE SpringBreakers SET Name = ?, IsFemale = ?, Age = ?, ";
                                var sbQueryPt2 = "FavouriteDrink = (SELECT DrinkID FROM Drinks WHERE DrinkName = ?), ";
                                var sbQueryPt3 = "FavouriteFood = (SELECT FoodID FROM Food WHERE FoodName = ?), ";
                                var sbQueryPt4 = "AttractedTo = (SELECT PersonID FROM (SELECT PersonID FROM SpringBreakers ";
                                var sbQueryPt5 = "WHERE Name = ?) As personTemp) WHERE PersonID = ?;"
                                var sbQueryAll = sbQueryPt1 + sbQueryPt2 + sbQueryPt3 + sbQueryPt4 + sbQueryPt5;
                                var insertPerson = [req.body.name, req.body.isFemale, req.body.age, req.body.drink, req.body.food, req.body.crush, originalId];
                                mysql.pool.query(sbQueryAll, insertPerson, function(error, results, fields)
                                {
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
                                        // add new likes to the SpringBreakersLikes table
                                        var likeQuery = "";
                                        var insertLike = [];
                                        if(req.body.likes.length === 0)
                                            likeQuery = "Select ''";
                                        else
                                        {
                                            var likePt1 = "INSERT INTO SpringBreakerLikes (PersonID, LikeID) values ";
                                            var likePt2 = "(?, ";
                                            var likePt3 = "(SELECT LikeID FROM Likes WHERE LikeDesc = ?))";
                                            var likeValue = likePt2 + likePt3;
                                            var likeAllValues = "";
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
                                                insertLike.push(originalId);
                                                insertLike.push(req.body.likes[i]);
                                            }
                                        }
                                        mysql.pool.query(likeQuery, insertLike, function(error, results, fields)
                                        {
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
                                                // add new likes to the SpringBreakersLikes table
                                                var trickQuery = "";
                                                var insertTrick = [];
                                                if(req.body.tricks.length === 0)
                                                    trickQuery = "Select ''";
                                                else
                                                {
                                                    var trickPt1 = "INSERT INTO SpringBreakerPartyTrick (PersonID, TrickID) values ";
                                                    var trickPt2 = "(?, ";
                                                    var trickPt3 = "(SELECT TrickID FROM PartyTrick WHERE TrickDesc = ?))";
                                                    var trickValue = trickPt2 + trickPt3;
                                                    var trickAllValues = "";
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
                                                        insertTrick.push(originalId);
                                                        insertTrick.push(req.body.tricks[i]);
                                                    }
                                                }
                                                mysql.pool.query(trickQuery, insertTrick, function(error, results, fields)
                                                {
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
                                                        res.status(200);
                                                        res.send(myUrl);
                                                    }
                                                });
                                            }
                                        });
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
