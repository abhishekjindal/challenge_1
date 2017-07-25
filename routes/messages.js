var express = require('express');
var sha256 = require('sha256');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('messages.db');



/* GET home page. */
router.get('/:hash', function(req, res, next) {
	var hash = req.params.hash;
	db.serialize(function(){
  		db.all("SELECT * FROM messages WHERE hash='"+hash+"'", function(err, rows) {  
  			if(err){
  				console.log("error",err);
  			} else {
  				if (rows.length != 0) {
  					res.send(JSON.stringify({"message": rows[0].message}) + "\n");
  				} else {
  					res.writeHead(404);
  					res.end(JSON.stringify({"err_msg": "Message not found"}) + "\n");
  				}
   			}
  		});
  	});
});

router.get('/'), function(req, res, next) {
  res.render('readme');
}

router.post('/', function(req, res, next) {
  	var message = req.body.message;
  	var digest = sha256(message);
  	db.serialize(function(){
  		db.all("SELECT * FROM messages WHERE hash='"+digest+"'", function(err, rows) {  
  			if(err){
  				console.log("error",err);
  			} else {
  				if (rows.length == 0) {
  					db.run("INSERT INTO messages(hash,message) VALUES ('"+digest+"','"+message+"')");
  				} else {
  					console.log("hash already exists");
  				}
   			}
  		});
  	});
  	res.send(JSON.stringify({"digest": digest}) + "\n");
});


module.exports = router;
