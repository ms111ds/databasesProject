// set up export functionality and required packages
module.exports = function(){
    var express = require('express');
    var router = express.Router();


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
        mysql.pool.query("SELECT LikeID, LikeDesc, IsExpensive FROM Likes", function(error, results, fields){
            // error handler
            // function from https://github.com/knightsamar/CS340-Sample-Web-App
            // date retrieved October 29,2018
            if (error){
                res.write(JSON.stringify(error), function(){res.end()});
            }
            // change value of content and change IsExpensive to text
            content.likeList = results;
            for (var i in content.likeList){
                if (content.likeList[i].IsExpensive === 1)
                    content.likeList[i].IsExpensive = "expensive";
                else
                    content.likeList[i].IsExpensive = "cheap";
            }
            // make sure this function completes before returning
            complete();
        }); 
    }


    /********************************************************************
     * get handler (likes page)
     * Description: handles request to see the likes page by obtaining
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
        content.newLike = website + '/likes/add';
        content.deleteLike = website + '/likes/delete';
        // query the database for all likes
        getLikes(res, mysql, content, complete);
        // define function that ensures the query above is completed
        // before rendering the web page
        // function from https://github.com/knightsamar/CS340-Sample-Web-App
        // date retrieved October 29,2018
        function complete(){
           counter++;
           if (counter === 1)
              res.render('likes', content);
        }   
    });

    /********************************************************************
     * add likes handler
     * Description: handles request to add a new like.
     *******************************************************************/
    router.post('/add', function(req, res, next)  {
        // define variables
        var website = req.app.get('website');
        var mysql = req.app.get('mysql');
        var sqlcode = "INSERT INTO Likes (LikeDesc, IsExpensive) VALUES (?,?)";
        var insertvals = [req.body.likeDesc, req.body.isExpensive];
        // query the database to insert new like, If successful reload the page,
        // otherwise send error message.
        mysql.pool.query(sqlcode, insertvals,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error));
                res.statusMessage = JSON.stringify(error);
                res.status(500).send(error);
            }
            else
                res.redirect('/likes');
        });
    });


    /********************************************************************
     * delete like handler
     * Description: handles request to delete a like in the database.
     *******************************************************************/
    router.post('/delete', function(req, res, next)
    {
        // define variables
        var website = req.app.get('website');
        var mysql = req.app.get('mysql');
        var sqlquery1 = "DELETE FROM SpringBreakerLikes WHERE LikeID = (SELECT LikeID FROM Likes WHERE LikeDesc=?)";
        var sqlquery2 = "DELETE FROM Likes WHERE LikeDesc = ?";
        var todelete = [req.body.likeDesc];
        // query the database to delete a like. If successful reload the page.
        // otherwise send error message.There are two queries involved.
        // query 1: delete any entry in the SpringBreakerLikes many-to-many relationship table
        // with the specific like.
        mysql.pool.query(sqlquery1, todelete, function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error));
                res.statusMessage = JSON.stringify(error);
                res.status(500).send(error);
            }
            else
            {
                // query 2: delete the like
                mysql.pool.query(sqlquery2, todelete, function(error, results, fields){
                    if(error)
                    {
                        console.log(JSON.stringify(error));
                        res.statusMessage = JSON.stringify(error);
                        res.status(500).send(error);
                    }
                    else
                        res.redirect('/likes');
                });
            }
        });
    });

    return router;
}();
