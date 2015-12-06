//This code, var express through app.set('port',3000) is code from lectures and the class. The implementation that I have is the exact same as the lectures
//This program is a game where there are 100 random zip codes from US locations. You have to guess the temperature within 5 degrees without knowing the name
//of the city. You get 3 points for a correct answer and lose 1 point for an incorrect. 

var express = require('express');

var app = express();

var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var session = require('express-session');

var request = require('request');

//This code connects to the database, this was given by the instructor. 
var mysql = require('mysql');

var pool = mysql.createPool({
  host  : 'localhost',
  user  : 'student',
  password: 'default',
  database: 'student'
});


app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));



app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 1976);



//This is the basic code of the game. 

//This next function is the function given by the instructor to reset the database and create a new one, a very bad idea generally, but 
//Works well for this course


app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
      context.results = "Table reset";
      res.send("Table Reset");
    })
  });
});

app.get('/',function(req,res,next){
	
    res.render('data');
 
});


app.get('/tables',function(req,res,next){
console.log("getting to tables function, should be sending back everything")
  var results = {};
  pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
console.log("Got to after the mysql query");
	res.setHeader('Content-Type', 'application/json');
    
    res.send(JSON.stringify(rows));
  });
});

app.get('/insert',function(req,res,next){
console.log("Getting into insert");
	  var context = {};
	  pool.query("INSERT INTO workouts (`name`,`reps`,`weight`,`date`,`lbs`) VALUES (?,?,?,?,?)", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], function(err, result){
		if(err){
		  next(err);
		  return;
		}
		console.log("Got past that insert stuff");
		context.results = "Inserted id " + result.insertId;
		res.send(context.results);
  });
});


app.get('/simple-update',function(req,res,next){
	console.log("Simple update ping -----------------------------------------------");
  var context = {};
  pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ",
    [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs, req.query.subID,],
    function(err, result){
    if(err){
      next(err);
      return;
    }
	console.log("Update successful -------------------------------------------------------------------------")
    context.results = "Updated " + result.changedRows + " rows.";
    res.send(context.results);
  });
});

app.get('/delete',function(req,res,next){
console.log("Getting to delete function");	
	var context = {};
	pool.query("DELETE FROM workouts WHERE id=?",
		[req.query.id],
		function(err, result){
		if(err){
		  next(err);
		  return;
		}
		context.results = "Updated " + 'one' + " rows."; //result.deletedRows 
		res.send(context.results);
  });
});

app.get('/generate-update-form-data',function(req,res,next){
console.log("Getting to request for form building data function");	

	pool.query("SELECT id, name, reps, weight, date, lbs FROM workouts WHERE id=? ",
		[req.query.id],
		function(err, rows, fields){
		if(err){
		  next(err);
		  return;
		}
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(rows));
		
  });
});



//These next two are right from the lectures
app.use(function(req,res)
{
	res.status(404);
	res.render('404');
	
});

app.use(function(err,req,res,next){
	res.type('plain/text');
	res.status(500);
	res.render('500');	
});




app.listen(app.get('port'), function(){
	console.log('Started on port 1976');
	
});
