// bring in the required packages
var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
// initialize express, handlebars, and bodyparser
var app = express();
app.engine('hbs', exphbs({defaultLayout:'main.hbs'}));
app.use(bodyParser.json());
// folder for static files
app.use(express.static('public'));
// get website
app.set('port', 9630);
var website = 'http://localhost:' + app.get('port');
//var website = 'http://access.engr.oregonstate.edu:' + app.get('port');

// configurations
app.set('view engine', 'hbs');
app.set('mysql', mysql);
app.set('website', website);

app.use('/', require('./homepage.js'));
app.use('/people', require('./people.js'));
app.use('/food', require('./food.js'));
app.use('/drinks', require('./drinks.js'));
app.use('/likes', require('./likes.js'));
app.use('/partyTrick', require('./tricks.js'));
app.use('/peopleEdit', require('./peopleEdit.js'));





/**************************************************************
 * 404 error handler
 **************************************************************/
app.use(function(req,res){
    res.status(404);
    res.render('404');
});

/**************************************************************
 * 500 error handler
 **************************************************************/
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});


/**************************************************************
 * start listening 
 **************************************************************/
app.listen(app.get('port'), function(){
    console.log('Express started http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
