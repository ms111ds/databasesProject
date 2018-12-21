// set up export functionality and required packages
module.exports = function(){
    var express = require('express');
    var router = express.Router();


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
        mysql.pool.query("SELECT DrinkID, DrinkName, IsAlcoholic FROM Drinks", function(error, results, fields){
            // error handler
            // function from https://github.com/knightsamar/CS340-Sample-Web-App
            // date retrieved October 29,2018
            if (error){
                res.write(JSON.stringify(error), function(){res.end()});
            }
            // change value of content and change IsAlcolholic to text
            content.drinkList = results;
            for (var i in content.drinkList){
            if (content.drinkList[i].IsAlcoholic === 1)
                content.drinkList[i].IsAlcoholic = "alcoholic";
            else
                content.drinkList[i].IsAlcoholic = "non alcoholic";
            }
            // make sure this function completes before returning
            complete();
        }); 
    }


    /********************************************************************
     * get handler (drinks page)
     * Description: handles request to see the drinks page by obtaining
     * the necessary information from the database and rendering the page.
     *******************************************************************/
    router.get('/', function(req, res, next)  {
        // set status to 200 and create variables
        res.status(200);
        var website = req.app.get('website');
        var mysql = req.app.get('mysql');
        var counter = 0;
        var content = {};
        // update the content variable with the proper website links
        content.homePage = website; 
        content.peoplePage = website + '/people';
        content.foodPage = website + '/food';
        content.drinksPage = website + '/drinks';
        content.likesPage = website + '/likes';
        content.tricksPage = website +'/partyTrick';
        content.newDrink = website + '/drinks/add';
        content.deleteDrink = website + '/drinks/delete';
        // query the database for all drinks 
        getDrinks(res, mysql, content, complete);
        // define function that ensures the query above is completed
        // before rendering the web page
        // function from https://github.com/knightsamar/CS340-Sample-Web-App
        // date retrieved October 29,2018
        function complete(){
           counter++;
           if (counter === 1)
              res.render('drinks', content);
        }   
    });

    /********************************************************************
     * add drink handler
     * Description: handles request to add a new drink.
     *******************************************************************/
    router.post('/add', function(req, res, next)  {
        // define variables
        var website = req.app.get('website');
        var mysql = req.app.get('mysql');
        var sqlcode = "INSERT INTO Drinks (DrinkName, IsAlcoholic) VALUES (?,?)";
        var insertvals = [req.body.drinkName, req.body.isAlcoholic];
        // query the database to insert new food, If successful reload the page,
        // otherwise send error message.
        mysql.pool.query(sqlcode, insertvals,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error));
                res.statusMessage = JSON.stringify(error);
                res.status(500).send(error);
            }
            else
                res.redirect('/drinks');
        });
    });

     /********************************************************************
     * delete drink handler
     * Description: handles request to delete a drink in the database.
     *******************************************************************/
    router.post('/delete', function(req, res, next)  {
        // define variables
        var website = req.app.get('website');
        var mysql = req.app.get('mysql');
        var sqlcode1Pt1 = "UPDATE SpringBreakers SET FavouriteDrink = NULL ";
        var sqlcode1Pt2 = "WHERE FavouriteDrink = ";
        var sqlcode1Pt3 = "(SELECT DrinkID FROM Drinks WHERE DrinkName=?);";
        var sqlcode1All = sqlcode1Pt1 + sqlcode1Pt2 + sqlcode1Pt3;
        var sqlcode2 = "DELETE FROM Drinks WHERE DrinkName=?";
        // query the database to delete a drink. If successful reload the page.
        // otherwise send error message.
        mysql.pool.query(sqlcode1All, [req.body.drinkName],function(error, results, fields){
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
                mysql.pool.query(sqlcode2, [req.body.drinkName], function(error, results, fields){
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
                        res.redirect('/drinks');
                    }
                });
            }
        });
    });

    return router;
}();
