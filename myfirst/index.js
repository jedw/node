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
app.use(express.json());
app.use(express.urlencoded({extended: false}))

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.get ('/api/test', function(req, res){
    res.json({"status":"ok"});
})

app.get ('/api/members', function(req, res){
    res.json(members);
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

//Listener
app.listen(PORT, function () { console.log(`Server started on port ${PORT}`)});