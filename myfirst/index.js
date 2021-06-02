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
const logger = function(res, req, next) {
    console.log(`${req.protocol}:??${req.get('host')}${req.originalUrl}`);
    next();
}

//Init middleware
app.use(logger);


//set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.get ('/api/test', function(req, res){
    res.json({"status":"ok"});
})

//routes
app.get ('/api/members', function(req, res){
    res.json(members);
})

app.listen(PORT, function () { console.log(`Server started on port ${PORT}`)});