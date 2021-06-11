var sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/makeasy.db',(err) =>{
	if (err) {
		console.log(err.message);
	}
	console.log('Connection ok');
})
module.exports.db = db;
/*var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "makeasy"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to mysql Database!");
});

module.exports.con = con;*/