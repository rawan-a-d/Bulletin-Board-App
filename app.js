const pg = require('pg');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('views', 'src/views');
app.set('view engine', 'pug');

app.use('/',bodyParser()); //creats key-value pairs request.body in app.post, e.g. request.body.username
app.use(express.static('src/public'))

var connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard';

// -The first page shows people a form where they can add a new message.
app.get('/', function(req,res){ // get the pug file and show it on the browser
	res.render('index');
});

app.post('/', function(req,res){ // app.post handles the data that the user sent and add it to the database
	var title = req.body.title
	var message = req.body.body;
	pg.connect(connectionString , function( err, client, done){ //our real connection to the database
		client.query("insert into messages (title, body) values ('" + title +"','" + message +"')", function(err){
			console.log("title:"+ title);
			console.log("message:"+ message);
			if(err){
				throw err;
			}
			done();
			pg.end();
		});
	}); 
	console.log("title:"+ title);
	console.log("message:"+ message);
	res.send('Your message has been sent');
});

// -The second page shows each of the messages people have posted.

// app.get connects to the database and select some data from it and then it receives the pug file and transforms it to HTML and show it on the browser
app.get('/messages',function(req,res){
	pg.connect(connectionString, function(err, client, done){
		client.query('select title,body from messages', function(err,result){
			if(err){
				throw err;
			}
			console.log('result', result.rows)

			done();
			pg.end();
			res.render('messages', {messages: result.rows});
		})
	})
})



// server listens to clients (people with their browsers) who want to connect
var listener = app.listen(3000, function () {
	console.log('Example app listening on port: ' + listener.address().port);
});