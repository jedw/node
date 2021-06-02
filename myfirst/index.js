const express = require ('express');
const path = require('path');
const { ok } = require('assert');
const app = express();
const PORT = process.env.PORT || 3000;
const members = require('./Members');

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


//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.get ('/api/test', function(req, res){
    res.json({"status":"ok"});
})

//Routes
app.get ('/api/members', function(req, res){
    res.json(members);
})

//Listener
app.listen(PORT, function () { console.log(`Server started on port ${PORT}`)});