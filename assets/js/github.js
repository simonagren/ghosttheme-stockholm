//github.js

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'a9tw3rjw',
  database: 'github_repos'
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'a9tw3rjw',
  database: 'github_repos'
});

// Main route sends our HTML file

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/projects');
});

// Update MySQL database

app.get('/projects', function (req, res) {
  con.query('SELECT * FROM githubrepos', (err,rows) => {
    if(err) throw err;

    console.log('Data received from Db:\n');
    console.log(rows);
  });
});

// Begin listening

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
