var mysql = require('mysql');

var con = mysql.createConnection({
  host: '142.4.201.250',
  user: 'root',
  password: 'bas59021726',
  database:'db_fitness'
});


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected Success!");
});

module.exports=con