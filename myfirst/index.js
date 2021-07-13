const express = require ('express');
const path = require('path');
const { ok } = require('assert');
const app = express();
const PORT = process.env.PORT || 3000;
const members = require('./Members');

var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'student',
  password: 'website',
  database: 'node'
})

var MongoClient = require('mongodb').MongoClient

app.set('view engine', 'pug')

/* app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
}); */

//Middleware
const logger = function(req, res, next) {
    console.log('Request Type:', req.method);
    console.log('Request URL:', req.originalUrl)
    next();
}

//Init middleware
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({extended: false}))

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Routes


app.get ('/api/test', function(req, res){
    res.json({"status":"ok"});
})

app.get ('/api/test2', function(req, res){
    const response = [{
        status: 'ok',
        forename: 'Jonathan',
        surname: 'Edwards',
        email: 'jedwards8@uclan.ac.uk'
    }]
    res.json(response);
})


app.get ('/api/members', function(req, res){
    res.json(members);
})

app.get ('/pug/members', function(req, res){
    res.render('members', {data: members})
})

app.get ('/api/members/:id', function (req, res){
    const found = members.some(function(member){
        return member.id === parseInt(req.params.id)
    })
    if (found){
        res.json(members.filter(function(member){
            return member.id === parseInt(req.params.id)
        }))
    }
    else{
        res.status(400).json({msg: `Record not found for id: ${req.params.id}`})
    }
});

app.post('/api/members', function(req, res){
    const newid = members.length +1;
    const newMember = {
        id: newid,
        forename: req.body.fname,
        surname: req.body.sname,
        email: req.body.email,
    }
    if (!newMember.forename || !newMember.surname || !newMember.email){
        return res.status(400).json({msg: "required fields missing"})
    }
    members.push(newMember);
    return res.json(members);
});

app.get ('/api/mongodb/members', function(req, res){
    MongoClient.connect('mongodb://localhost:27017/members', function (err, client) {
        if (err) throw err
    
    var db = client.db('local')
    db.collection('members').find().toArray(function (err, result) {
                    if (err) throw err
                    res.json(result)
            })
    })
})

app.get ('/api/mongodb/members/:id', function(req, res){
    MongoClient.connect('mongodb://localhost:27017/members', function (err, client) {
        if (err) throw err
    
    var db = client.db('local')
    db.collection('members').find({"id": `${req.params.id}`}).toArray(function (err, result) {
                    if (err) throw err
                    res.json(result)
            })
    })
})

app.get ('/api/mysql/members', function(req, res){
    connection.connect()
    connection.query('SELECT * FROM memberse', function (err, result, fields) {
    if (err) throw err
        res.json(result)
    })
    connection.end()
})

app.get ('/api/mysql/members/:id', function(req, res){
    connection.connect()
    connection.query('SELECT * FROM memberse WHERE id = \''+req.params.id+'\'', function (err, result, fields) {
    if (err) throw err
        res.json(result)
    })
    connection.end()
})

//Listener
app.listen(PORT, function () { console.log(`Server started on port ${PORT}`)});