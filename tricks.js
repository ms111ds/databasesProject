// set up export functionality and required packages
module.exports = function(){
    var express = require('express');
    var router = express.Router();


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
        mysql.pool.query("SELECT TrickID, TrickDesc, IsFlashy FROM PartyTrick", function(error, results, fields){
            // error handler
            // function from https://github.com/knightsamar/CS340-Sample-Web-App
            // date retrieved October 29,2018
            if (error){
                res.write(JSON.stringify(error), function(){res.end()});
            }
            // change value of content and change IsFlashy to text
            content.trickList = results;
            for (var i in content.trickList){
                if (content.trickList[i].IsFlashy === 1)
                    content.trickList[i].IsFlashy = "flashy";
                else
                    content.trickList[i].IsFlashy = "intellectual";
            }
            // make sure this function completes before returning
            complete();
        }); 
    }


    /********************************************************************
     * get handler (party tricks page)
     * Description: handles request to see the party tricks page by
     * obtaining the necessary information from the database and
     * rendering the page.
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
        content.newTrick = website + '/partyTrick/add';
        content.deleteTrick = website + '/partyTrick/delete';
        // query the database for all party tricks 
        getTricks(res, mysql, content, complete);
        // define function that ensures the query above is completed
        // before rendering the web page
        // function from https://github.com/knightsamar/CS340-Sample-Web-App
        // date retrieved October 29,2018
        function complete(){
           counter++;
           if (counter === 1)
              res.render('partyTrick', content);
        }   
    });

    /********************************************************************
     * add party trick handler
     * Description: handles request to add a new party trick.
     *******************************************************************/
    router.post('/add', function(req, res, next)  {
        // define variables
        var website = req.app.get('website');
        var mysql = req.app.get('mysql');
        var sqlcode = "INSERT INTO PartyTrick (TrickDesc, IsFlashy) VALUES (?,?)";
        var insertvals = [req.body.trickDesc, req.body.isFlashy];
        // query the database to insert new party trick, If successful reload the page,
        // otherwise send error message.
        mysql.pool.query(sqlcode, insertvals,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error));
                res.statusMessage = JSON.stringify(error);
                res.status(500).send(error);
            }
            else
                res.redirect('/partyTrick');
        });
    });


    /********************************************************************
     * delete party trick handler
     * Description: handles request to delete a party trick in the 
     * database.
     *******************************************************************/
    router.post('/delete', function(req, res, next)
    {
        // define variables
        var website = req.app.get('website');
        var mysql = req.app.get('mysql');
        var sqlquery1 = "DELETE FROM SpringBreakerPartyTrick WHERE TrickID = (SELECT TrickID FROM PartyTrick WHERE TrickDesc=?)";
        var sqlquery2 = "DELETE FROM PartyTrick WHERE TrickDesc = ?";
        var todelete = [req.body.trickDesc];
        // query the database to delete a party trick. If successful reload the page.
        // otherwise send error message.There are two queries involved.
        // query 1: delete any entry in the SpringBreakerPartyTrick many-to-many relationship table
        // with the specific party trick.
        mysql.pool.query(sqlquery1, todelete, function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error));
                res.statusMessage = JSON.stringify(error);
                res.status(500).send(error);
            }
            else
            {
                // query 2: delete the party trick
                mysql.pool.query(sqlquery2, todelete, function(error, results, fields){
                    if(error)
                    {
                        console.log(JSON.stringify(error));
                        res.statusMessage = JSON.stringify(error);
                        res.status(500).send(error);
                    }
                    else
                        res.redirect('/partyTrick');
                });
            }
        });
    });

    return router;
}();
